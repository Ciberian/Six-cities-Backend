import CreateUserDto from './dto/create-user.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import UpdateUserDto from './dto/update-user.dto.js';

export interface UserServiceInterface {
  find(): Promise<DocumentType<UserEntity>[]>;
	create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
	findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
	findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
