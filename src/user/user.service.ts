import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/user.create-dto';
import { LoginUserDto } from './dto/user.login-dto';
import { UpdateUserDto } from './dto/user.update-dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService,
        private connection: Connection, // transaction을 위해 필요
    ){}
    
    // POST -> 특정 사용자 생성하기
    async createUser (user: CreateUserDto): Promise<User> {
        const findUser: User = await this.userRepository.findOne({ email: user.email });
        if (findUser) throw new ConflictException(`${user.email} is already created user. Create another user.`);
        const hashPassword: string = await this.authService.hashPassword(user.password);
        return this.userRepository.save({...user, password: hashPassword});
    }

    // POST -> 사용자 로그인 하기
    async loginUser (loginUser: LoginUserDto): Promise<{ accessToken: string }>{
        const findUser: User = await this.userRepository.findOne({ email: loginUser.email });
        if (!findUser) throw new NotFoundException(`there is no user with email ${loginUser.email}`);

        if (!this.authService.comparePassword(loginUser.password, findUser.password)) throw new UnauthorizedException('password is wrong');
        const accessToken: string = await this.authService.generateJWT(findUser);
        return { accessToken };
    }

    // POST -> 다수의 사용자 생성하기 (+트랜젝션 처리)
    async createManyUser (users: CreateUserDto[]): Promise<void>{
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const user of users) {
                await queryRunner.manager.save(user);
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    // GET -> 전체 사용자 정보 조회하기
    async findAll (): Promise<User[]>{
        return await this.userRepository.find();
    }

    // GET -> 특정 아이디로 사용자 정보 조회하기
    async findUserById (id: number): Promise<User>{
        const selectedUser: User = await this.userRepository.findOne(id);
        if (!selectedUser) throw new NotFoundException(`there is no user with ID ${id}`);
        return selectedUser;
    }

    // GET -> 특정 키워드로 사용자의 정보 조회하기
    async findUserByKeyword (keyword: string): Promise<User[]>{
        const selectedUserList: User[] = await this.userRepository.find({ email: keyword });
        if (!selectedUserList.length) throw new NotFoundException(`there is no user with keyword->(${keyword})`);
        return selectedUserList;
    }

    // PATCH -> 특정 아이디로 사용자의 정보 수정하기
    async updateUserById (userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        await this.findUserById(userId);
        return await this.userRepository.update(userId, updateUserDto);
    }

    // DELETE -> 특정 아이디로 사용자 정보 삭제하기
    async removeUserById (userId: number): Promise<void>{
        await this.findUserById(userId);
        await this.userRepository.delete(userId);
    }
}
