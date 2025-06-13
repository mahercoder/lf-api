import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Transactions, TransactionSchema } from './schemas/transactions.schema';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Transactions.name, schema: TransactionSchema }])
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService]
})
export class TransactionsModule {}
