//? Requirments declaration
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const schema = mongoose.Schema

//? Declaration of message schema
const messageSchema = new schema({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false,
        default: ""
    },
    receiver:
    {
        type: String
    }
})

//? Declaration of user schema
const userSchema = new schema({
    nickname: {
        type: String,
        required: true
    },
    messages: {
        type: Map,
        of: [messageSchema]
    }
})

//? Mongoose connection initialization 
mongoose
    .connect("mongodb://localhost:27017/new", { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connect"))
    .catch(err => console.log(err))

const userItem = mongoose.model('user', userSchema)
const messageItem = mongoose.model('message', messageSchema)

//? Consts Server configuration
const PORT = 8080;
const HOST = '0.0.0.0'

// const userRecord = userItem({
//     nickname: "Lorenzo",
//     messages: []
// })
// userRecord.save().then(info => console.log(`Saved`))

//?  App initialization
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//! Mongo get TestRoute
//TODO Fix this route to send correctly a date and not a string, or find a way to set fields not to null
app.get('/chat', (req, res) => {
    messageItem.find().then(rec => res.send(rec)).catch(err => res.status(500).send('Internal Server error'))
})

//! Mongo post TestRoute
app.post('/chat/all', (req, res) => {
    console.log("Receiving message...")
    let date = req.body.date ? req.body.date : Date.now()
    const messageRecord = messageItem({
        sender: req.body.nickname,
        message: req.body.message,
        date: date
    })
    messageRecord.save().then(info => console.log(`saved ${info}`))
    res.send("Message received")
})

//! Mongo post to send a message
app.post('/chat', (req, res) => {
    console.log("Sending the message...")
    let date = req.body.date ? req.body.date : Date.now()
    const messageRecord = messageItem({
        sender: req.body.nickname,
        message: req.body.message,
        date: date,
        receiver: req.body.receiver
    })
    userItem.findOne({ nickname: req.body.receiver }, (err, user) => {
        let messageToInsert = []
        if (user.messages.get(req.body.nickname) != undefined) {
            messageToInsert = user.messages.get(req.body.nickname)
        }
        messageToInsert.push(messageRecord)
        user.messages.set(req.body.nickname, messageRecord)
        user.save()
    })
    res.send("Private message sended")
})

//!Get for the private chat
app.post('/chat/private', (req, res) => {


    userItem.findOne({ nickname: req.body.nickname }).then(rec => res.send(rec)).catch(err => res.status(500).send('Internal Server error'))
}
)

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