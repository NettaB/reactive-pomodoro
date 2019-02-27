import { fromEvent, merge, NEVER, timer } from 'rxjs';
import { map, tap, takeWhile, switchMap, withLatestFrom, share, mapTo, switchMapTo, filter, sample } from 'rxjs/operators';
import { startBtn, pauseBtn, resetBtn } from './inputs';
import { body, timerDisplay } from './outputs';
import { latestTimer$, initialDuration$ } from './state';

import { save$ } from './duration-selector';
import { imageUrl$ } from './image-url';

const backgroundImage$ = timer(0, 60000).pipe(
    switchMapTo(imageUrl$)
);
backgroundImage$.subscribe((imageUrl) => {body.style.backgroundImage = `url(${imageUrl})`});

// observable creation from inputs
const start$ = fromEvent(startBtn, 'click').pipe(mapTo(1));
const pause$ = fromEvent(pauseBtn, 'click');
const reset$ = fromEvent(resetBtn, 'click');

// timer management functionality

const stopTimer$ = merge(pause$, reset$).pipe(mapTo(0));

const countdown = () => timer(0, 1000).pipe(
    withLatestFrom(latestTimer$),
    map(([i, lastValue]) => lastValue - i),
    takeWhile(secs => secs >= 0),
)

const timer$ = merge(start$, stopTimer$).pipe(
    switchMap((val) => val ? countdown() : NEVER),
    share()
)



const pausedTimerValue$ = timer$.pipe(sample(pause$))

const resetTimerValue$ = merge(reset$, save$).pipe(
    withLatestFrom(initialDuration$),
    map(([e, duration]) => duration)
);

merge(pausedTimerValue$, resetTimerValue$).subscribe(latestTimer$);

const timerDisplayFormatter = ms =>
`${Math.floor(ms / 60)}:${(ms % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

const resetTimerDisplay$ = resetTimerValue$.pipe(map(timerDisplayFormatter));

const timerDisplay$ = timer$.pipe(map(timerDisplayFormatter));

const updateTimerDisplay = timer => timerDisplay.innerHTML = timer;

resetTimerDisplay$.subscribe(updateTimerDisplay);

timerDisplay$.subscribe(updateTimerDisplay);

timer$.pipe(filter(val => val === 0)).subscribe(() => {alert(`you're done!`)});