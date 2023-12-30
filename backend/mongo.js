// Based on example code from https://fullstackopen.com/en/part3/saving_data_to_mongo_db
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
if (process.argv.length<4) {
    console.log('give password as argument')
    process.exit(1)
}
if (process.argv.length<5) {
    console.log('give mongo cluster url as argument')
    process.exit(1)
}
if (process.argv.length<6) {
    console.log('give databasename as argument')
    process.exit(1)
}

const user = process.argv[2]
const password = process.argv[3]
const mongoURL = process.argv[4]
const databaseName = process.argv[5]

const url =
  `mongodb+srv://${user}:${password}@${mongoURL}/${databaseName}?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 7) {
    Person.find({}).then(result => {
        result.forEach(p => {
        console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
    return
}

const newPersonName = process.argv[6]
const newPersonNumber = process.argv[7]
const newPerson = new Person({
    name: newPersonName,
    number: newPersonNumber
})

newPerson.save().then(result => {
  console.log(`added ${newPersonName} number ${newPersonNumber} to phonebook`)
  mongoose.connection.close()
})