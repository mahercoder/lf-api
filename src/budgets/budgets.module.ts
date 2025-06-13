import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Budgets, BudgetSchema } from './schemas/budgets.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Budgets.name, schema: BudgetSchema }])
    ],
    controllers: [BudgetsController],
    providers: [BudgetsService]
})
export class BudgetsModule {}
