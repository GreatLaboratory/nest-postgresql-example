import { UserEntity } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'post' })
export class PostEntity {
  	@PrimaryGeneratedColumn()
    id: number;

  	@Column({ unique: true })
	  title: string;

    @Column()
    description: string;

    @Column()
    imgUrl: string;

    @Column({ default: new Date() })
    createdAt: Date
      
    @Column({ default: new Date() })
    updatedAt: Date

    @ManyToOne(() => UserEntity, user => user.posts)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
