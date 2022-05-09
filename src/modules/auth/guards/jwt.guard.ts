import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Needed to parse GraphQL's ExecutionContext for JWT.
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  canActivate(context: ExecutionContextHost) {
    const ctx = context.switchToHttp().getNext<{ req: Request }>() ?? {
      req: undefined,
    }

    const req =
      ctx.req ??
      context.switchToHttp().getRequest() ??
      (context as unknown as HttpArgumentsHost).getRequest()

    if (!req?.headers?.['authorization']) {
      return true
    }

    return super.canActivate(context)
  }
}
