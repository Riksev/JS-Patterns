const {
  UserRepositoryFacade,
  FileManager,
  Logger,
} = require("./shopAdministration_new");

describe("Check shop administration functionality", () => {
  let logger = new Logger();
  let fileManager = new FileManager();
  let userRepositoryFacade = new UserRepositoryFacade(logger, fileManager);
  let testNumber = 0;

  const testCases = [
    {
      function: () => {
        userRepositoryFacade.addUser("Alice", 30);
        userRepositoryFacade.addUser("Bob", 25);
        return userRepositoryFacade.printUsers();
      },
      inString: "Test 'adding users'",
      expected: "Alice (30 years old)\nBob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepositoryFacade.loadUsers(data);
        userRepositoryFacade.removeUser("Alice");
        return userRepositoryFacade.printUsers();
      },
      inString: "Test 'loading and removing users'",
      expected: "Bob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepositoryFacade.loadUsers(data);
        return userRepositoryFacade.clearHistory();
      },
      inString: "Test 'clearing log'",
      expected: true,
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepositoryFacade.loadUsers(data);
        return userRepositoryFacade.showHistory().split("\n").length;
      },
      inString: "Test 'check log info'",
      expected: 4,
    },
    {
      function: () => {
        logger = new Logger();
        fileManager = new FileManager();
        userRepositoryFacade = new UserRepositoryFacade(logger, fileManager);
        return userRepositoryFacade.showHistory().split("\n").length;
      },
      inString: "Test 'check reinitialization of subsystems'",
      expected: 4,
    },
    {
      function: () => {
        logger = new Logger();
        fileManager = new FileManager();
        fileManager.attach(logger);
        userRepositoryFacade = new UserRepositoryFacade(logger, fileManager);
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepositoryFacade.loadUsers(data);
        fileManager.detach(logger);
        return userRepositoryFacade.showHistory().split("\n").length;
      },
      inString: "Test 'check observers work'",
      expected: 7,
    },
  ];

  beforeEach(() => {
    testNumber += 1;
    if (testNumber != 5) {
      userRepositoryFacade.clearRepository();
      userRepositoryFacade.clearHistory();
    }
  });

  testCases.forEach((test) => {
    it(`'${test.inString}', expect '${test.expected}'`, () => {
      const res = test.function();
      expect(res).toBe(test.expected);
    });
  });
});
