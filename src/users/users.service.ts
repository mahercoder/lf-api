import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Injectable, NotFoundException, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
    private readonly CACHE_TTL = 3600000; // 1 hour
    private readonly AUTH_CACHE_TTL = 1800000; // 30 minutes

    constructor(
        @InjectModel(User.name)
        private usersModel: Model<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async create(email: string, password: string): Promise<User> {
        try {
            const user = await this.usersModel.create({ email, password });
            return user;
        } catch (error) {
            throw new InternalServerErrorException('User creation failed');
        }
    }

    async getOne(user: User): Promise<any> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const cacheKey = `user:${user._id}`;
        
        try {
            const cachedUser = await this.cacheManager.get(cacheKey);
            if (cachedUser) {
                return cachedUser as User;
            }

            const { password, ...otherData } = user.toObject();
            
            await this.cacheManager.set(cacheKey, otherData, this.CACHE_TTL);
            
            return otherData;
        } catch (error) {
            // Cache xatosi bo'lsa ham asosiy logikani bajaramiz
            const { password, ...otherData } = user.toObject();
            return otherData;
        }
    }

    async findById(id: string): Promise<User> {
        const cacheKey = `user:${id}`;
        
        try {
            const cachedUser = await this.cacheManager.get(cacheKey);
    
            if (cachedUser) {
                return cachedUser as User;
            }
    
            const user = await this.usersModel.findById(id).select("-password");
            
            if (!user) {
                return null;
            }
            
            await this.cacheManager.set(cacheKey, user, this.CACHE_TTL);
            
            return user;
        } catch (error) {
            return this.usersModel.findById(id).select("-password");
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersModel.findOne({ email });
        
        if (!user) {
            return null;
        }
        
        return user;
    }

    async updateByEmail(email: string, updateData: Partial<User>): Promise<User> {
        try {
            const updatedUser = await this.usersModel.findOneAndUpdate(
                { email },
                { $set: updateData },
                { new: true, runValidators: true }
            ).select("-password");
        
            if (!updatedUser) {
                throw new NotFoundException('User not found');
            }

            await this.invalidateUserCache(updatedUser);
        
            return updatedUser;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Update failed');
        }
    }

    async update(user: User, updateData: Partial<User>): Promise<User> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            // `password` ni `updateData` obyektidan olib tashlash
            const { password, ...safeUpdateData } = updateData;

            const updatedUser = await this.usersModel.findOneAndUpdate(
                { email: user.email },
                { $set: safeUpdateData },
                { new: true, runValidators: true }
            ).select("-password");

            if (!updatedUser) {
                throw new NotFoundException('User not found');
            }

            await this.invalidateUserCache(updatedUser);
        
            return updatedUser;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Update failed');
        }
    }

    private async invalidateUserCache(user: User) {
        try {
            await Promise.all([
                this.cacheManager.del(`user:${user._id}`),
                this.cacheManager.del(`user:email:${user.email}`),
                this.cacheManager.del(`auth:user:${user._id}`)
            ]);
        } catch (error) {
            // Log error but don't throw
            console.error('Cache invalidation failed:', error);
        }
    }
}
