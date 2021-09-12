import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { wrap } from '@mikro-orm/core';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { IUserRO } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };

    return this.userRepository.findOne(findOneOptions);
  }

  async create(dto: CreateUserDto): Promise<IUserRO> {
    const { username, email, password } = dto;
    const exists = await this.userRepository.count({
      $or: [{ username }, { email }],
    });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Username and email must be unique.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User(username, email, password);
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Userinput is not valid.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.userRepository.persistAndFlush(user);
      return this.buildUserRO(user);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    wrap(user).assign(dto);
    await this.userRepository.flush();

    return this.buildUserRO(user);
  }

  async delete(email: string) {
    return this.userRepository.remove({ email });
  }

  async findById(id: number): Promise<IUserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<IUserRO> {
    const user = await this.userRepository.findOneOrFail({ email });
    return this.buildUserRO(user);
  }
  // NOTE: Ideally should use jwt or a similar library
  generateToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
  }

  private buildUserRO(user: User) {
    const userRO = {
      bio: user.bio,
      email: user.email,
      token: this.generateToken(),
      username: user.username,
    };

    return { user: userRO };
  }
}
