import { ConflictException, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, Transactions } from './schemas/transactions.schema';
import mongoose from 'mongoose';

@Injectable()
export class TransactionsService {

    constructor (
        @InjectModel(Transactions.name)
        private transactionsModel: mongoose.Model<Transactions>
    ) {}

    /**
     * Tranzaksiyalarni yil va oy bo'yicha guruhlash
     * @param transactions Tranzaksiyalar massivi
     * @returns Guruhlangan tranzaksiyalar Map obyekti
     */
    private groupTransactionsByYearAndMonth(transactions: Array<TransactionDto>): Map<string, TransactionDto[]> {
        const grouped = new Map<string, TransactionDto[]>();

        for (const transaction of transactions) {
            const date = new Date(transaction.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() 0 dan boshlanadi
            const key = `${year}-${month}`;

            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(transaction);
        }

        return grouped;
    }

    /**
     * Yangi tranzaksiyalar qo'shish
     * @param user Foydalanuvchi
     * @param transactions Yangi tranzaksiyalar massivi
     */
    async createOrAdd(
        user: any,
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        try {
            // Tranzaksiyalarni yil va oy bo'yicha guruhlash
            const groupedTransactions = this.groupTransactionsByYearAndMonth(transactions);

            // Har bir guruh uchun tranzaksiyalarni saqlash
            for (const [yearMonth, groupTransactions] of groupedTransactions) {
                const [year, month] = yearMonth.split('-').map(Number);
                
                const existingDoc = await this.transactionsModel.findOne({
                    user: user._id, year, month
                });

                if (!existingDoc) {
                    await this.transactionsModel.create({
                        user: user._id, year, month,
                        transactions: groupTransactions
                    });
                    continue;
                }

                await this.transactionsModel.updateOne(
                    { user: user._id, year, month },
                    { $push: { transactions: { $each: groupTransactions } } }
                );
            }

            return { msg: "Created/Added" };

        } catch (error) {
            throw new ConflictException('Tranzaksiyani saqlashda xatolik yuz berdi');
        }
    }
    
    /**
     * Berilgan yildagi barcha tranzaksiyalarni olish
     * @param user Foydalanuvchi
     * @param year Yil
     */
    async getByYear(user: any, year: number): Promise<{ transactions: Transaction[] }> {
        const yearlyTransactions = await this.transactionsModel.find({
            user: user._id, year: year
        });

        // Barcha oylarning tranzaksiyalarini bitta massivga jamlaymiz
        const allTransactions = yearlyTransactions.reduce((acc, doc) => {
            return [...acc, ...doc.transactions];
        }, []);

        // Tranzaksiyalarni sanasi bo'yicha tartiblash
        allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { transactions: allTransactions };
    }

    /**
     * Berilgan yil va oydagi tranzaksiyalarni olish
     * @param user Foydalanuvchi
     * @param year Yil
     * @param month Oy
     */
    async getByMonth(
        user: any, year: number, month: number
    ): Promise<{ transactions: Transaction[] }> {
        const monthlyTransaction = await this.transactionsModel.findOne({
            user: user._id, year: year, month: month
        });

        if (!monthlyTransaction) {
            return { transactions: [] };
        }

        // Tranzaksiyalarni sanasi bo'yicha tartiblash
        const sortedTransactions = [...monthlyTransaction.transactions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return { transactions: sortedTransactions };
    }

    /**
     * Barcha tranzaksiyalarni olish
     * @param user Foydalanuvchi
     */
    async getAll(user: any): Promise<{ transactions: Transaction[] }> {
        const allDocuments = await this.transactionsModel.find({
            user: user._id
        });

        // Barcha dokumentlardagi tranzaksiyalarni bitta massivga jamlaymiz
        const allTransactions = allDocuments.reduce((acc, doc) => {
            return [...acc, ...doc.transactions];
        }, []);

        // Tranzaksiyalarni sanasi bo'yicha tartiblash
        allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { transactions: allTransactions };
    }
    
    /**
     * Tranzaksiyalarni yangilash
     * @param user Foydalanuvchi
     * @param transactions Yangilanadigan tranzaksiyalar massivi
     */
    async update(
        user: any,
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        try {
            const groupedTransactions = this.groupTransactionsByYearAndMonth(transactions);

            for (const [yearMonth, groupTransactions] of groupedTransactions) {
                const [year, month] = yearMonth.split('-').map(Number);

                for (const transaction of groupTransactions) {
                    await this.transactionsModel.updateOne(
                        { 
                            user: user._id,
                            year: year,
                            month: month,
                            'transactions.id': transaction.id 
                        },
                        { 
                            $set: { 
                                'transactions.$': { 
                                    ...transaction, 
                                    updatedAt: new Date() // Yangilangan vaqt
                                } 
                            } 
                        }
                    );
                }
            }

            return { msg: "Updated" };

        } catch (error) {
            throw new ConflictException('Tranzaksiyani yangilashda xatolik yuz berdi');
        }
    }
    
    /**
     * Tranzaksiyalarni o'chirish
     * @param user Foydalanuvchi
     * @param transactions O'chiriladigan tranzaksiyalar massivi
     */
    async delete(
        user: any,
        transactions: Array<TransactionDto>
    ): Promise<{ msg: string }> {
        try {
            // Tranzaksiyalarni yil va oy bo'yicha guruhlash
            const groupedTransactions = this.groupTransactionsByYearAndMonth(transactions);

            // Har bir guruh uchun tranzaksiyalarni o'chirish
            for (const [yearMonth, groupTransactions] of groupedTransactions) {
                const [year, month] = yearMonth.split('-').map(Number);
                
                // Tranzaksiya ID larini olish
                const transactionIds = groupTransactions.map(t => t.id);

                // Tranzaksiyalarni o'chirish
                await this.transactionsModel.updateOne(
                    { user: user._id, year, month },
                    { 
                        $pull: { 
                            transactions: { 
                                id: { $in: transactionIds } 
                            } 
                        } 
                    }
                );
            }

            return { msg: "Deleted" };

        } catch (error) {
            throw new ConflictException('Tranzaksiyani o\'chirishda xatolik yuz berdi');
        }
    }

}
