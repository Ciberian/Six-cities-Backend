import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../common/errors/http-error.js';
import LoginUserDto from './dto/login-user.dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.createUser });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.loginUser });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.getUserStatus });
  }

  public async createUser(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async loginUser({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented yet',
      'UserController',
    );
  }

  public async getUserStatus(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);
    const userResponse = fillDTO(UserResponse, user);
    this.ok(res, userResponse);
  }
}

