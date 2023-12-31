import { useState } from 'react'
import { PropTypes } from 'prop-types'
import PersonService from '../services/persons'

const PersonForm = ({persons, setPersons, notificationSetter, notificationStyleSetter}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    PersonForm.propTypes = {
      persons: PropTypes.instanceOf(Array),
      setPersons: PropTypes.node.isRequired,
      notificationSetter: PropTypes.node.isRequired,
      notificationStyleSetter: PropTypes.node.isRequired,
    }
  
    const addDetails = (event) => {
      event.preventDefault()
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
  
      if (newName === '') {
        notificationStyleSetter(false)
            notificationSetter("Please include a name")
            setTimeout(() => {
              notificationSetter(null)
            }, 5000)
        return
      }

      const filteredPersons = persons.filter(p => p.name === newName)

      if (filteredPersons.length > 0) {
        if (filteredPersons.filter(p => p.number === newNumber).length > 0) {
          alert(`${newName} is already in the phonebook`)
        
        } else {
          personObject.auditNumber = filteredPersons[0].auditNumber
          PersonService.
            update(filteredPersons[0].id, personObject, notificationSetter, notificationStyleSetter).
            then(res => {
              setPersons(
                persons.
                  filter(p => p.id !== filteredPersons[0].id).
                  concat(res)
              )
              setNewName('')
              setNewNumber('')
            }).
            catch(error => {
              notificationStyleSetter(false)
              notificationSetter(error.response.data.error)
              return
            })
        }
  
      } else {
        PersonService.
          create(personObject, notificationSetter, notificationStyleSetter).
          then(r => {
            if (r) {
              setPersons(persons.concat(r))
              setNewName('')
              setNewNumber('')
            } else {
              throw Error
            }
          }).
          catch(error => {
            notificationStyleSetter(false)
            notificationSetter(error.response.data.error)
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