"use strict";

/* SOLID::
 * SRP: single responsibility principle (only one reason to change)
 * OCP: open-closed principle (possible expand without modifying)
 * LSP: Liskov substitution principle (interchangable classes)
 * ISP: interface segregation principle (without useless dependencies)
 * DIP: dependency inversion principle (only abstract dependency)
 */

class ILogger {
  log(message) {}
  getLog() {}
  clearLog() {}
}

class Logger extends ILogger {
  #logMessages;

  constructor() {
    super();
    this.#logMessages = new Array();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = timestamp + " - " + message;
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
}

class IFileManager {
  save(data) {}
  load(data) {}
}

class FileManager extends IFileManager {
  save(data) {
    console.log("Saving to file: \n" + data); // Simulate file saving
    return true;
  }

  load(data) {
    return data; // Simulate loading from a file
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
  loadFrom(data) {}
  printData() {}
}

class UserRepository extends IRepository {
  #logger;
  #fileManager;
  #users;

  constructor(logger, fileManager) {
    super();
    this.#logger = logger;
    this.#fileManager = fileManager;
    this.#users = new Array();
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

  printData() {
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

  loadFrom(data) {
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
}

module.exports = {
  UserRepository,
  FileManager,
  Logger,
  User,
};
