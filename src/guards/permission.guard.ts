import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ANON_PERMISSIONS, Permissions } from 'utils/permissions'
import { Reflector } from '@nestjs/core'
import { ForbiddenError } from 'apollo-server-express'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'

@Injectable()
export class PermissionGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<Permissions[]>(
      'permissions',
      context.getHandler(),
    )

    if (!permissions) {
      return false
    }

    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user as JwtUser

    const hasPermission = user
      ? user.permissions.has(...permissions)
      : ANON_PERMISSIONS.has(...permissions)

    if (hasPermission) {
      return true
    }

    throw new ForbiddenError(
      `You are missing required permission (${permissions
        .map((p) => Permissions[p])
        .join(', ')}) in order to perform this action.`,
    )
  }
}
