export function curry(fn) {
    const curried = (...args) => {
        if (args.length >= fn.length) {
            return fn(...args);
        }

        return (...nextArgs) => {
            return curried(...args, ...nextArgs);
        };
    };

    return curried;
}