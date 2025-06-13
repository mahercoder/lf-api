import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories, Category } from './schemas/categories.schema';
import mongoose from 'mongoose';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name)
        private categoriesModel: mongoose.Model<Categories>
    ) {}

    /**
     * Kategoriyalarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param user Foydalanuvchi
     * @param categories Yangi kategoriyalar massivi
     */
    async createOrAdd(
        user: any, 
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        try {
            const existingDoc = await this.categoriesModel.findOne({ 
                user: user._id 
            });

            if (existingDoc) {
                await this.categoriesModel.updateOne(
                    { user: user._id },
                    { $push: { categories: { $each: categories } } }
                );
            } else {
                await this.categoriesModel.create({
                    user: user._id, 
                    categories: categories
                });
            }

            return { msg: "Created/Added" };
        } catch (error) {
            console.log(error);
            throw new ConflictException('Kategoriyani saqlashda xatolik yuz berdi');
        }
    }

    /**
     * Foydalanuvchining barcha kategoriyalarini olish
     * @param user Foydalanuvchi
     */
    async getAll(user: any): Promise<{ categories: Category[] }> {
        const userCategories = await this.categoriesModel.findOne({ 
            user: user._id 
        });
        
        return { 
            categories: userCategories?.categories || [] 
        };
    }

    /**
     * Kategoriyalarni yangilash
     * @param user Foydalanuvchi
     * @param categories Yangilanadigan kategoriyalar massivi
     */
    async update(
        user: any, 
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        try {
            for (const category of categories) {
                await this.categoriesModel.updateOne(
                    { 
                        user: user._id,
                        'categories.id': category.id 
                    },
                    { 
                        $set: { 
                            'categories.$': category 
                        } 
                    }
                );
            }

            return { msg: "Updated" };
        } catch (error) {
            throw new ConflictException('Kategoriyani yangilashda xatolik yuz berdi');
        }
    }

    /**
     * Kategoriyalarni o'chirish
     * @param user Foydalanuvchi
     * @param categories O'chiriladigan kategoriyalar massivi
     */
    async delete(
        user: any, 
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        try {
            await this.categoriesModel.updateOne(
                { user: user._id },
                { 
                    $pull: { 
                        categories: { 
                            id: { 
                                $in: categories.map(category => category.id) 
                            } 
                        } 
                    } 
                }
            );

            return { msg: "Deleted" };
        } catch (error) {
            throw new ConflictException('Kategoriyani o\'chirishda xatolik yuz berdi');
        }
    }
}
