import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { User as UserEntity } from '../users';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user ? (req.user as UserEntity) : undefined;
  },
);
