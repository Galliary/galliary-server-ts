import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_data, context: ExecutionContext): JwtUser => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  },
)
