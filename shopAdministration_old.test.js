const { UserManager } = require("./shopAdministration_old");

describe("Check shop administration functionality", () => {
  let userManager;

  const testCases = [
    {
      function: () => {
        userManager.addUser("Alice", 30);
        userManager.addUser("Bob", 25);
        return userManager.printUsers();
      },
      inString: "Test 'adding users'",
      expected: "Alice (30 years old)\nBob (25 years old)",
    },
    {
      function: () => {
        const fileData = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userManager.fileManager.loadUsersFromFile(fileData, userManager);
        userManager.removeUser("Alice");
        return userManager.printUsers();
      },
      inString: "Test 'loading and removing users'",
      expected: "Bob (25 years old)",
    },
    {
      function: () => {
        const fileData = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userManager.fileManager.loadUsersFromFile(fileData, userManager);
        return userManager.logger.clearLog();
      },
      inString: "Test 'clearing log'",
      expected: true,
    },
    {
      function: () => {
        const fileData = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userManager.fileManager.loadUsersFromFile(fileData, userManager);
        return userManager.logger.printLog().split("\n").length;
      },
      inString: "Test 'check log info'",
      expected: 3,
    },
  ];

  beforeEach(() => {
    userManager = new UserManager();
  });

  testCases.forEach((test) => {
    it(`'${test.inString}', expect '${test.expected}'`, () => {
      const res = test.function();
      expect(res).toBe(test.expected);
    });
  });
});
