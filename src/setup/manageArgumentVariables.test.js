import { manageArgumentVariables } from "./manageArgumentVariables";
import { Command } from "commander";

let mockExit;
let mockStdout;
let writeSpy;
let commander;

describe("manageArgumentVariables - Basic tests", () => {
  beforeAll(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation();
    mockStdout = jest.spyOn(process.stdout, "write").mockImplementation();
    writeSpy = jest.spyOn(console, "log");
  });

  beforeEach(() => {
      commander = new Command();
  })

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return the correct environment variables if optional arguments are not used", () => {
    const previousArgs = JSON.parse(JSON.stringify(process.argv));
    process.argv = ["node", "dummy.js"];

    const expected = { env: "dev" };
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
    expect(writeSpy).toHaveBeenCalledWith(
      "For more information on how to use this program, please visit https://github.com/OUP2/oupe-demo-title-finder#readme"
    );
  });
});
