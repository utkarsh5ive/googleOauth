import express from "express"
import { config } from 'dotenv';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import morgan from "morgan";

config()

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send("Welcome to the Google Authentication Example using Passport.js");
})

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (_, __, profile, done) => {
    return done(null, profile)
})) //Mandatory Code to use passport with google (passport google auth setup)


app.get('/auth/google', 
    passport.authenticate("google", { scope: ["profile", "email"] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/'}),
    (req, res) => {
        console.log(req.user)
        res.send('Google Authentication Successful.');
    }
)

app.get('/auth/google/')

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})