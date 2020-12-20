import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
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

	@BeforeInsert()
	emailToLowerCase () {
	    this.email = this.email.toLowerCase();
	}
}
