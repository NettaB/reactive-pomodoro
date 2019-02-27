import { BehaviorSubject } from 'rxjs';

export const latestTimer$ = new BehaviorSubject(1500);

export const initialDuration$ = new BehaviorSubject(1500);