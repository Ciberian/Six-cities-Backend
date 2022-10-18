import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import OfferResponse from './response/offer.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    this.created(res, offer);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(req.params.offerId, req.body);
    this.ok(res, offer);
  }

  public async show(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(String(req.query.count));
    const offerResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offerResponse);
  }
}

