import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { CategoryDto } from './dto/category.dto';
import { ParseArrayPipe } from '@nestjs/common';
import { Category } from './schemas/categories.schema';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    /**
     * Kategoriyalarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param req Foydalanuvchi ma'lumotlari
     * @param categories Yangi kategoriyalar massivi
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    @Post()
    createOrAdd(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: CategoryDto }))
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        return this.categoriesService.createOrAdd(req.user, categories);
    }

    /**
     * Foydalanuvchining barcha kategoriyalarini olish
     * @param req Foydalanuvchi ma'lumotlari
     */
    @UseGuards(AuthGuard())
    @Get()
    getAll(
        @Request() req: any
    ): Promise<{ categories: Category[] }> {
        return this.categoriesService.getAll(req.user);
    }

    /**
     * Kategoriyalarni yangilash
     * @param req Foydalanuvchi ma'lumotlari
     * @param categories Yangilanadigan kategoriyalar massivi
     */
    @UseGuards(AuthGuard())
    @Put()
    update(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: CategoryDto }))
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        return this.categoriesService.update(req.user, categories);
    }

    /**
     * Kategoriyalarni o'chirish
     * @param req Foydalanuvchi ma'lumotlari
     * @param categories O'chiriladigan kategoriyalar massivi
     */
    @UseGuards(AuthGuard())
    @Delete()
    delete(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: CategoryDto }))
        categories: Array<CategoryDto>
    ): Promise<{ msg: string }> {
        return this.categoriesService.delete(req.user, categories);
    }
}
