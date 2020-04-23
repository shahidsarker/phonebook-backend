const express = require("express");
const app = express();

app.use(express.json());
const morgan = require("morgan");
// morgan("tiny");
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan("tiny", {
    skip: (req, res) => {
      return req.method === "POST";
    },
  })
);

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body",
    {
      skip: (req, res) => {
        return req.method !== "POST";
      },
    }
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

generateId = () => {
  const max = 1000;
  return Math.floor(Math.random() * max);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.number) {
    return res.status(400).json({ error: "number is missing" });
  }
  if (!body.name) {
    return res.status(400).json({ error: "name is missing" });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(409).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons.concat(person);
  // console.log(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
