import { fromEvent, merge } from 'rxjs';

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');

const start$ = fromEvent(startBtn, 'click');
const pause$ = fromEvent(pauseBtn, 'click');

const clicks$ = merge(start$, pause$);

clicks$.subscribe((e) => {console.log(e)});

//TODO: do not commit this until you create a new repo
