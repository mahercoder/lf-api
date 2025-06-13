import { Module } from '@nestjs/common';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Debts, DebtSchema } from './schemas/debts.schemas';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Debts.name, schema: DebtSchema }])
    ],
    controllers: [DebtsController],
    providers: [DebtsService]
})
export class DebtsModule {}
