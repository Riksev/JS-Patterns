const {
  UserRepository,
  FileManager,
  Logger,
  User,
} = require("./shopAdministration_old");

describe("Check shop administration functionality", () => {
  let userRepository;
  let logger;
  let fileManager;

  const testCases = [
    {
      function: () => {
        const userAlice = new User("Alice", 30);
        userRepository.addUser(userAlice);
        const userBob = new User("Bob", 25);
        userRepository.addUser(userBob);
        return userRepository.printData();
      },
      inString: "Test 'adding users'",
      expected: "Alice (30 years old)\nBob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadFrom(data);
        userRepository.removeUser("Alice");
        return userRepository.printData();
      },
      inString: "Test 'loading and removing users'",
      expected: "Bob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadFrom(data);
        return logger.clearLog();
      },
      inString: "Test 'clearing log'",
      expected: true,
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadFrom(data);
        return logger.getLog().split("\n").length;
      },
      inString: "Test 'check log info'",
      expected: 3,
    },
  ];

  beforeEach(() => {
    logger = new Logger();
    fileManager = new FileManager();
    userRepository = new UserRepository(logger, fileManager);
  });

  testCases.forEach((test) => {
    it(`'${test.inString}', expect '${test.expected}'`, () => {
      const res = test.function();
      expect(res).toBe(test.expected);
    });
  });
});
