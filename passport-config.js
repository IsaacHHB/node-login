const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByEmail,getUserById){
    const authenticateUser = async (email,password, done) =>{
        console.log("HER!");
        const user = getUserByEmail(email)
        if(user == null){
            console.log("1");
            return done(null,false,{message:'No user with that email'})
        }

        try{
            console.log("2");
            if(await bcrypt.compare(password, user.password)) {
                return done(null,user)
            }else{
                console.log("3");
                return done(null,false,{message:'Password incorrect'})
            }
        }catch(e){
            console.log("4");
            return done(e)
        }
    }
    console.log("5");
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user,done) => done(null, user.id))
    passport.deserializeUser((id,done) => {
        console.log("6");
        return done(null, getUserById(id))
    })
}

module.exports = initialize