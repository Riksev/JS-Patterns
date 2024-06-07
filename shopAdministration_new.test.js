const {
  UserRepository,
  FileManager,
  Logger,
  User,
} = require("./shopAdministration_new");

describe("Check shop administration functionality", () => {
  let userRepository;

  const testCases = [
    {
      function: () => {
        const userAlice = new User("Alice", 30);
        userRepository.addUser(userAlice);
        const userBob = new User("Bob", 25);
        userRepository.addUser(userBob);
        return userRepository.printUsers();
      },
      inString: "Test 'adding users'",
      expected: "Alice (30 years old)\nBob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadUsers(data);
        userRepository.removeUser("Alice");
        return userRepository.printUsers();
      },
      inString: "Test 'loading and removing users'",
      expected: "Bob (25 years old)",
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadUsers(data);
        return userRepository.clearHistory();
      },
      inString: "Test 'clearing log'",
      expected: true,
    },
    {
      function: () => {
        const data = "Users: \nAlice (30 years old)\nBob (25 years old)\n";
        userRepository.loadUsers(data);
        return userRepository.showHistory().split("\n").length;
      },
      inString: "Test 'check log info'",
      expected: 3,
    },
  ];

  beforeEach(() => {
    const logger = new Logger();
    const fileManager = new FileManager();
    userRepository = new UserRepository(logger, fileManager);
  });

  testCases.forEach((test) => {
    it(`'${test.inString}', expect '${test.expected}'`, () => {
      const res = test.function();
      expect(res).toBe(test.expected);
    });
  });
});
