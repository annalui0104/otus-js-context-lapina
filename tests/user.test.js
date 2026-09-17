import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import { User } from "../src/user.js";

describe("User", () => {
    let promptMock;
    let alertMock;

    beforeEach(() => {
        promptMock = vi.fn();
        alertMock = vi.fn();

        vi.stubGlobal("prompt", promptMock);
        vi.stubGlobal("alert", alertMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    test("askName сохраняет имя пользователя", () => {
        promptMock.mockReturnValue("Анна");

        const user = new User();

        user.askName();

        expect(user.name).toBe("Анна");
    });

    test("askAge сохраняет возраст пользователя", () => {
        promptMock.mockReturnValue("36");

        const user = new User();

        user.askAge();

        expect(user.age).toBe("36");
    });

    test("showAgeInConsole выводит возраст в console.log", () => {
        const consoleSpy = vi
            .spyOn(console, "log")
            .mockImplementation(() => {});

        const user = new User();

        user.age = "36";

        user.showAgeInConsole();

        expect(consoleSpy).toHaveBeenCalledWith("36");
    });

    test("showNameInAlert показывает имя через alert", () => {
        const user = new User();

        user.name = "Анна";

        user.showNameInAlert();

        expect(alertMock).toHaveBeenCalledWith("Анна");
    });

    test("методы можно вызывать цепочкой", () => {
        promptMock
            .mockReturnValueOnce("Анна")
            .mockReturnValueOnce("36");

        const consoleSpy = vi
            .spyOn(console, "log")
            .mockImplementation(() => {});

        const user = new User();

        const result = user
            .askName()
            .askAge()
            .showAgeInConsole()
            .showNameInAlert();

        expect(result).toBe(user);

        expect(user.name).toBe("Анна");
        expect(user.age).toBe("36");

        expect(consoleSpy).toHaveBeenCalledWith("36");
        expect(alertMock).toHaveBeenCalledWith("Анна");
    });
});