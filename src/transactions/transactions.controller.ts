import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseArrayPipe, 
    Post, 
    Put, 
    Request, 
    UseGuards 
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transactions.schema';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    /**
     * Yangi tranzaksiyalar qo'shish
     * @param req Foydalanuvchi ma'lumotlari
     * @param transactions Yangi tranzaksiyalar massivi
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    @Post()
    createOrAdd(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: TransactionDto }))
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        return this.transactionsService.createOrAdd(req.user, transactions);
    }

    /**
     * Berilgan yildagi barcha tranzaksiyalarni olish
     * @param req Foydalanuvchi ma'lumotlari
     * @param year Yil
     */
    @UseGuards(AuthGuard())
    @Get('/:year')
    getByYear(
        @Request() req: any,
        @Param('year') year: number
    ): Promise<{ transactions: Transaction[] }> {
        return this.transactionsService.getByYear(req.user, year);
    }
    
    /**
     * Berilgan yil va oydagi tranzaksiyalarni olish
     * @param req Foydalanuvchi ma'lumotlari
     * @param year Yil
     * @param month Oy
     */
    @UseGuards(AuthGuard())
    @Get('/:year/:month')
    getByMonth(
        @Request() req: any,
        @Param('year') year: number,
        @Param('month') month: number
    ): Promise<{ transactions: Transaction[] }> {
        return this.transactionsService.getByMonth(req.user, year, month);
    }
    
    /**
     * Barcha tranzaksiyalarni olish
     * @param req Foydalanuvchi ma'lumotlari
     */
    @UseGuards(AuthGuard())
    @Get()
    getAll(
        @Request() req: any
    ): Promise<{ transactions: Transaction[] }> {
        return this.transactionsService.getAll(req.user);
    }

    /**
     * Tranzaksiyalarni yangilash
     * @param req Foydalanuvchi ma'lumotlari
     * @param transactions Yangilanadigan tranzaksiyalar massivi
     */
    @UseGuards(AuthGuard())
    @Put()
    update(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: TransactionDto }))
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        return this.transactionsService.update(req.user, transactions);
    }

    /**
     * Tranzaksiyalarni o'chirish
     * @param req Foydalanuvchi ma'lumotlari
     * @param transactions O'chiriladigan tranzaksiyalar massivi
     */
    @UseGuards(AuthGuard())
    @Delete()
    delete(
        @Request() req: any,
        @Body(new ParseArrayPipe({ items: TransactionDto }))
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        return this.transactionsService.delete(req.user, transactions);
    }
}
