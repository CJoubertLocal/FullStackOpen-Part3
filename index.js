const express = require('express')
const app = express()
app.use(express.json())


let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
  const date = new Date();

  info = `<p>
          Phonebook has info for ${entries.length} people
        </p>
        <p>
          ${date}
        </p>`
  response.set('Content-Type', 'text/html');
  response.send(
       info
  )  
})

app.get('/api/persons', (request, response) => {
  if (entries) {
    response.json(entries)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons/:id', (request, response) => {
  result = entries.filter(e => e.id === Number(request.params.id))

  if (result.length === 1) {
    response.send(result)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons/', (request, response)=> {
  
  if (request.body.name === undefined) {
    return response.status(400).json({
      error: `Please include a name for the person to be added to the phone book.`
    })
  }
  
  if (request.body.number === undefined) {
    return response.status(400).json({
      error: `Please include a number for the person to be added to the phone book.`
    })
  }

  if (entries.filter(e => e.name.toLowerCase() === request.body.name.toLowerCase()).length) {
    return response.status(406).json({
      error: `There is already a phonebok entry with this exact name.`
    })
  }

  // assumes number of entries will never be as large as 100000.
  // an alternative to take double the current length of the array of entries.
  const newID = Math.floor(Math.random() * 100000)
  while (entries.filter(e => e.id === newID).length > 0) {
    newID = Math.floor(Math.random() * 100000)
  }

  const newEntry = request.body
  newEntry.id = newID

  entries = entries.concat(newEntry)

  response.json(newEntry)
})

app.delete('/api/persons/:id', (request, response) => {
  entries = entries.filter(e => e.id !== Number(request.params.id))
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})