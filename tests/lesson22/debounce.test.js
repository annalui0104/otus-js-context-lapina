
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    debounce,
} from "../../src/lesson22/debounce.js";

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("не вызывает функцию сразу", () => {
        const callback = vi.fn();

        const debounced = debounce(callback, 500);

        debounced();

        expect(callback).not.toHaveBeenCalled();
    });

    test("вызывает функцию после задержки", () => {
        const callback = vi.fn();

        const debounced = debounce(callback, 500);

        debounced();

        vi.advanceTimersByTime(499);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledOnce();
    });

    test("отменяет предыдущий таймер", () => {
        const callback = vi.fn();

        const debounced = debounce(callback, 500);

        debounced();

        vi.advanceTimersByTime(300);

        debounced();

        vi.advanceTimersByTime(200);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);

        expect(callback).toHaveBeenCalledOnce();
    });

    test("использует аргументы последнего вызова", () => {
        const callback = vi.fn();

        const debounced = debounce(callback, 500);

        debounced("Мо");
        debounced("Москва");

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledExactlyOnceWith(
            "Москва",
        );
    });

    test("сохраняет контекст this", () => {
        const callback = vi.fn(function (value) {
            return `${this.name}: ${value}`;
        });

        const object = {
            name: "Поиск",
            run: debounce(callback, 500),
        };

        object.run("Москва");

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledOnce();

        expect(callback.mock.contexts[0]).toBe(object);
        expect(callback).toHaveBeenCalledWith("Москва");
    });

    test("после паузы допускает новый вызов", () => {
        const callback = vi.fn();

        const debounced = debounce(callback, 500);

        debounced("Москва");

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledTimes(1);

        debounced("Казань");

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledTimes(2);

        expect(callback).toHaveBeenLastCalledWith("Казань");
    });
});