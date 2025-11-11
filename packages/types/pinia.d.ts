import 'pinia';
import type { PersistConfig } from '../core/main';

declare module 'pinia' {
  export interface DefineStoreOptionsBase {
    persist?: PersistConfig | PersistConfig[];
  }
}
