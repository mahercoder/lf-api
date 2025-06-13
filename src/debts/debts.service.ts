import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Debts, Debt } from './schemas/debts.schemas';
import mongoose from 'mongoose';
import { DebtDto } from './dto/debt.dto';

@Injectable()
export class DebtsService {
    constructor(
        @InjectModel(Debts.name)
        private debtsModel: mongoose.Model<Debts>
    ) {}

    /**
     * Qarzlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param user Foydalanuvchi
     * @param debts Yangi qarzlar massivi
     */
    async createOrAdd(
        user: any, 
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        try {
            const existingDoc = await this.debtsModel.findOne({ 
                user: user._id 
            });

            if (existingDoc) {
                await this.debtsModel.updateOne(
                    { user: user._id },
                    { $push: { debts: { $each: debts } } }
                );
            } else {
                await this.debtsModel.create({
                    user: user._id, 
                    debts: debts
                });
            }

            return { msg: "Created/Added" };
        } catch (error) {
            throw new ConflictException('Qarzni saqlashda xatolik yuz berdi');
        }
    }

    /**
     * Foydalanuvchining barcha qarzlarini olish
     * @param user Foydalanuvchi
     */
    async getAll(user: any): Promise<{ debts: Debt[] }> {
        const userDebts = await this.debtsModel.findOne({ 
            user: user._id 
        });
        
        return { 
            debts: userDebts?.debts || [] 
        };
    }

    /**
     * Qarzlarni yangilash
     * @param user Foydalanuvchi
     * @param debts Yangilanadigan qarzlar massivi
     */
    async update(
        user: any, 
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        try {
            for (const debt of debts) {
                await this.debtsModel.updateOne(
                    { 
                        user: user._id,
                        'debts.id': debt.id 
                    },
                    { 
                        $set: { 
                            'debts.$': debt 
                        } 
                    }
                );
            }

            return { msg: "Updated" };
        } catch (error) {
            throw new ConflictException('Qarzni yangilashda xatolik yuz berdi');
        }
    }

    /**
     * Qarzlarni o'chirish
     * @param user Foydalanuvchi
     * @param debts O'chiriladigan qarzlar massivi
     */
    async delete(
        user: any, 
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        try {
            await this.debtsModel.updateOne(
                { user: user._id },
                { 
                    $pull: { 
                        debts: { 
                            id: { 
                                $in: debts.map(debt => debt.id) 
                            } 
                        } 
                    } 
                }
            );

            return { msg: "Deleted" };
        } catch (error) {
            throw new ConflictException('Qarzni o\'chirishda xatolik yuz berdi');
        }
    }
}
