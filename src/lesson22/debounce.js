
export function debounce(fn, delay) {
    let timerId;

    return function (...args) {
        clearTimeout(timerId);

        const context = this;

        timerId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}