import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from '@nestjs/passport';
import { GoalDto } from './dto/goal.dto';
import { ParseArrayPipe } from '@nestjs/common';
import { Goal } from './schemas/goals.schema';

@Controller('goals')
export class GoalsController {
    constructor(private goalsService: GoalsService) {}

    /**
     * Maqsadlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param req Foydalanuvchi ma'lumotlari
     * @param goals Yangi maqsadlar massivi
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    @Post()
    createOrAdd(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: GoalDto }))
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        return this.goalsService.createOrAdd(req.user, goals);
    }

    /**
     * Foydalanuvchining barcha maqsadlarini olish
     * @param req Foydalanuvchi ma'lumotlari
     */
    @UseGuards(AuthGuard())
    @Get()
    getAll(
        @Request() req: any
    ): Promise<{ goals: Goal[] }> {
        return this.goalsService.getAll(req.user);
    }

    /**
     * Maqsadlarni yangilash
     * @param req Foydalanuvchi ma'lumotlari
     * @param goals Yangilanadigan maqsadlar massivi
     */
    @UseGuards(AuthGuard())
    @Put()
    update(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: GoalDto }))
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        return this.goalsService.update(req.user, goals);
    }

    /**
     * Maqsadlarni o'chirish
     * @param req Foydalanuvchi ma'lumotlari
     * @param goals O'chiriladigan maqsadlar massivi
     */
    @UseGuards(AuthGuard())
    @Delete()
    delete(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: GoalDto }))
        goals: Array<GoalDto>
    ): Promise<{ msg: string }> {
        return this.goalsService.delete(req.user, goals);
    }
}
