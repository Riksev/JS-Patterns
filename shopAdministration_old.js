"use strict";

/* SOLID::
 * SRP: single responsibility principle (only one reason to change)
 * OCP: open-closed principle
 * LSP: Liskov substitution principle
 * ISP: interface segregation principle
 * DIP: dependency inversion principle
 */

class UserManager {
  constructor() {
    this.users = [];
    this.logger = new Logger();
    this.fileManager = new FileManager();
  }

  addUser(name, age) {
    let user = new User(name, age);
    this.users.push(user);
    this.logger.log("User added: " + name);
    this.fileManager.saveUsersToFile(this.users);
  }

  removeUser(name) {
    this.users = this.users.filter((user) => user.name !== name);
    this.logger.log("User removed: " + name);
    this.fileManager.saveUsersToFile(this.users);
  }

  printUsers() {
    const users = new Array();
    this.users.forEach((user) => {
      console.log(user.getInfo());
      users.push(user.getInfo());
    });
    this.logger.log("Printed user list");
    return users.join("\n");
  }
}

class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.logger = new Logger();
  }

  getInfo() {
    this.logger.log("Getting info for user: " + this.name);
    return this.name + " (" + this.age + " years old)";
  }
}

class Logger {
  constructor() {
    this.logMessages = [];
  }

  log(message) {
    let timestamp = new Date().toISOString();
    let logMessage = timestamp + " - " + message;
    this.logMessages.push(logMessage);
    console.log(logMessage);
  }

  printLog() {
    const startMessage = "Log messages:";
    const messages = new Array(["Log messages:"]);
    console.log(startMessage);
    this.logMessages.forEach((msg) => {
      console.log(msg);
      messages.push(msg);
    });
    return messages.join("\n");
  }

  clearLog() {
    this.logMessages = [];
    this.log("Log cleared");
    return true;
  }
}

class FileManager {
  saveUsersToFile(users) {
    let fileData = "Users: \n";
    users.forEach((user) => {
      fileData += user.getInfo() + "\n";
    });
    console.log("Saving to file: \n" + fileData); // Simulate file saving
  }

  loadUsersFromFile(data, userManager) {
    let lines = data.split("\n");
    lines.forEach((line) => {
      if (line.startsWith("Users:")) return;
      let [name, age] = line.replace(" years old", "").split(" (");
      if (name && age) {
        userManager.addUser(name, parseInt(age));
      }
    });
  }
}

module.exports = {
  UserManager,
};
