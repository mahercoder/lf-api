import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Goals, GoalSchema } from './schemas/goals.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Goals.name, schema: GoalSchema }])
    ],
    controllers: [GoalsController],
    providers: [GoalsService]
})
export class GoalsModule {}
