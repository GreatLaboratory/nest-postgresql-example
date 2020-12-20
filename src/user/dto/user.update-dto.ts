import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './user.create-dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
