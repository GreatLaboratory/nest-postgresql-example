import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { AuthModule } from 'src/auth/auth.module';
import { AddressEntity } from './entity/address.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, AddressEntity]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [UserService, UserSubscriber],
    exports: [UserService]
})
export class UserModule {}
