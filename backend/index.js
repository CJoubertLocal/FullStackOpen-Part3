require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

// based on getMethodToken
// at https://github.com/expressjs/morgan/blob/master/index.js
morgan.token('body', function getReqBody(req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
  const date = new Date();

  const numEntries = person.find({}).then(res => {
    info = `<p>
            Phonebook has info for ${res.length} people
          </p>
          <p>
            ${date}
          </p>`
    response.set('Content-Type', 'text/html');
    response.send(
        info
    )
  })
})

app.get('/api/persons', (request, response) => {
  person.find({}).then(res => {
    if (res) {
      response.json(res)
    } else {
      response.status(404).end()
    }
  })
})

app.get('/api/persons/:id', (request, response) => {
  person.findById(request.params.id).then(res => {
    if (res) {
      response.json(res)
    } else {
      response.status(404).end()
    }
  })
})

app.post('/api/persons/', (request, response)=> {
  if (request.body.name === undefined) {
    return response.status(400).json({
      error: `Please include a name for the person to be added to the phone book.`
    })
  }

  person
    .find({name: request.body.name})
    .then(res => {
      if (res.length > 0) {
        return response.status(406).json({
          error: `There is already a phonebok entry with this exact name.`
        })

      } else {
        const newPerson = new person({
          name: request.body.name,
          number: request.body.number
        })

        newPerson.save().then(savedPerson => {
          response.json(savedPerson)
        })
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  person.deleteOne({_id: request.params.id}).then(res => {
    response.status(204).end()
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})