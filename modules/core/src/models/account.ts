/**
 * @module core/models
 */
import { AccountInfo } from './account-info';

/**
 * Information about an account for Realm of the Mad God.
 */
export interface Account {
  /**
   * A name for this account.
   */
  name?: string;
  /**
   * The email of this account.
   */
  guid: string;
  /**
   * The password of this account.
   */
  password: string;
  /**
   * The information associated with this account.
   */
  info: AccountInfo;
}
