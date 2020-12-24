import { Body, Controller, Post, UseGuards, Request, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/post.create-dto';
import { PostService } from './post.service';
import { PostEntity } from './entity/post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('post')
export class PostController {
    constructor (private readonly postService: PostService){}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('postImage', { 
        storage: diskStorage({
            destination: './uploads/postImages',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    createPost (@Request() req, @Body() post: CreatePostDto, @UploadedFile() file: Express.Multer.File): Promise<PostEntity> {
        return this.postService.createPost(req.user, post, file);
    }

    @Get('/list')
    findAllPost (): Promise<PostEntity[]> {
        return this.postService.findAllPost();
    }
    
    @Get('/loginList')
    @UseGuards(AuthGuard('jwt'))
    findLoginedAllPost (@Request() req): Promise<PostEntity[]> {
        return this.postService.findLoginedAllPost(req.user);
    }

    @Get('/:postId')
    findPost (@Param('postId') postId: number): Promise<PostEntity> {
        return this.postService.findPost(postId);
    }
}
