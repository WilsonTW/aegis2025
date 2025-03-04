
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from "./user.entity";

export class UserWithPermission extends User {
    @Column("simple-array")
    permissions?: string[];
}
