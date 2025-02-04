const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Enter your password please')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@fullstack.yvxwb.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


const name = process.argv[3]
const number = process.argv[4]

if (!name || !number) {
  console.log('name or number is missing')
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else if (name && number) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(() => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Enter both name and number after your password as arguments')
}




