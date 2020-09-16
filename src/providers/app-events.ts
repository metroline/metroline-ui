import { Subject } from 'rxjs';

export interface AppEvent {
  id: string;
  data?: any;
}

export const appEvents = new Subject<AppEvent>();
