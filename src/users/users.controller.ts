import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @UseGuards(AuthGuard())
    @Get()
    getUser(@Request() req: any){
        return this.usersService.getOne(req.user);
    }
    
    @UseGuards(AuthGuard())
    @Put()
    updateUser(@Request() req: any, @Body() body: any){
        return this.usersService.update(req.user, body);
    }
}
