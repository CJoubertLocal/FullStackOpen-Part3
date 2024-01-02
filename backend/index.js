require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

// based on getMethodToken
// at https://github.com/expressjs/morgan/blob/master/index.js
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

class ConcurrentUpdateError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  getName() { return this.name; }

  getStatusCode() { return this.statusCode; }
}

app.get('/info', (request, response) => {
  const date = new Date();

  Person.find({}).then((res) => {
    const info = `<p>
            Phonebook has info for ${res.length} people
          </p>
          <p>
            ${date}
          </p>`;

    response.set('Content-Type', 'text/html');
    response.send(info);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((res) => {
    if (res) {
      response.json(res);
    } else {
      response.status(404).end();
    }
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((res) => {
    if (res) {
      response.json(res);
    } else {
      response.status(404).end();
    }
  }).catch((error) => next(error));
});

// eslint-disable-next-line consistent-return
app.post('/api/persons', (request, response, next) => {
  if (request.body.name === undefined) {
    return response.status(400).json({
      error: 'Please include a name for the Person to be added to the phone book.',
    }).catch((error) => {
      next(error);
    });
  }

  Person
    .find({ name: request.body.name })
    .then((res) => {
      if (res.length > 0) {
        response.redirect(`/api/persons/${res[0].id}`);
      } else {
        const newPerson = new Person({
          name: request.body.name,
          number: request.body.number,
          auditNumber: 1,
        });

        newPerson
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = new Person({
    name: request.body.name,
    number: request.body.number,
    auditNumber: request.body.auditNumber,
    _id: request.params.id,
  });

  // First check if the audit number in the database matches that in the request body.
  Person
    .findById(request.params.id)
    .then(
      (databaseRecord) => {
        if (!databaseRecord) {
          next(Error(`${request.body.name} not found in database`));
        }

        if (databaseRecord.auditNumber !== updatedPerson.auditNumber) {
          throw new ConcurrentUpdateError(
            `${request.body.name}'s details were changed by someone else before I could apply your changes. Please check the current details and try again.`,
            500,
            'ConcurrentUpdateError',
          );
        }

        updatedPerson.auditNumber += 1;

        Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
          .then((updatedNote) => {
            response.json(updatedNote);
          })
          .catch((error) => next(error));
      },
    )
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownURL = (request, response) => {
  response.status(404).send({ error: 'URL not found' });
};

app.use(unknownURL);

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  console.log('errorhandler');
  console.error(error.message);
  console.log(error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'ConcurrentUpdateError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
