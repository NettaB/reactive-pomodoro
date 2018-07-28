import { from, merge, fromEvent, interval } from 'rxjs';
import { map, tap, mergeMap, distinctUntilChanged, switchMap } from 'rxjs/operators';

console.log(`Hello there!`);

const summerFruit = [
    {type: 'melon', color: 'green'},
    {type: 'melon', color: 'yellow'},
    {type: 'grapes', color: 'red'},
    {type: 'grapes', color: 'white'},
    {type: 'melon', color: 'white'}
];

const winterFruit = [
    {type: 'apple', color: 'green'},
    {type: 'pear', color: 'red'},
    {type: 'apple', color: 'yellow'},
    {type: 'apple', color: 'red'},
    {type: 'pear', color: 'green'}
];
const summerFruitStream = from(summerFruit);
const winterFruitStream = from(winterFruit);

//
// // Using tap to perform side-effects
// summerFruitStream
//     .pipe(
//         tap((fruit) => {
//             console.log('%c' + fruit.type, 'color:' + fruit.color + '; background-color: black');
//             return fruit;
//         })
//     ).subscribe();
//
// //Using map to alter observable
// winterFruitStream
//     .pipe(
//         map(fruit => fruit.color)
//     ).subscribe((color) => { console.log('%c' + color, 'color: ' + color) });
//
// //Using merge to create a stream out of two streams
// const allFruitStream = merge(summerFruitStream, winterFruitStream);
// allFruitStream.pipe(
//     tap((fruit) => {
//         console.log(fruit);
//         return fruit;
//     })
// ).subscribe();
//
// //Using distinctUntilChanged to create a stream of fruits with distinct type
// summerFruitStream.pipe(
//     tap((fruit) => {
//         console.log(fruit);
//         return fruit
//     }),
//     distinctUntilChanged((a, b) => a.type === b.type)
// ).subscribe((fruit) => console.log('distinct fruit', fruit));


// summerFruitStream.pipe(
//     mergeMap((fruit) => {
//         winterFruitStream.pipe(
//             map(fruit => fruit.type)
//         )
//     })
// ).subscribe((val) => console.log(val));