import sayHi from "./hello";

describe("hello - basic functionality", () => {
    it("should return a general greeting when calling the function without arguments", () => {
        const expected = "Hello world!";
        const actual = sayHi();
        expect(actual).toBe(expected);
    });

    it("should return a greeting including the name of a person when passing it as a string", () => {
        const expected = "Hello Carlos!";
        const actual = sayHi("Carlos");
        expect(actual).toBe(expected);
    })
})