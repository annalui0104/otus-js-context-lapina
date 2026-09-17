import {
    describe,
    expect,
    test,
} from "vitest";

import {
    curry,
} from "../src/curry.js";

describe("curry", () => {
    test("каррирует функцию с двумя аргументами", () => {
        function sum2(x, y) {
            return x + y;
        }

        const curriedSum = curry(sum2);

        expect(
            curriedSum(1)(2),
        ).toBe(3);
    });

    test("каррирует функцию с четырьмя аргументами", () => {
        function sum4(a, b, c, d) {
            return a + b + c + d;
        }

        const curriedSum = curry(sum4);

        expect(
            curriedSum(2)(3)(4)(5),
        ).toBe(14);
    });

    test("поддерживает передачу нескольких аргументов за один вызов", () => {
        function sum4(a, b, c, d) {
            return a + b + c + d;
        }

        const curriedSum = curry(sum4);

        expect(
            curriedSum(1, 2)(3, 4),
        ).toBe(10);
    });

    test("поддерживает смешанный способ передачи аргументов", () => {
        function sum4(a, b, c, d) {
            return a + b + c + d;
        }

        const curriedSum = curry(sum4);

        expect(
            curriedSum(1)(2, 3)(4),
        ).toBe(10);
    });

    test("работает со строками", () => {
        function join(a, b, c) {
            return `${a}-${b}-${c}`;
        }

        const curriedJoin = curry(join);

        expect(
            curriedJoin("one")("two")("three"),
        ).toBe("one-two-three");
    });
});