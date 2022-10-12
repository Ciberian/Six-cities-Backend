import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import CreateUserDto from './dto/create-user.dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserController) private readonly userService: UserServiceInterface,) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.createUser });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.loginUser });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.getUserStatus });
    dotenv.config();
  }

  public async createUser({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.create(body, process.env.SALT = 'alk2fe34234wrerw34erfw3e');
    this.created(res, user);
  }

  public async loginUser({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findOrCreate(body, process.env.SALT = 'alk2fe34234wrerw34erfw3e');
    this.ok(res, user);
  }

  public async getUserStatus(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);
    const userResponse = fillDTO(UserResponse, user);
    this.ok(res, userResponse);
  }
}

