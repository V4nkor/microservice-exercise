console.log('Connecting to MongoDB')
const conn = new Mongo()

console.log('Creating the studentdb database')
const db = conn.getDB('studentdb')

console.log('Creating the students collection')
const studentSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'genre', 'schoolId'],
    properties: {
      name: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      genre: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      schoolId: {
        bsonType: 'int',
        description: 'must be an integer and is required'
      }
    }
  }
}

console.log('Creating the students collection with the schema validation')
db.createCollection('students', {
  validator: studentSchema
})

console.log('Inserting sample data')
db.students.insertMany([
  { name: 'Alice', genre: 'F', schoolId: 1 },
  { name: 'Tom', genre: 'M', schoolId: 2 },
  { name: 'Julien', genre: 'M', schoolId: 1 },
  { name: 'Marie', genre: 'F', schoolId: 2 },
  { name: 'Fabien', genre: 'M', schoolId: 3 },
  { name: 'Léane', genre: 'F', schoolId: 1 },
  { name: 'Nicolas', genre: 'M', schoolId: 3 }
])
