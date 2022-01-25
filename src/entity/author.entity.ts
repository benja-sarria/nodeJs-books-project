import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { Book } from "./book.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Author {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    fullName!: string;

    @Field((type) => [Book], { nullable: true })
    @OneToMany(() => Book, (book) => book.author, {
        nullable: true,
        onDelete: "NO ACTION",
    })
    books!: Book[];

    @Field(() => String)
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: string;
}
