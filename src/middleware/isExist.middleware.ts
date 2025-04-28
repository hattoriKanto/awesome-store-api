import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MESSAGES } from 'src/constants';
import { Model, ModelMessages } from 'src/types';

export function isExistMiddleware<
  T extends Model,
  M extends keyof typeof ModelMessages,
>(findOneById: (id: string) => Promise<T | null>, modelName: M) {
  @Injectable()
  class Middleware implements NestMiddleware {
    async use(
      request: Request & { resource: T },
      _: Response,
      next: NextFunction,
    ): Promise<void> {
      const id = request.params.id;

      const resource = await findOneById(id);
      if (!resource) {
        throw new NotFoundException(
          MESSAGES[modelName as ModelMessages].notFound,
        );
      }

      request.resource = resource;

      next();
    }
  }

  return Middleware;
}
