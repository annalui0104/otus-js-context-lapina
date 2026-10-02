
export function serialProcess(list, handler) {
    return new Promise((resolve, reject) => {
        const results = [];

        let index = 0;

        const processNext = () => {
            if (index >= list.length) {
                resolve(results);
                return;
            }

            const currentIndex = index;

            index++;

            let completed = false;

            const done = (result) => {
                if (completed) {
                    return;
                }

                completed = true;

                results[currentIndex] = result;

                queueMicrotask(processNext);
            };

            try {
                handler(
                    list[currentIndex],
                    currentIndex,
                    list,
                    done,
                );
            } catch (error) {
                reject(error);
            }
        };

        processNext();
    });
}