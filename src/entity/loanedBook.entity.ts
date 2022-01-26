import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Author } from "./author.entity";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@ObjectType()
@Entity()
export class LoanedBook {
    @Field()
    @OneToOne(() => Book, (book) => book.id)
    @PrimaryColumn()
    bookId!: number;

    @Field()
    @Column()
    userId!: number;

    @Field()
    @Column()
    title!: string;

    @Field(() => Author)
    @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
    author!: Author;

    @Field()
    @Column({ default: "" })
    loanDate!: string;

    @Field()
    @Column({ default: "" })
    loanExpireDate!: string;
}
