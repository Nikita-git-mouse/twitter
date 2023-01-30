import { IWallPermission } from '../../entities/models';

export interface IWallPermissionRepository {
  getByUserIdAndWallId: (
    userId: number,
    wallId: number,
  ) => Promise<IWallPermission | null>;
}
