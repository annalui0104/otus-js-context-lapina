import {
    describe,
    expect,
    test,
} from "vitest";

import {
    ForceConstructor,
} from "../src/forceConstructor.js";

describe("ForceConstructor", () => {
    test("создает объект при вызове с new", () => {
        const user = new ForceConstructor(
            "Анна",
            36,
        );

        expect(user.name).toBe("Анна");
        expect(user.age).toBe(36);
    });

    test("создает объект при вызове без new", () => {
        const user = ForceConstructor(
            "Анна",
            36,
        );

        expect(user.name).toBe("Анна");
        expect(user.age).toBe(36);
    });

    test("объект является экземпляром ForceConstructor при вызове с new", () => {
        const user = new ForceConstructor(
            "Анна",
            36,
        );

        expect(
            user instanceof ForceConstructor,
        ).toBe(true);
    });

    test("объект является экземпляром ForceConstructor при вызове без new", () => {
        const user = ForceConstructor(
            "Анна",
            36,
        );

        expect(
            user instanceof ForceConstructor,
        ).toBe(true);
    });

    test("разные вызовы создают разные объекты", () => {
        const anna = ForceConstructor(
            "Анна",
            36,
        );

        const alice = ForceConstructor(
            "Алиса",
            25,
        );

        expect(anna).not.toBe(alice);

        expect(anna).toEqual(
            expect.objectContaining({
                name: "Анна",
                age: 36,
            }),
        );

        expect(alice).toEqual(
            expect.objectContaining({
                name: "Алиса",
                age: 25,
            }),
        );
    });
});