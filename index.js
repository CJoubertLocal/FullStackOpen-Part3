const express = require('express')
const app = express()
app.use(express.json())


let notes = [
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
          Phonebook has info for ${notes.length} people
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
  if (notes) {
    response.json(notes)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons/:id', (request, response) => {
  result = notes.filter(n => n.id === Number(request.params.id))

  if (result.length === 1) {
    response.send(result)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  notes = notes.filter(n => n.id !== Number(request.params.id))
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})