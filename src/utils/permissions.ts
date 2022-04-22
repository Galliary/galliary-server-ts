export enum Permissions {
  NONE = 0,
  ADMINISTRATOR = 1 << 0,

  MANAGE_PERMISSIONS = 1 << 1,
  VIEW_PERMISSIONS = 1 << 2,

  MANAGE_USERS = 1 << 3,

  VIEW_AUDIT = 1 << 4,
  MANAGE_AUDIT = 1 << 5,

  MANAGE_ENTITIES = 1 << 6,

  VIEW_REPORTS = 1 << 7,
  MANAGE_REPORTS = 1 << 8,

  VIEW_MODERATORS = 1 << 9,

  UPLOAD_ALBUMS = 1 << 10,
  VIEW_ALBUMS = 1 << 11,

  UPLOAD_IMAGES = 1 << 12,
  VIEW_IMAGES = 1 << 13,

  VIEW_USERS = 1 << 14,
  FAVOURITE_ENTITIES = 1 << 15,

  UPDATE_BANNER = 1 << 16,
}

export class PermissionManager {
  private _permissions: number

  constructor(_permissions: number) {
    this._permissions = _permissions.valueOf()
  }

  public valueOf(): number {
    return this._permissions
  }

  public toString() {
    return this._permissions.toString()
  }

  get permissions() {
    return this._permissions
  }

  public static combine = (permissions: Permissions[]) => {
    let permission = 0

    for (const flag of permissions) {
      permission = permission | flag
    }

    return permission
  }

  public readonly not = {
    has: (...permissions: Permissions[]) => {
      return !this.has(...permissions)
    },
  }

  public static add = (permissions: number, perms: Permissions[]) => {
    return permissions | PermissionManager.combine(perms)
  }

  public static remove = (permissions: number, perms: Permissions[]) => {
    return permissions & ~PermissionManager.combine(perms)
  }

  public readonly has = (...permissions: Permissions[]) => {
    return !!(
      this._permissions &
      (Permissions.ADMINISTRATOR | PermissionManager.combine(permissions))
    )
  }

  public readonly add = (...permissions: Permissions[]) => {
    this._permissions = PermissionManager.add(this._permissions, permissions)
    return this._permissions
  }

  public readonly remove = (...permissions: Permissions[]) => {
    this._permissions = PermissionManager.remove(this._permissions, permissions)
    return this._permissions
  }
}

export const USER_DEFAULT_PERMISSIONS = PermissionManager.add(
  Permissions.NONE,
  [
    Permissions.UPDATE_BANNER,
    Permissions.FAVOURITE_ENTITIES,
    Permissions.VIEW_USERS,
    Permissions.VIEW_IMAGES,
    Permissions.UPLOAD_IMAGES,
    Permissions.VIEW_ALBUMS,
    Permissions.UPLOAD_ALBUMS,
  ],
)
