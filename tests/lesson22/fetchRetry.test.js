
import {
    afterEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    fetchRetry,
} from "../../src/lesson22/fetchRetry.js";

describe("fetchRetry", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    test("возвращает ответ при успешном запросе", async () => {
        const response = {
            ok: true,
            status: 200,
        };

        const fetchMock = vi.fn()
            .mockResolvedValue(response);

        vi.stubGlobal("fetch", fetchMock);

        const result = await fetchRetry(
            "/products",
            3,
            100,
        );

        expect(result).toBe(response);
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("/products");
    });

    test("повторяет запрос после сетевой ошибки", async () => {
        const response = {
            ok: true,
            status: 200,
        };

        const fetchMock = vi.fn()
            .mockRejectedValueOnce(
                new Error("Network error"),
            )
            .mockResolvedValueOnce(response);

        vi.stubGlobal("fetch", fetchMock);

        const result = await fetchRetry(
            "/products",
            3,
            0,
        );

        expect(result).toBe(response);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("повторяет запрос после HTTP 500", async () => {
        const response = {
            ok: true,
            status: 200,
        };

        const fetchMock = vi.fn()
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
            })
            .mockResolvedValueOnce(response);

        vi.stubGlobal("fetch", fetchMock);

        const result = await fetchRetry(
            "/products",
            3,
            0,
        );

        expect(result).toBe(response);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("возвращает ошибку после исчерпания попыток", async () => {
        const error = new Error("Network error");

        const fetchMock = vi.fn()
            .mockRejectedValue(error);

        vi.stubGlobal("fetch", fetchMock);

        await expect(
            fetchRetry("/products", 3, 0),
        ).rejects.toThrow("Network error");

        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    test("возвращает ошибку, если сервер всегда отвечает HTTP 503", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: false,
                status: 503,
            });

        vi.stubGlobal("fetch", fetchMock);

        await expect(
            fetchRetry("/products", 2, 0),
        ).rejects.toThrow("HTTP error: 503");

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("выдерживает задержку между попытками", async () => {
        vi.useFakeTimers();

        const response = {
            ok: true,
            status: 200,
        };

        const fetchMock = vi.fn()
            .mockRejectedValueOnce(
                new Error("Network error"),
            )
            .mockResolvedValueOnce(response);

        vi.stubGlobal("fetch", fetchMock);

        const request = fetchRetry(
            "/products",
            2,
            1000,
        );

        expect(fetchMock).toHaveBeenCalledTimes(1);


        await vi.advanceTimersByTimeAsync(999);

        expect(fetchMock).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1);

        expect(fetchMock).toHaveBeenCalledTimes(2);

        await expect(request).resolves.toBe(response);
    });

    test("не принимает нулевое количество попыток", async () => {
        await expect(
            fetchRetry("/products", 0, 100),
        ).rejects.toThrow(RangeError);
    });

    test("не принимает отрицательную задержку", async () => {
        await expect(
            fetchRetry("/products", 3, -100),
        ).rejects.toThrow(
            "Задержка должна быть неотрицательным числом",
        );
    });

    test("не принимает некорректную задержку", async () => {
        await expect(
            fetchRetry("/products", 3, NaN),
        ).rejects.toThrow(RangeError);
    });
});