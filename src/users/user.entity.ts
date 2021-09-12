import { IsEmail } from 'class-validator';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRepository } from './user.repository';

@Entity()
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id: number;

  @Property()
  username: string;

  @Property({ hidden: true })
  @IsEmail()
  email: string;

  @Property()
  bio = '';

  @Property({ hidden: true })
  password: string;

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
