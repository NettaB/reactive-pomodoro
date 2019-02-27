import { fromEvent, of } from 'rxjs';
import { map, share, flatMap } from 'rxjs/operators';
import { settingsBtn, setDurationBtn, minutesInput } from './inputs';
import { durationSelector } from './outputs';
import { latestTimer$, initialDuration$ } from './state';

// observable creation from inputs
const showSettings$ = fromEvent(settingsBtn, 'click');
const inputValue$ = of(minutesInput);
export const save$ = fromEvent(setDurationBtn, 'click').pipe(share());

// settings show functionality
showSettings$.subscribe(() => { durationSelector.style.visibility = 'visible'});

// get input section
const durationInSeconds$ = save$.pipe(
    flatMap(e => inputValue$),
    map(input => input.value * 60)
);

durationInSeconds$.subscribe(initialDuration$);

save$.subscribe(() => { durationSelector.style.visibility = 'hidden'});