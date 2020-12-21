import { Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class AuthService {
    constructor (
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    generateJWT (user: UserEntity): Promise<string> {
        return this.jwtService.signAsync({user});
    }
    
    hashPassword (password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    comparePassword (newPassword: string, passwordHash: string): boolean{
        return bcrypt.compareSync(newPassword, passwordHash);
    }

    async validateUser (email: string, password: string): Promise<UserEntity>{
        try {
            const findUser: UserEntity = await this.userService.findUserByEmail(email);
            if (!this.comparePassword(password, findUser.password)) return null;
            return findUser;
        } catch (err) {
            console.log(err);
        }
    }
}
