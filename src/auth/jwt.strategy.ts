import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: any) {
        const { id } = payload;
        
        // Redis'dan qidirish
        const cachedUser = await this.cacheManager.get(`auth:user:${id}`);
        if (cachedUser) {
            return cachedUser;
        }

        // Bazadan qidirish
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new UnauthorizedException('Sign in/up first to access this endpoint!');
        }

        // Redis'ga saqlash (30 minutga)
        await this.cacheManager.set(`auth:user:${id}`, user, 1800000);
        
        return user;
    }
}