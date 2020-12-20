import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (private readonly jwtService: JwtService){}

    generateJWT (user: User): Promise<string> {
        return this.jwtService.signAsync({user});
    }
    
    hashPassword (password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    comparePassword (newPassword: string, passwordHash: string): boolean{
        return bcrypt.compareSync(newPassword, passwordHash);
    }
}
