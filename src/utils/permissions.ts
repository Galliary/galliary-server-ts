export enum Permissions {
  NONE = 0,

  // UNSAFE_PERMISSIONS
  ADMINISTRATOR = 1 << 0,

  MANAGE_PERMISSIONS = 1 << 1,

  MODERATE_ENTITIES = 1 << 2,
  MODERATE_USERS = 1 << 3,

  MANAGE_REPORTS = 1 << 4,
  VIEW_REPORTS = 1 << 5,

  MANAGE_MODERATORS = 1 << 6,
  VIEW_MODERATORS = 1 << 7,

  MANAGE_AUDIT = 1 << 8,
  VIEW_AUDIT = 1 << 9,

  // SAFE PERMISSIONS
  CREATE_FAVOURITES = 1 << 10,
  CREATE_REPORTS = 1 << 11,

  DELETE_OWNED_ENTITIES = 1 << 12,
  UPDATE_OWNED_ENTITIES = 1 << 13,
  CREATE_ENTITIES = 1 << 14,
  VIEW_ENTITIES = 1 << 15,
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
    // all safe permissions
    Permissions.CREATE_FAVOURITES,
    Permissions.CREATE_REPORTS,
    Permissions.DELETE_OWNED_ENTITIES,
    Permissions.UPDATE_OWNED_ENTITIES,
    Permissions.CREATE_ENTITIES,
    Permissions.VIEW_ENTITIES,
  ],
)
