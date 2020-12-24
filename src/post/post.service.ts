import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/post.create-dto';
import { PostEntity } from './entity/post.entity';

@Injectable()
export class PostService {
    constructor (
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
    ){}

    // POST -> 게시물 생성하기
    async createPost (user: UserEntity, post: CreatePostDto, file: Express.Multer.File): Promise<PostEntity> {
        return await this.postRepository.save({...post, imgUrl: `/static/postImages/${file.filename}`, user});
    }

    // GET -> 모든 게시물 조회하기
    async findAllPost (): Promise<PostEntity[]>{
        return await this.postRepository.find();
    }
    
    // GET -> 로그인된 사용자가 게시한 모든 게시물 조회하기
    async findLoginedAllPost (user: UserEntity): Promise<PostEntity[]>{
        return await this.postRepository.find({ user });
    }

    // GET -> 특정 게시물 조회하기
    async findPost (postId: number): Promise<PostEntity>{
        // return await this.postRepository
        //     .createQueryBuilder('post')
        //     .leftJoinAndSelect('post.user', 'user')
        //     .where('post.id = :id', { id: postId })
        //     .getOne();
        return await this.postRepository.findOne({ id: postId }, { relations: ['user'] });
    }
}
