import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface IContent {
    id?: number;
    title: string;
    body: string;
    status: ContentStatus;
    author: User;
    authorId: number;
    createdAt?: string;
    updatedAt?: string;
}

@Entity('contents')
export class Content implements IContent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({ type: 'text' })
    body!: string;

    @Column({
        type: 'enum',
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    })
    status!: ContentStatus;

    @ManyToOne(() => User, user => user.contents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author!: User;

    @Column({ type: 'int' })
    authorId!: number;

    toJSON() {
        return {
            ...this,
            author: this.author?.toJSON ? this.author.toJSON() : this.author
        };
    }
}
