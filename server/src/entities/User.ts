import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Content } from "./Content";
import * as bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'editor' | 'user';

export interface IUser {
    id?: number;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

@Entity('users')
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ 
        type: 'enum',
        enum: ['admin', 'editor', 'user'],
        default: 'user'
    })
    role: UserRole = 'user';

    @OneToMany(() => Content, content => content.author, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    contents!: Content[];

    // Timestamps removed for now

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    toJSON() {
        const { password, ...userData } = this;
        return userData;
    }
}
