import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import OfferResponse from './response/offer.response';
import CreateOfferDto from './dto/create-offer.dto.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferController) private readonly offerService: OfferServiceInterface,) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.createOffer });
    this.addRoute({ path: '/update', method: HttpMethod.Put, handler: this.updateOffer });
    this.addRoute({ path: '/{offerId}', method: HttpMethod.Get, handler: this.getOffer });
    this.addRoute({ path: '/{offersCount}', method: HttpMethod.Get, handler: this.getOffers });
  }

  public async createOffer({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    this.created(res, offer);
  }

  public async updateOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(req.body.id, req.body.userDto);
    this.ok(res, offer);
  }

  public async getOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.body.id);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(Number((req.url.match(/(?<=offers\/)(\d+)/g))));
    const offerResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offerResponse);
  }
}

