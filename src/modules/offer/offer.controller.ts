import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
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
import { UserServiceInterface } from '../user/user-service.interface.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
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
    this.addRoute({
      path: '/bundles/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const result = await this.offerService.create({...body, hostId: user.id});
    const offer = await this.offerService.findById(result.id);
    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.created(res, fillDTO(OfferResponse, {...offerFromArray, rank: 0}));
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const {params, body, user} = req;

    await this.offerService.updateById(params.offerId, body, user.id);
    const averageRank = await this.offerService.calcRank(params.offerId);

    const offer = await this.offerService.findById(params.offerId, user.id);
    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.ok(res, fillDTO(OfferResponse, {...offerFromArray, rank: averageRank}));
  }

  public async show(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const {params, user} = req;

    const offer = await this.offerService.findById(params.offerId, user?.id);
    const averageRank = await this.offerService.calcRank(params.offerId);

    const offerFromArray = (JSON.parse(JSON.stringify(offer).slice(1, -1)));
    this.ok(res, fillDTO(OfferResponse, {...offerFromArray, rank: averageRank}));
  }

  public async delete(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const {params, user} = req;
    if (await this.offerService.hasOwnOffer(params.offerId, user.id)) {
      throw new HttpError(
        StatusCodes.NOT_ACCEPTABLE,
        'The user can only delete his own offers.',
        'OfferController'
      );
    }

    const offer = await this.offerService.deleteById(params.offerId);
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
    req: Request<core.ParamsDictionary | unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {query, user} = req;
    const currentUser = await this.userService.findById(user?.id);
    const allOffers = await this.offerService.find(query.count);

    const offers = await Promise.all(allOffers.map(async (offer) => {
      const averageRank = await this.offerService.calcRank(String(offer._id));

      if (currentUser?.favorites.includes(String(offer._id))) {
        return {...offer, isFavorite: true, rank: averageRank};
      }

      return {...offer, isFavorite: false, rank: averageRank};
    }));

    this.ok(res, fillDTO(OffersResponse, offers));
  }

  public async getPremiums(req: Request, res: Response) {
    const premiumOffers = await this.offerService.findPremiums(DEFAULT_PREMIUM_OFFER_COUNT);
    const user = await this.userService.findById(req.user?.id);

    const offers = await Promise.all(premiumOffers.map(async (premiumOffer) => {
      const averageRank = await this.offerService.calcRank(String(premiumOffer._id));

      if (user?.favorites.includes(String(premiumOffer._id))) {
        return {...premiumOffer, isFavorite: true, rank: averageRank};
      }

      return {...premiumOffer, isFavorite: false, rank: averageRank};
    }));

    this.ok(res, fillDTO(OffersResponse, offers));
  }

  public async getFavorites(req: Request, res: Response) {
    const favoriteOffers = await this.offerService.findFavorites(req.user.id);
    const offers = await Promise.all(favoriteOffers.map(async (favoriteOffer) => {
      const averageRank = await this.offerService.calcRank(String(favoriteOffer._id));

      return {...favoriteOffer, isFavorite: true, rank: averageRank};
    }));

    this.ok(res, fillDTO(OffersResponse, offers));
  }
}
