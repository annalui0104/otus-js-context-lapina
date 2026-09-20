export function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error != null) {
                    reject(error);
                    return;
                }

                resolve(result);
            });
        });
    };
}