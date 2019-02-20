import { Observable } from 'rxjs';

// background image observable
export const imageUrl$ = Observable.create((observer) => {
    fetch('https://source.unsplash.com/collection/540518/1600x900')
    .then(res => {
        if (res.ok) {
            observer.next(res.url);
        }
    })
});