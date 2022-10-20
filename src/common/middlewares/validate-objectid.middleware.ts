import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

const { Types } = mongoose;

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private id: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    console.log(params[this.id]);
    const objectId = params[this.id];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(StatusCodes.BAD_REQUEST, `${objectId} is invalid ObjectID`, 'ValidateObjectIdMiddleware');
  }
}
