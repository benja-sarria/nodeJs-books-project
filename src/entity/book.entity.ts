import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { Author } from "./author.entity";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Book {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field(() => Author)
    @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
    author!: Author;

    @Field()
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: string;

    @Field()
    @Column({ default: false })
    @ManyToOne(() => User, (user) => user.loanedBooks)
    isLoaned!: boolean;
}
