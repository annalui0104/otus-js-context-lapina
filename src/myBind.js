Object.defineProperty(Function.prototype, "myBind", {
    configurable: true,
    writable: true,

    value: function (context, ...boundArgs) {
        const originalFunction = this;

        return function (...args) {
            return originalFunction.apply(
                context,
                [...boundArgs, ...args],
            );
        };
    },
});