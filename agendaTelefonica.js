const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.json());


//Ejercicio 3.7 y 3.8
app.use(morgan('tiny'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//---------------------------------------------------------------------------------------


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

//Ejercicio 3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
//--------------------------------------------------


//Ejercicio 3.2
app.get('/info', (request, response) => {
    let cantidad = 0
    persons.forEach(element => {
        cantidad = cantidad + 1;
    })
    const fecha = new Date()
    response.send('<p>La agenda tiene información de ' + cantidad + ' personas</p>' +
    '<p>' + fecha.toUTCString() + '</p>')
})
//----------------------------------------------------------------------------------------


//Ejercicio 3.3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contacto = persons.find(note => note.id === id)
    
    if (contacto) {
      response.json(contacto)
    } else {
      response.status(404).end()
    }
})
//----------------------------------------------------------------------


//Ejercicio 3.4
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
})
//----------------------------------------------------------


//Ejercicios 3.5 y 3.6
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    morgan.token('body', request => JSON.stringify(request.body))

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Falta el nombre o el numero' 
      })
    }

    persons.forEach(element =>{
        if(body.name = element.name){
            return response.status(400).json({ 
                error: 'El nombre ya esta en la lista'
            })
        }
    })
  
    const persona = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(persona)
  
    response.json(persona)
})
//---------------------------------------------------

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})