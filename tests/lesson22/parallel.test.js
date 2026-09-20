
import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    Parallel,
} from "../../src/lesson22/parallel.js";

describe("Parallel", () => {
    test("job возвращает объект для чейнинга", () => {
        const runner = new Parallel(2);

        const result = runner.job((done) => {
            done("A");
        });

        expect(result).toBe(runner);
    });

    test("задачи не запускаются до done", async () => {
        const job = vi.fn((done) => {
            done("A");
        });

        const runner = new Parallel();

        runner.job(job);

        expect(job).not.toHaveBeenCalled();

        const result = new Promise((resolve) => {
            runner.done(resolve);
        });

        await expect(result).resolves.toEqual(["A"]);

        expect(job).toHaveBeenCalledOnce();
    });

    test("сохраняет порядок результатов", async () => {
        const runner = new Parallel(2);

        runner
            .job((done) => {
                setTimeout(() => done("A"), 30);
            })
            .job((done) => {
                setTimeout(() => done("B"), 10);
            })
            .job((done) => {
                setTimeout(() => done("C"), 5);
            });

        const result = new Promise((resolve) => {
            runner.done(resolve);
        });

        await expect(result).resolves.toEqual([
            "A",
            "B",
            "C",
        ]);
    });

    test("не запускает больше задач, чем позволяет лимит", async () => {
        const runner = new Parallel(2);

        const started = [];
        const finish = [];

        for (let i = 0; i < 4; i++) {
            runner.job((done) => {
                started.push(i);
                finish[i] = done;
            });
        }

        const result = new Promise((resolve) => {
            runner.done(resolve);
        });

        expect(started).toEqual([0, 1]);

        finish[1]("B");

        expect(started).toEqual([0, 1, 2]);

        finish[0]("A");

        expect(started).toEqual([0, 1, 2, 3]);

        finish[3]("D");
        finish[2]("C");

        await expect(result).resolves.toEqual([
            "A",
            "B",
            "C",
            "D",
        ]);
    });

    test("без лимита запускает все задачи", async () => {
        const runner = new Parallel();

        const started = [];
        const finish = [];

        for (let i = 0; i < 3; i++) {
            runner.job((done) => {
                started.push(i);
                finish[i] = done;
            });
        }

        const result = new Promise((resolve) => {
            runner.done(resolve);
        });

        expect(started).toEqual([0, 1, 2]);

        finish[0]("A");
        finish[1]("B");
        finish[2]("C");

        await expect(result).resolves.toEqual([
            "A",
            "B",
            "C",
        ]);
    });

    test("done для пустого списка вызывается асинхронно", async () => {
        const runner = new Parallel();

        const callback = vi.fn();

        runner.done(callback);

        expect(callback).not.toHaveBeenCalled();

        await Promise.resolve();

        expect(callback).toHaveBeenCalledWith([]);
    });

    test("повторный вызов колбэка задачи игнорируется", async () => {
        const runner = new Parallel(1);

        runner.job((done) => {
            done("Первый результат");
            done("Второй результат");
        });

        const result = new Promise((resolve) => {
            runner.done(resolve);
        });

        await expect(result).resolves.toEqual([
            "Первый результат",
        ]);
    });

    test("нельзя указать нулевой лимит", () => {
        expect(() => {
            new Parallel(0);
        }).toThrow();
    });
});