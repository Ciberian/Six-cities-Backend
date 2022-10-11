import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';

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
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const user = await this.userService.create(req.body.userDto, req.body.salt);
    this.created(res, user);
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findOrCreate(req.body.userDto, req.body.salt);
    this.ok(res, user);
  }

  public async getUserStatus(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);
    this.ok(res, user);
  }
}

