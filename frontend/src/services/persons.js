import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject, notificationSetter, notificationStyleSetter) => {
  const request = axios.post(baseUrl, newObject)
  return request.
          then(response => {
            notificationStyleSetter(true)
            notificationSetter(`${newObject.name} was added to the address book.`)
            setTimeout(() => {
              notificationSetter(null)
            }, 5000)
            return response.data
          }).
          catch(error => {
            notificationStyleSetter(false)
            notificationSetter(error.response.data.error)
            setTimeout(() => {
              notificationSetter(null)
            }, 5000)
          })
}

const update = (id, newObject, notificationSetter, notificationStyleSetter) => {
  var confirmedUpdate = false

  try {
    confirmedUpdate = window.confirm(
      `${newObject.name} is already in the phonebook. Do you want to replace the old number with the new one?`
    )
  } catch(error) {
    notificationStyleSetter(false)
    notificationSetter(`There was an error. Please try again.`)
    setTimeout(() => {
      notificationSetter(null)
    }, 5000)
    return
  }

  if (!confirmedUpdate) { return }

  const request = axios.put(`${baseUrl}/${id}`, newObject)

  return request
            .then(response => {
              notificationStyleSetter(true)
              notificationSetter(`The number for ${newObject.name} was updated`)
              setTimeout(() => {
                notificationSetter(null)
              }, 5000)
              return response.data
            })
            .catch(error => {
              notificationStyleSetter(false)
              notificationSetter(`${newObject.name}'s record was updated or removed by someone else before I could make this change. Please see the most recent changes and try again.`)
              setTimeout(() => {
                notificationSetter(null)
              }, 5000)
              throw error
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