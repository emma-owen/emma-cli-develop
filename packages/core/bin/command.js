function displayProp(obj) {
  console.log(obj.name);
  for (let key in obj) {
    console.log(`${key}:${obj[key]}`);
  }
}
console.log("filename---", __filename);
class Command {
  constructor(argv) {
    displayProp(this.constructor);
  }
  lis() {
    console.error("lis not defined");
  }
  list() {
    console.log("super list....");
  }
}

class ListCommand extends Command {
  list() {
    console.log("list....");
  }
}

module.exports = ListCommand;
