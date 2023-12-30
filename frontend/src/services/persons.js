import axios from 'axios'

const baseUrl = '/api/persons/'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject, notificationSetter, notificationStyleSetter) => {
  const request = axios.post(baseUrl, newObject)

  notificationSetter(`${newObject.name} was added to the database`)
  notificationStyleSetter(true)
  setTimeout(() => {
    notificationSetter(null)
  }, 5000)

  return request.then(response => response.data)
}

const update = (id, newObject, notificationSetter, notificationStyleSetter) => {
  var confirmedUpdate = false

  try {
    confirmedUpdate = window.confirm(
      `${newObject.name} is already in the phonebook. Do you want to replace the old number with the new one?`
    )
  } catch(e) {
    notificationSetter(`${newObject.name} had been removed from the server before I could make this change`)
    notificationStyleSetter(false)
    setTimeout(() => {
      notificationSetter(null)
    }, 5000)
    return
  }

  if (!confirmedUpdate) { return }

  const request = axios.put(`${baseUrl}/${id}`, newObject)

  return request
            .then(response => {
              notificationSetter(`The number for ${newObject.name} was updated`)
              notificationStyleSetter(true)
              setTimeout(() => {
                notificationSetter(null)
              }, 5000)
              return response.data
            })
            .catch(error => {
              notificationSetter(`There was an error in adding ${newObject.name} to the database`)
              notificationStyleSetter(false)
              setTimeout(() => {
                notificationSetter(null)
              }, 5000)
            })
}

const deletePerson = (id, arrayToUpdate, setterFunc, notificationSetter, notificationStyleSetter) => {
    const personToDelete = arrayToUpdate.filter(p => p.id === id)[0].name
    var confirmDeletion = window.confirm(
        `Delete ${personToDelete}?`
    )

    if (!confirmDeletion) { return }

    const request = axios.delete(`${baseUrl}/${id}`)

    const filterAndUpdate = () => {
        setterFunc(
            arrayToUpdate.filter(
                a => a.id !== id
            )
        )
    }

    return request
        .then(response => {
            filterAndUpdate()
            notificationSetter(
                `${personToDelete} was deleted from the database.`
            )
            notificationStyleSetter(true)
            setTimeout(() => {
              notificationSetter(null)
            }, 5000)
        })
        .catch(error => {
            notificationSetter(
                `Information for ${personToDelete} has already been removed from the database.`
            )
            notificationStyleSetter(false)
            setTimeout(() => {
              notificationSetter(null)
            }, 5000)
            filterAndUpdate()
        })
}

export default {
  getAll: getAll, 
  create: create, 
  update: update,
  deletePerson: deletePerson,
}