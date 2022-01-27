import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
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
    @Column({ unique: true })
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

    @Column("bool", { default: false })
    isVerified?: boolean;

    @Column({ default: "" })
    verificationUrl!: string;

    @Field()
    @Column({ default: false })
    isPenalized!: boolean;
}
