//? Requirments declaration
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const schema = mongoose.Schema

//? Declaration of user schema
const userSchema = new schema({
    nickname: {
        type: String
    }
})

const messageSchema = new schema({
    nickname: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date
    }
})

//? Mongoose conection initialization 
mongoose
    .connect("mongodb://mongo:27017/new", { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connect"))
    .catch(err => console.log(err))

const userItem = mongoose.model('user', userSchema)
const messageItem = mongoose.model('message', messageSchema)

const record1 = userItem({
    nickname: "test"
})
record1.save().then(info => console.log(`record ${record1.nickname}`))

//? Map to store user in key value pair
const users = new Map();

//? Consts Server configuration
const PORT = 8080;
const HOST = '0.0.0.0'

//?  App initialization
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//! Mongo get TestRoute
app.get('/chat', (req, res) => {
    messageItem.find().then(rec => res.send(rec)).catch(err => res.status(500).send('Internal Server error'))
    //userItem.find().then(rec => res.send(rec)).catch(err => res.status(500).send("internal server error"))
})

//! Mongo post TestRoute
app.post('/chat', (req, res) => {
    console.log("Receiving message...")
    const messageRecord = messageItem({
        nickname: req.body.nickname,
        message: req.body.message,
        date: req.body.date
    })
    messageRecord.save().then(info => console.log(`saved ${messageRecord.nickname}, ${messageRecord.message}`))
    res.send("Message received")
})

//! Get for dipendenti
app.get('/', (req, res) => {
    let dipendenti =
        [
            { azienda: "taal", nome: "francesco", cognome: "ferrari", competenze: ["HTML", "CSS", "React", 'Javascript'], annoDiNascita: 1997 },
            { azienda: "taal", nome: "lorenzo", cognome: "ciani", competenze: ["HTML", "CSS", "Node", 'Docker'], annoDiNascita: 1998 },
            { azienda: "taal", nome: "niko", cognome: "blasi", competenze: ["undefined"], annoDiNascita: 1997 },
            { azienda: "taal", nome: "calogero", cognome: "miraglia", competenze: ["HTML", "CSS", "React", 'Typescript', "tutto il resto"], annoDiNascita: 1996 }
        ]
    res.json({ dipendenti })
});
//! Post to insert in map
app.post('/', (req, res) => {
    console.log('Receiving data...')
    users.set(req.body.nickname, req.body.desc)
    res.send('Data received')
})
//! Get to read from map
app.get("/getDesc", (req, res) => {
    res.send(users.get(req.query.nickname))
})
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)