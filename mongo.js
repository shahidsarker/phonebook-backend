require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 4) {
  console.log("give name and number as arguments");
  process.exit(1);
}

const name = process.argv[2];
const number = process.argv[3];

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});

person.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phonebook`);

  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
});

// Person.find({}).then((result) => {
//   console.log("phonebook:");
//   result.forEach((person) => {
//     console.log(`${person.name} ${person.number}`);
//   });
//   mongoose.connection.close();
// });
