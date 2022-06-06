export interface SyncResult<T = any> {
  success: boolean;
  failedItems?: T[];
}