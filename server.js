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
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient

let db;
/*
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
*/
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated, (req,res)=>{
    res.render('index.ejs',{name: req.body.name})
})

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirct: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthenticated, (req,res)=>{
    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated, async (req,res)=>{
    try{
        /*
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
        */
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //res.redirect('/login')
        res.render('regSuccess.ejs', {name: req.body.name});
        
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

app.delete('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req,res,next){
    console.log("authenticatin?");
    if (users.length > 0) {
        console.log("users array size: " + users.length + ", user 0: " + users[0].email);
    }
    if(req.isAuthenticated()){
        console.log(" is autheticated!");
        return res.redirect('/')
        
    }
    //console.log(" not authenticated....going to next: " + next);
    next()
}


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})