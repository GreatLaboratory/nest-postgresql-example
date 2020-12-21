import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate (email: string, password: string): Promise<UserEntity> {
        const user: UserEntity = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('password is wrong');
        }
        return user;
    }
}
