import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budgets, Budget } from './schemas/budgets.schema';
import mongoose from 'mongoose';
import { BudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
    constructor(
        @InjectModel(Budgets.name)
        private budgetsModel: mongoose.Model<Budgets>
    ) {}

    /**
     * Budjetlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param user Foydalanuvchi
     * @param budgets Yangi budjetlar massivi
     */
    async createOrAdd(
        user: any, 
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        try {
            const existingDoc = await this.budgetsModel.findOne({ 
                user: user._id 
            });

            if (existingDoc) {
                await this.budgetsModel.updateOne(
                    { user: user._id },
                    { $push: { budgets: { $each: budgets } } }
                );
            } else {
                await this.budgetsModel.create({
                    user: user._id, 
                    budgets: budgets
                });
            }

            return { msg: "Created/Added" };
        } catch (error) {
            throw new ConflictException('Budjetni saqlashda xatolik yuz berdi');
        }
    }

    /**
     * Foydalanuvchining barcha budjetlarini olish
     * @param user Foydalanuvchi
     */
    async getAll(user: any): Promise<{ budgets: Budget[] }> {
        const userBudgets = await this.budgetsModel.findOne({ 
            user: user._id 
        });
        
        return { 
            budgets: userBudgets?.budgets || [] 
        };
    }

    /**
     * Budjetlarni yangilash
     * @param user Foydalanuvchi
     * @param budgets Yangilanadigan budjetlar massivi
     */
    async update(
        user: any, 
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        try {
            for (const budget of budgets) {
                await this.budgetsModel.updateOne(
                    { 
                        user: user._id,
                        'budgets.id': budget.id 
                    },
                    { 
                        $set: { 
                            'budgets.$': budget 
                        } 
                    }
                );
            }

            return { msg: "Updated" };
        } catch (error) {
            throw new ConflictException('Budjetni yangilashda xatolik yuz berdi');
        }
    }

    /**
     * Budjetlarni o'chirish
     * @param user Foydalanuvchi
     * @param budgets O'chiriladigan budjetlar massivi
     */
    async delete(
        user: any, 
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        try {
            await this.budgetsModel.updateOne(
                { user: user._id },
                { 
                    $pull: { 
                        budgets: { 
                            id: { 
                                $in: budgets.map(budget => budget.id) 
                            } 
                        } 
                    } 
                }
            );

            return { msg: "Deleted" };
        } catch (error) {
            throw new ConflictException('Budjetni o\'chirishda xatolik yuz berdi');
        }
    }
}
