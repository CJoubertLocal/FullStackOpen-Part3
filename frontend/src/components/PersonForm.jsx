import { useState } from 'react'
import PersonService from '../services/persons'

const PersonForm = ({persons, setPersons, notificationSetter, notificationStyleSetter}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
  
    const addDetails = (event) => {
      event.preventDefault()
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
  
      const filteredPersons = persons.filter(p => p.name === newName)
      if (filteredPersons.length > 0) {
        if (filteredPersons.filter(p => p.number === newNumber).length > 0) {
          alert(`${newName} is already added to phonebook`)
        
        } else {
          const res = PersonService.
            update(filteredPersons[0].id, personObject, notificationSetter, notificationStyleSetter)
          
          if (typeof res !== 'undefined') {
            res.
              then(r => {
                setPersons(
                  persons.
                    filter(p => p.id !== filteredPersons[0].id).
                    concat(r)
                )
                setNewName('')
                setNewNumber('')
              })
          }
        }
  
      } else {
        PersonService.
          create(personObject, notificationSetter, notificationStyleSetter).
          then(r => {
            setPersons(persons.concat(r))
            setNewName('')
            setNewNumber('')
          })
      }
    }
  
    const handleNewNameChange = (event) => {
      setNewName(event.target.value)
    }
  
    const handleNewNumberChange = (event) => {
      setNewNumber(event.target.value)
    }
  
    return (
      <form onSubmit={addDetails}>
        <div>
          name: <input
            value={newName}
            onChange={handleNewNameChange}
            />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNewNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

  export default PersonForm