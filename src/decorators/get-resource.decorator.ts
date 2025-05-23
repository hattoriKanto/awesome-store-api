import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetResource = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.resource;
  },
);
