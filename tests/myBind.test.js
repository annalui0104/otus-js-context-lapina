import { afterAll, describe, expect, test } from "vitest";

import "../src/myBind.js";

describe("myBind", () => {
    afterAll(() => {
        delete Function.prototype.myBind;
    });

    test("привязывает контекст к функции", () => {
        function greet() {
            return `Привет, ${this.name}!`;
        }

        const person = {
            name: "Алиса",
        };

        const greetAlice = greet.myBind(person);

        expect(greetAlice()).toBe("Привет, Алиса!");
    });

    test("передает аргументы при вызове связанной функции", () => {
        function greet(greeting, punctuation) {
            return `${greeting}, ${this.name}${punctuation}`;
        }

        const person = {
            name: "Алиса",
        };

        const greetAlice = greet.myBind(person);

        expect(
            greetAlice("Привет", "!"),
        ).toBe("Привет, Алиса!");
    });

    test("поддерживает аргументы, переданные во время myBind", () => {
        function greet(greeting, punctuation) {
            return `${greeting}, ${this.name}${punctuation}`;
        }

        const person = {
            name: "Алиса",
        };

        const greetAlice = greet.myBind(
            person,
            "Привет",
        );

        expect(
            greetAlice("!"),
        ).toBe("Привет, Алиса!");
    });

    test("не изменяет исходную функцию", () => {
        function getName() {
            return this.name;
        }

        const alice = {
            name: "Алиса",
        };

        const bob = {
            name: "Боб",
        };

        const getAliceName = getName.myBind(alice);

        expect(getAliceName()).toBe("Алиса");
        expect(getName.call(bob)).toBe("Боб");
    });
});