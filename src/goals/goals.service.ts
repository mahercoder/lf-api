import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goals, Goal } from './schemas/goals.schema';
import mongoose from 'mongoose';
import { GoalDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
    constructor(
        @InjectModel(Goals.name)
        private goalsModel: mongoose.Model<Goals>
    ) {}

    /**
     * Maqsadlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param user Foydalanuvchi
     * @param goals Yangi maqsadlar massivi
     */
    async createOrAdd(
        user: any, 
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        try {
            const existingDoc = await this.goalsModel.findOne({ 
                user: user._id 
            });

            if (existingDoc) {
                await this.goalsModel.updateOne(
                    { user: user._id },
                    { $push: { goals: { $each: goals } } }
                );
            } else {
                await this.goalsModel.create({
                    user: user._id, 
                    goals: goals
                });
            }

            return { msg: "Created/Added" };
        } catch (error) {
            throw new ConflictException('Maqsadni saqlashda xatolik yuz berdi');
        }
    }

    /**
     * Foydalanuvchining barcha maqsadlarini olish
     * @param user Foydalanuvchi
     */
    async getAll(user: any): Promise<{ goals: Goal[] }> {
        const userGoals = await this.goalsModel.findOne({ 
            user: user._id 
        });
        
        return { 
            goals: userGoals?.goals || [] 
        };
    }

    /**
     * Maqsadlarni yangilash
     * @param user Foydalanuvchi
     * @param goals Yangilanadigan maqsadlar massivi
     */
    async update(
        user: any, 
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        try {
            for (const goal of goals) {
                await this.goalsModel.updateOne(
                    { 
                        user: user._id,
                        'goals.id': goal.id 
                    },
                    { 
                        $set: { 
                            'goals.$': goal 
                        } 
                    }
                );
            }

            return { msg: "Updated" };
        } catch (error) {
            throw new ConflictException('Maqsadni yangilashda xatolik yuz berdi');
        }
    }

    /**
     * Maqsadlarni o'chirish
     * @param user Foydalanuvchi
     * @param goals O'chiriladigan maqsadlar massivi
     */
    async delete(
        user: any, 
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        try {
            await this.goalsModel.updateOne(
                { user: user._id },
                { 
                    $pull: { 
                        goals: { 
                            id: { 
                                $in: goals.map(goal => goal.id) 
                            } 
                        } 
                    } 
                }
            );

            return { msg: "Deleted" };
        } catch (error) {
            throw new ConflictException('Maqsadni o\'chirishda xatolik yuz berdi');
        }
    }
}
