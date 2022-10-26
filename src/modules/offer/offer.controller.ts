import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { RequestQuery } from '../../types/request-query.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import HttpError from '../../common/errors/http-error.js';
import OfferResponse from './response/offer.response.js';
import OffersResponse from './response/offers.response.js';
import CommentResponse from '../comment/response/comment.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import * as core from 'express-serve-static-core';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/bundles/premiums', method: HttpMethod.Get, handler: this.getPremiums });
    this.addRoute({ path: '/bundles/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    // Все нижеследующие комментарии в коде (включая этот) удалю в последующих коммитах.
    // Метод aggregate в офферСервисе возвращает массив с одним оффером...
    const offer = await this.offerService.findById(result.id);
    // ...но ТупСкрип не даёт нормально мне вытащить из массива этот оффер, поэтому вот так вот:
    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.created(res, fillDTO(OfferResponse, offerFromArray));
  }

  public async update(
    {body, params, query}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto, RequestQuery>,
    res: Response
  ): Promise<void> {
    await this.offerService.updateById(params.offerId, body, query.userId);
    const offer = await this.offerService.findById(params.offerId);
    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.ok(res, fillDTO(OfferResponse, offerFromArray));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.findById(offerId);
    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.ok(res, fillDTO(OfferResponse, offerFromArray));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);
    this.noContent(res, offer);
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async index(
    {query}: Request<core.ParamsDictionary | unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(query.count);
    this.ok(res, fillDTO(OffersResponse, offers));
  }

  public async getPremiums(_req: Request, res: Response) {
    const premiumOffers = await this.offerService.findPremiums(DEFAULT_PREMIUM_OFFER_COUNT);

    this.ok(res, fillDTO(OffersResponse, premiumOffers));
  }

  public async getFavorites(
    {query}: Request<core.ParamsDictionary | unknown, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const favoriteOffers = await this.offerService.findFavorites(query.userId);

    this.ok(res, fillDTO(OffersResponse, favoriteOffers));
  }
}
