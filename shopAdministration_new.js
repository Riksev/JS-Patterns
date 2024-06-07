"use strict";

/* Used patterns:::
 * Creational::
 * Singleton: (ensures that only one object of its kind exists)
 * Structural::
 * Facade: (provides a simple interface to the complex logic of one or several subsystems)
 * Behavioral::
 * Observer: (provides a way to react to events happening in other objects without coupling to their classes)
 */

class ILogger {
  log(message) {}
  printLog() {}
  getLog() {}
  clearLog() {}
}

class Logger extends ILogger {
  #logMessages;

  static instance;

  constructor() {
    super();
    if (Logger.instance) {
      return Logger.instance;
    }
    this.#logMessages = new Array();
    Logger.instance = this;
  }

  log(message) {
    let timestamp = new Date().toISOString();
    let logMessage = timestamp + " - " + message;
    this.#logMessages.push(logMessage);
    console.log(logMessage);
  }

  getLog() {
    const messages = new Array(["Log messages:"]);
    this.#logMessages.forEach((message) => {
      messages.push(message);
    });
    return messages.join("\n");
  }

  clearLog() {
    this.#logMessages = new Array();
    this.log("Log cleared");
    return true;
  }

  update(message) {
    this.log(message);
  }
}

class IFileManager {
  save(data) {}
  load(data, userManager) {}
}

class FileManager extends IFileManager {
  #observers;

  static instance = new FileManager();

  constructor() {
    super();
    if (FileManager.instance) {
      return FileManager.instance;
    }
    this.#observers = new Array();
    FileManager.instance = this;
  }

  save(data) {
    console.log("Saving to file: \n" + data); // Simulate file saving
    this.#notify("Users data is saved into file");
  }

  load(data) {
    this.#notify("Users data is prepared for reading");
    return data; // Simulate loading from a file
  }

  attach(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      return true;
    } else {
      return false;
    }
  }

  detach(observer) {
    if (this.#observers.includes(observer)) {
      this.#observers = this.#observers.filter((element) => {
        return element != observer;
      });
      return true;
    } else {
      return false;
    }
  }

  #notify(message) {
    this.#observers.forEach((element) => {
      element.update(message);
    });
  }
}

class User {
  #name;
  #age;

  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  getName() {
    return this.#name;
  }

  getAge() {
    return this.#age;
  }

  getInfo() {
    return this.getName() + " (" + this.getAge() + " years old)";
  }
}

class IRepository {
  showHistory() {}
  clearHistory() {}
}

class UserRepository extends IRepository {
  #logger;
  #fileManager;
  #users;

  static instance;

  constructor(logger, fileManager) {
    super();
    if (UserRepository.instance) {
      return UserRepository.instance;
    }
    this.#logger = logger;
    this.#fileManager = fileManager;
    this.#users = new Array();
    UserRepository.instance = this;
  }

  addUser(user) {
    this.#users.push(user);
    this.#logger.log("User added: " + user.getName());
    this.#saveUsers();
  }

  removeUser(name) {
    this.#users = this.#users.filter((user) => user.getName() !== name);
    this.#logger.log("User removed: " + name);
    this.#saveUsers();
  }

  printUsers() {
    const usersInfo = new Array();
    this.#users.forEach((user) => {
      console.log(user.getInfo());
      this.#logger.log("Getting info for user: " + user.getName());
      usersInfo.push(user.getInfo());
    });
    this.#logger.log("Printed user list");
    return usersInfo.join("\n");
  }

  #saveUsers() {
    let fileData = "Users: \n";
    this.#users.forEach((user) => {
      fileData += user.getInfo() + "\n";
    });
    this.#fileManager.save(fileData);
  }

  clearRepository() {
    this.#users = new Array();
    this.#logger.log("Repository was cleared");
    return true;
  }

  loadUsers(data) {
    const content = this.#fileManager.load(data);
    let lines = content.split("\n");
    lines.forEach((line) => {
      if (line.startsWith("Users:")) return;
      const [name, age] = line.replace(" years old", "").split(" (");
      if (name && age) {
        const user = new User(name, parseInt(age));
        this.addUser(user);
      }
    });
  }

  showHistory() {
    const history = this.#logger.getLog();
    console.log(this.#logger.getLog());
    return history;
  }

  clearHistory() {
    return this.#logger.clearLog();
  }
}

class UserRepositoryFacade {
  #userRepository;

  static instance;

  constructor(logger, fileManager) {
    if (UserRepositoryFacade.instance) {
      return UserRepositoryFacade.instance;
    }
    this.#userRepository = new UserRepository(logger, fileManager);
    UserRepositoryFacade.instance = this;
  }

  addUser(name, age) {
    const user = new User(name, age);
    this.#userRepository.addUser(user);
  }

  removeUser(name) {
    this.#userRepository.removeUser(name);
  }

  printUsers() {
    return this.#userRepository.printUsers();
  }

  clearRepository() {
    return this.#userRepository.clearRepository();
  }

  loadUsers(data) {
    this.#userRepository.loadUsers(data);
  }

  showHistory() {
    return this.#userRepository.showHistory();
  }

  clearHistory() {
    return this.#userRepository.clearHistory();
  }
}

module.exports = {
  UserRepositoryFacade,
  FileManager,
  Logger,
};
