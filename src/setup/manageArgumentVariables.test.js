import { manageArgumentVariables } from "./manageArgumentVariables";

let mockExit;
let mockStdout;
let mockConsole;

describe("manageArgumentVariables - Basic tests", () => {
  beforeAll(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation();
    mockStdout = jest.spyOn(process.stdout, "write");
    mockConsole = jest.spyOn(console, "log");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return a list with the correct environment variables", () => {
    const previousArgs = JSON.parse(JSON.stringify(process.argv));
    process.argv = [
      "yarn",
      "start",
      "--env",
      "pre",
      "--cli",
      "--user",
      "test",
      "--pass",
      "test",
    ];

    const expected = { env: "pre", cli: true, user: "test", pass: "test" };
    const actual = manageArgumentVariables();
    process.argv = previousArgs;

    expect(actual).toEqual(expected);
  });

  it("should print a help message if the help flag is passed on execution", () => {
    const previousArgs = JSON.parse(JSON.stringify(process.argv));
    process.argv = ["node", "dummy.js", "--help"];
    manageArgumentVariables();
    process.argv = previousArgs;

    expect(mockExit).toBeCalled();
    expect(mockConsole).toHaveBeenCalledWith(
      "For more information on how to use this program, please visit https://github.com/OUP2/oupe-demo-title-finder#readme"
    );
  });
});
