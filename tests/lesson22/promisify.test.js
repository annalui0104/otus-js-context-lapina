import {
    describe,
    expect,
    test,
} from "vitest";

import {
    promisify,
} from "../../src/lesson22/promisify.js";

describe("promisify", () => {
    test("резолвится с результатом", async () => {
        function sum(a, b, callback) {
            callback(null, a + b);
        }

        const promisifiedSum = promisify(sum);

        await expect(
            promisifiedSum(2, 3),
        ).resolves.toBe(5);
    });

    test("реджектится при ошибке", async () => {
        function fail(callback) {
            callback("Ошибка");
        }

        const promisifiedFail = promisify(fail);

        await expect(
            promisifiedFail(),
        ).rejects.toBe("Ошибка");
    });

    test("передает все аргументы исходной функции", async () => {
        function sum(a, b, c, callback) {
            callback(null, a + b + c);
        }

        const promisifiedSum = promisify(sum);

        await expect(
            promisifiedSum(1, 2, 3),
        ).resolves.toBe(6);
    });

    test("undefined в качестве ошибки считается успехом", async () => {
        function getValue(callback) {
            callback(undefined, "ok");
        }

        const promisifiedGetValue =
            promisify(getValue);

        await expect(
            promisifiedGetValue(),
        ).resolves.toBe("ok");
    });
});