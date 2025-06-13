import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { AuthGuard } from '@nestjs/passport';
import { DebtDto } from './dto/debt.dto';
import { ParseArrayPipe } from '@nestjs/common';
import { Debt } from './schemas/debts.schemas';

@Controller('debts')
export class DebtsController {
    constructor(private debtsService: DebtsService) {}

    /**
     * Qarzlarni yaratish yoki mavjudlariga yangilarini qo'shish
     * @param req Foydalanuvchi ma'lumotlari
     * @param debts Yangi qarzlar massivi
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    @Post()
    createOrAdd(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: DebtDto }))
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        return this.debtsService.createOrAdd(req.user, debts);
    }

    /**
     * Foydalanuvchining barcha qarzlarini olish
     * @param req Foydalanuvchi ma'lumotlari
     */
    @UseGuards(AuthGuard())
    @Get()
    getAll(
        @Request() req: any
    ): Promise<{ debts: Debt[] }> {
        return this.debtsService.getAll(req.user);
    }

    /**
     * Qarzlarni yangilash
     * @param req Foydalanuvchi ma'lumotlari
     * @param debts Yangilanadigan qarzlar massivi
     */
    @UseGuards(AuthGuard())
    @Put()
    update(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: DebtDto }))
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        return this.debtsService.update(req.user, debts);
    }

    /**
     * Qarzlarni o'chirish
     * @param req Foydalanuvchi ma'lumotlari
     * @param debts O'chiriladigan qarzlar massivi
     */
    @UseGuards(AuthGuard())
    @Delete()
    delete(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: DebtDto }))
        debts: Array<DebtDto>
    ): Promise<{ msg: string }> {
        return this.debtsService.delete(req.user, debts);
    }
}
