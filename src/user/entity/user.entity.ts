import { PostEntity } from 'src/post/entity/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity } from './address.entity';

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

	@OneToMany(() => PostEntity, (post: PostEntity) => post.user)
	posts: PostEntity[]

	@OneToOne(() => AddressEntity)
  	@JoinColumn({ name: 'addressId' })
  	public address: AddressEntity;

	@BeforeInsert()
	emailToLowerCase () {
	    this.email = this.email.toLowerCase();
	}
}
