import { Request, Response } from 'express';
import { inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentResponse from './response/comment.response.js';
import HttpError from '../../common/errors/http-error.js';
import * as core from 'express-serve-static-core';

type ParamsGetOffer = {
  offerId: string;
}

export default class CommentController extends Controller {
  constructor(
		@inject(Component.LoggerInterface) logger: LoggerInterface,
		@inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
		@inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateCommentDto)]
    });
  }

  public async create(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const {params, body, user} = req;

    if (!(await this.offerService.exists(params.offerId))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${params.offerId} not found.`, 'CommentController');
    }

    const comment = await this.commentService.create({...body, userId: user.id, offerId: params.offerId});
    this.created(res, fillDTO(CommentResponse, comment));
  }
}

