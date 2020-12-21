import { PostEntity } from 'src/post/entity/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  	@PrimaryGeneratedColumn()
  id: number;

  	@Column()
	name: string;

	@Column()
	age: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ default: true })
	isActive: boolean;

	@OneToMany(type => PostEntity, post => post.user)
	posts: PostEntity[]

	@BeforeInsert()
	emailToLowerCase () {
	    this.email = this.email.toLowerCase();
	}
}
