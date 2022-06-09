if (process.env.NODE_ENV !== 'production'){
    require ('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const PORT = 8000
const MongoClient = require('mongodb').MongoClient

let db;

console.log('connecting to DB...')
MongoClient.connect('mongodb+srv://IsaacHHB:Hollowhorn7@cluster0.lkpys.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  db = client.db('stories')

  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
})
console.log("DB connect has been kicked off...")

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/',(req,res)=>{
    res.render('index.ejs',{name: 'Kyle'})
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirct: '/login',
    failureFlash: true
}))

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

app.post('/register',async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log("register POST received!");
        const usersCollection = db.collection('users')
        console.log('new user: ' + req.body.name)
        usersCollection.insertOne( {
            userId: Date.now().toString(),
            userName: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        .then(result => {
        res.render('regSuccess.ejs', {name: req.body.name})
        })

        /*
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //res.redirect('/login')
        let tmp_name = "Bob";
        res.render('regSuccess.ejs', {name: tmp_name});
        */
    }catch{
        res.redirect('/register')
    }
    
    //console.log(users)
})

app.get('/users',(req,res)=>{
    res.json(users)
})

app.post('/users',(req,res)=>{

})

/*
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
*/