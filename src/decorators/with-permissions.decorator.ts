import { Permissions } from 'utils/permissions'
import { SetMetadata } from '@nestjs/common'

export const WithPermissions = (...permissions: Permissions[]) =>
  SetMetadata('permissions', permissions)
