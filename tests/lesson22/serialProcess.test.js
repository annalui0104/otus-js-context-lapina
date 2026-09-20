
import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    serialProcess,
} from "../../src/lesson22/serialProcess.js";

describe("serialProcess", () => {
    test("возвращает результаты в правильном порядке", async () => {
        const result = await serialProcess(
            [1, 2, 3],
            (el, index, list, done) => {
                done(el * el);
            },
        );

        expect(result).toEqual([1, 4, 9]);
    });

    test("вызывает обработчик для каждого элемента", async () => {
        const handler = vi.fn((el, index, list, done) => {
            done(el * 2);
        });

        const list = [10, 20, 30];

        await serialProcess(list, handler);

        expect(handler).toHaveBeenCalledTimes(3);

        expect(handler).toHaveBeenNthCalledWith(
            1,
            10,
            0,
            list,
            expect.any(Function),
        );

        expect(handler).toHaveBeenNthCalledWith(
            2,
            20,
            1,
            list,
            expect.any(Function),
        );

        expect(handler).toHaveBeenNthCalledWith(
            3,
            30,
            2,
            list,
            expect.any(Function),
        );
    });

    test("не запускает следующий элемент до завершения предыдущего", async () => {
        const started = [];
        const finish = [];

        const result = serialProcess(
            ["A", "B", "C"],
            (el, index, list, done) => {
                started.push(el);
                finish.push(done);
            },
        );


        expect(started).toEqual(["A"]);

        finish[0]("result A");


        await Promise.resolve();

        expect(started).toEqual(["A", "B"]);

        finish[1]("result B");

        await Promise.resolve();

        expect(started).toEqual(["A", "B", "C"]);

        finish[2]("result C");

        await expect(result).resolves.toEqual([
            "result A",
            "result B",
            "result C",
        ]);
    });

    test("поддерживает асинхронный обработчик", async () => {
        const result = await serialProcess(
            [1, 2, 3],
            (el, index, list, done) => {
                setTimeout(() => {
                    done(el * 10);
                }, 5);
            },
        );

        expect(result).toEqual([10, 20, 30]);
    });

    test("возвращает пустой массив для пустого списка", async () => {
        const handler = vi.fn();

        const result = await serialProcess([], handler);

        expect(result).toEqual([]);

        expect(handler).not.toHaveBeenCalled();
    });

    test("игнорирует повторный вызов done", async () => {
        const result = await serialProcess(
            [1, 2],
            (el, index, list, done) => {
                done(el);

                done(el * 100);
            },
        );

        expect(result).toEqual([1, 2]);
    });

    test("отклоняет промис при ошибке обработчика", async () => {
        const handler = () => {
            throw new Error("Ошибка обработки");
        };

        await expect(
            serialProcess([1, 2], handler),
        ).rejects.toThrow("Ошибка обработки");
    });
});