import {from, merge, fromEvent, interval} from 'rxjs';
import {map, tap, mergeMap, distinctUntilChanged, switchMap, filter, debounceTime, delay} from 'rxjs/operators';

console.log(`Hello there!`);

const summerFruit = [
    {type: 'melon', color: 'green'},
    {type: 'melon', color: 'yellow'},
    {type: 'grapes', color: 'red'},
    {type: 'grapes', color: 'white'},
    {type: 'melon', color: 'white'}
];
const summerFruit$ = from(summerFruit);

const winterFruit = [
    {type: 'apple', color: 'LimeGreen'},
    {type: 'pear', color: 'FireBrick'},
    {type: 'apple', color: 'Gold'},
    {type: 'apple', color: 'FireBrick'},
    {type: 'pear', color: 'LimeGreen'}
];

const winterFruit$ = from(winterFruit);
const button = document.getElementsByTagName('button');
const clickObservable = fromEvent(button, 'click');

// Using tap to perform side-effects
summerFruit$
    .pipe(
        tap((fruit) => {
            console.log('%c' + fruit.type, 'color:' + fruit.color);
            return fruit;
        })
    ).subscribe();

//but you can generally achieve almost everything via 'subscribe'

summerFruit$.subscribe((fruit) => { console.log(`this is a ${fruit.color} ${fruit.type}`) });

//Using map to return a different observable
summerFruit$
    .pipe(
        map(fruit => fruit.color)
    ).subscribe((color) => {
    console.log('%c' + color, 'color: ' + color)
});

//Using distinctUntilChanged to create a stream of fruits with distinct type
summerFruit$.pipe(
    tap((fruit) => {
        console.log(fruit);
        return fruit
    }),
    distinctUntilChanged((a, b) => a.type === b.type)
).subscribe((fruit) => console.log('distinct fruit', fruit));

//Using merge to create a stream out of two streams
const allFruit$ = merge(summerFruit$, winterFruit$);
allFruit$.pipe(
    tap((fruit) => {
        console.log(fruit);
        return fruit;
    })
).subscribe();


// mergeMap - subscribes to an observable of a certain type, and returns an observable of another type
// this will return the full winterFruit$ for each value emitted from summerFruit$
summerFruit$.pipe(
    mergeMap((fruit) => {
        return winterFruit$
    })
).subscribe((val) => console.log(val));


// mergeMap - finally! piping the winterFruit$ through the filter operator allows us to return only what we want
summerFruit$.pipe(
    mergeMap((summerFruit, i) => {
        return winterFruit$.pipe(
            filter((winterFruit, j) => i === j),
            map((winterFruit) => {
                return {winterFruit, summerFruit}
            })
        )
    })
).subscribe((fruitObject) => console.table(fruitObject));


clickObservable.pipe(
    delay(1000),
    mergeMap((event) => {
        return summerFruit$
    })
).subscribe((val) => {
    console.log(val)
});

clickObservable.pipe(
    delay(1000),
    switchMap((event) => {
        return summerFruit$
    })
).subscribe((val) => {
    console.log(val)
});

