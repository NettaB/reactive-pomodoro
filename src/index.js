import { fromEvent, merge, interval, of } from 'rxjs';
import { map, tap, filter, takeWhile, switchMap, withLatestFrom, share, startWith, flatMap } from 'rxjs/operators';
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
const start$ = fromEvent(startBtn, 'click').pipe(map(e => 1));
const pause$ = fromEvent(pauseBtn, 'click');
const reset$ = fromEvent(resetBtn, 'click');

// timer management functionality

const stopTimer$ = merge(pause$, reset$).pipe(map(e => 0));
const resetTimer$ = merge(reset$, save$).pipe(map(e => 0));

const timer$ = merge(start$, stopTimer$).pipe(
    switchMap((val) => val ? interval(1000) : of(null)),
    filter(val => val !== null),
    map(i => i + 1),
    startWith(0)
)

const startTimer$ = merge(timer$, resetTimer$).pipe(
    withLatestFrom(latestTimer$),
    map(([i, lastValue]) => lastValue - i),
    takeWhile(val => val >= 0),
    share()
);

const pausedTimerValue$ = pause$.pipe(
    withLatestFrom(startTimer$),
    map(([e, lastTimer]) => lastTimer));

const resetTimerValue$ = reset$.pipe(map(e => 1500));

const timerValue$ = merge(pausedTimerValue$, resetTimerValue$)

timerValue$.subscribe(latestTimer$);

const timerDisplay$ = merge(startTimer$, resetTimerValue$).pipe(
    map(ms => `${Math.floor(ms / 60)}:${(ms % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`))

timerDisplay$.subscribe((timer) => {
    timerDisplay.innerHTML = timer
    },
    () => {},
    () => alert(`time's up!!`)
);