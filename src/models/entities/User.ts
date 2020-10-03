import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Column, Entity, /*OneToMany,*/ PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public firstName: string;

    @IsNotEmpty()
    @Column()
    public lastName: string;

    @IsNotEmpty()
    @Column({ unique: true})
    public email: string;

    @IsNotEmpty()
    @Column()
    @Exclude()
    public password: string;

    @IsNotEmpty()
    @Column()
    public phoneNumber: string;

    // @OneToMany(type => Pet, pet => pet.user)
    // public pets: Pet[];

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public comparePassword(password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @BeforeInsert()
    public normalizeEmail(): void {
        this.email = this.email.toLowerCase();
    }

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }

}
