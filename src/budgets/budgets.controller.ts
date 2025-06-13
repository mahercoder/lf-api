import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { AuthGuard } from '@nestjs/passport';
import { BudgetDto } from './dto/budget.dto';
import { ParseArrayPipe } from '@nestjs/common';
import { Budget } from './schemas/budgets.schema';

@Controller('budgets')
export class BudgetsController {
    constructor(private budgetsService: BudgetsService) {}

    /**
     * Budjetlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param req Foydalanuvchi ma'lumotlari
     * @param budgets Yangi budjetlar massivi
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    @Post()
    createOrAdd(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: BudgetDto }))
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        return this.budgetsService.createOrAdd(req.user, budgets);
    }

    /**
     * Foydalanuvchining barcha budjetlarini olish
     * @param req Foydalanuvchi ma'lumotlari
     */
    @UseGuards(AuthGuard())
    @Get()
    getAll(
        @Request() req: any
    ): Promise<{ budgets: Budget[] }> {
        return this.budgetsService.getAll(req.user);
    }

    /**
     * Budjetlarni yangilash
     * @param req Foydalanuvchi ma'lumotlari
     * @param budgets Yangilanadigan budjetlar massivi
     */
    @UseGuards(AuthGuard())
    @Put()
    update(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: BudgetDto }))
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        return this.budgetsService.update(req.user, budgets);
    }

    /**
     * Budjetlarni o'chirish
     * @param req Foydalanuvchi ma'lumotlari
     * @param budgets O'chiriladigan budjetlar massivi
     */
    @UseGuards(AuthGuard())
    @Delete()
    delete(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: BudgetDto }))
        budgets: Array<BudgetDto>
    ): Promise<{ msg: string }> {
        return this.budgetsService.delete(req.user, budgets);
    }
}
