import { UserEntity } from './user.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import UpdateUserDto from './dto/update-user.dto.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface UserServiceInterface {
  find(): Promise<DocumentType<UserEntity>[]>;
	create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId?: string): Promise<DocumentType<UserEntity> | null>;
	findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
	findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
