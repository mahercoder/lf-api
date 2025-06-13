import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategorySchema } from './schemas/categories.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Categories.name, schema: CategorySchema }])
    ],
    providers: [CategoriesService],
    controllers: [CategoriesController]
})
export class CategoriesModule {}
