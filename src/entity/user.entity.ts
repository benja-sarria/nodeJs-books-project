import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Author } from "./author.entity";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./book.entity";

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    fullName!: string;

    @Field()
    @Column()
    email!: string;

    @Field()
    @Column()
    password!: string;

    @Field()
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: string;

    @Field((type) => [Book], { nullable: true })
    @OneToMany(() => Book, (book) => book.isLoaned, {
        nullable: true,
        onDelete: "NO ACTION",
    })
    loanedBooks!: Book[];
}
