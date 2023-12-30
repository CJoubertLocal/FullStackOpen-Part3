import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PersonService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)
  const [useSuccessStyle, setUseSuccessStyle] = useState(false)

  useEffect(
    () => {
      PersonService.getAll().then(ps => setPersons(ps))
    }, []
  )

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <Notification
        message={notification} 
        useSuccessStyle={useSuccessStyle} />
      <h2>Phonebook</h2>
      <Filter 
        filterName={filterName}
        handlefunc={handleFilterNameChange}
        />
      <h2>Add a new contact</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        notificationSetter={setNotification}
        notificationStyleSetter={setUseSuccessStyle}
        />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        personSetter={setPersons}
        filterName={filterName}
        notificationSetter={setNotification}
        notificationStyleSetter={setUseSuccessStyle}
        />
    </div>
  )
}

const Notification = ({message, useSuccessStyle}) => {
  const sucessStyle = {
    color: 'green',
    background: 'lightgreen',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = {
    color: 'red',
    background: 'grey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const notificationStyle = useSuccessStyle ? sucessStyle : errorStyle

  if (message === null) {
      return null
  }

  return (
      <div style={notificationStyle}>
          {message}
      </div>
  )
}

export default App