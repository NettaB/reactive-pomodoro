import { fromEvent, merge, interval, of, empty, timer } from 'rxjs';
import { map, tap, filter, takeWhile, switchMap, withLatestFrom, share, startWith, mapTo } from 'rxjs/operators';
import { startBtn, pauseBtn, resetBtn } from './inputs';
import { body, timerDisplay } from './outputs';
import { latestTimer$ } from './store';

import { save$ } from './duration-selector';
import { imageUrl$ } from './image-url';

const backgroundImage$ = interval(60000).pipe(
    startWith(0),
    switchMap(() => imageUrl$)
);
backgroundImage$.subscribe((imageUrl) => {body.style.background = `url(${imageUrl}) center center no-repeat fixed border-box padding-box`});

// observable creation from inputs
const start$ = fromEvent(startBtn, 'click').pipe(mapTo(1));
const pause$ = fromEvent(pauseBtn, 'click');
const reset$ = fromEvent(resetBtn, 'click');

// timer management functionality

const stopTimer$ = merge(pause$, reset$).pipe(mapTo(0));

const timer$ = merge(start$, stopTimer$).pipe(
    switchMap((val) => val ? timer(0, 1000) : empty()),
    startWith(0),
    withLatestFrom(latestTimer$),
    map(([i, lastValue]) => lastValue - i),
    share()
)

const pausedTimerValue$ = pause$.pipe(
    withLatestFrom(timer$),
    map(([e, lastTimer]) => lastTimer));

const resetTimerValue$ = reset$.pipe(mapTo(1500));

merge(pausedTimerValue$, resetTimerValue$).subscribe(latestTimer$);

const timerDisplay$ = merge(timer$, resetTimerValue$).pipe(
    map(ms => `${Math.floor(ms / 60)}:${(ms % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`))

timerDisplay$.subscribe((timer) => {
    timerDisplay.innerHTML = timer
    },
    () => {},
    () => alert(`time's up!!`)
);