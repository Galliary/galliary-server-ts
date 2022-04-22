import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PermissionManager, Permissions } from 'utils/permissions'
import { Reflector } from '@nestjs/core'
import { UserModel } from 'models/user.model'
import { ForbiddenError } from 'apollo-server-express'

@Injectable()
export class PermissionGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<Permissions[]>(
      'permissions',
      context.getHandler(),
    )
    if (!permissions) {
      return false
    }

    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user as UserModel
    const userPermissions = new PermissionManager(user.permissions)

    const hasPermission = userPermissions.has(...permissions)

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
