
export class Parallel {
    constructor(limit = Infinity) {
        if (
            limit !== Infinity &&
            (!Number.isInteger(limit) || limit < 1)
        ) {
            throw new Error(
                "Лимит должен быть положительным целым числом",
            );
        }

        this.limit = limit;
        this.jobs = [];
        this.started = false;
    }

    job(fn) {
        if (this.started) {
            throw new Error(
                "Нельзя добавлять задачи после запуска",
            );
        }

        this.jobs.push(fn);

        return this;
    }

    done(cb) {
        if (this.started) {
            throw new Error("Задачи уже запущены");
        }

        this.started = true;

        const total = this.jobs.length;

        if (total === 0) {
            queueMicrotask(() => cb([]));
            return;
        }

        const results = new Array(total);

        let nextIndex = 0;
        let active = 0;
        let completed = 0;
        let pumping = false;

        const pump = () => {
            if (pumping) {
                return;
            }

            pumping = true;

            while (
                active < this.limit &&
                nextIndex < total
                ) {
                const index = nextIndex++;

                active++;

                let settled = false;

                this.jobs[index]((result) => {
                    if (settled) {
                        return;
                    }

                    settled = true;

                    results[index] = result;

                    active--;
                    completed++;

                    if (completed === total) {
                        queueMicrotask(() => cb(results));
                    } else {
                        pump();
                    }
                });
            }

            pumping = false;
        };

        pump();
    }
}