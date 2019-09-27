const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const server = require('http').createServer(app);
const passport = require("passport");
const keys = require("./config/keys");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const cloudinary = require(`./Tools/Cloudinary`);
const uuidv1 = require('uuid/v1');
const session = require('express-session');
const io = require('socket.io').listen(server);
const schedule = require('node-schedule');
const MovieModel = require('./models/MovieModel');
const fs = require('fs-extra');

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser());
app.use(passport.initialize());

app.use(session({ 
  secret: keys.SESSION_SECRET,
  resave: true, 
  saveUninitialized: true 
}));

io.on('connection', async client => { 
});

app.set("io", io);

app.use('/api', router);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const userExists = await User.findOne({ googleId: profile.id });
      if (userExists) {
        return done(null, userExists._id);
      } else {
        const basicAuthUser = await User.findOneAndUpdate(
          {email: profile.emails[0].value},
          {$set: {googleId: profile.id}}
        );
        if (basicAuthUser) {
          return done(null, basicAuthUser._id);
        } else {
          let username = profile.name.givenName+profile.name.familyName;
          const usernameExists = await User.findOne({ username: profile.name.givenName+profile.name.familyName });
          if (usernameExists) {
            while (username === profile.name.givenName+profile.name.familyName) {
              username = profile.name.givenName+profile.name.familyName + Math.floor(Math.random() * 100)
            }
          }
          const avatarPublicId = uuidv1();
          const emailHash = uuidv1();
          await cloudinary.uploader.upload(profile.photos[0].value, { public_id: avatarPublicId });
          const user = { 
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username,
            avatarPublicId,
            emailHash,
            locale: 'EN',
            confirmed: true,
          };
          let newUser = new User(user);
          const data = await User.collection.insertOne(newUser)
          if (data) {
            return done(null, data.insertedId);
          } 
        }
      }
    } catch(err) { console.log(err); }
  }
));

passport.use(
    new FortyTwoStrategy({
      clientID: keys.FORTYTWO_APP_ID,
      clientSecret: keys.FORTYTWO_APP_SECRET,
      callbackURL: "http://localhost:5000/api/auth/42/callback",
      profileFields: {
        'id': function (obj) { return String(obj.id); },
        'username': 'login',
        'displayName': 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url'
      }
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const userExists = await User.findOne({ fortyTwoId: profile.id });
        if (userExists) {
          return done(null, userExists._id);
        } else {
          const basicAuthUser = await User.findOneAndUpdate(
            {email: profile.emails[0].value},
            {$set: {fortyTwoId: profile.id}}
          );
          if (basicAuthUser) {
            return done(null, basicAuthUser._id);
          } else {
            let username = profile.username;
            const usernameExists = await User.findOne({ username: profile.username });
            if (usernameExists) {
              while (username === profile.username) {
                username = await profile.username + Math.floor(Math.random() * 100)
              }
            }
            const avatarPublicId = uuidv1();
            const emailHash = uuidv1();
            await cloudinary.uploader.upload(profile.photos[0].value, { public_id: avatarPublicId });
            const user = { 
                fortyTwoId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                username: username,
                avatarPublicId,
                emailHash,
                locale: 'EN',
                confirmed: true,
            };
            let newUser = new User(user);
            const data = await User.collection.insertOne(newUser)
            if (data) {
              return done(null, data.insertedId);
            } 
          }
        }
      } catch(err) { console.log(err); }
    }
));

const deleteUnseenMovies = async () => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth( oneMonthAgo.getMonth() - 1 );
  const moviesToDel = await MovieModel.find({ lastViewed: {$gt : oneMonthAgo} });
  moviesToDel.forEach(movie => {
    const tmpPath = `/tmp/movies/${movie.imdbId}`
    if (fs.existsSync(tmpPath)){
      fs.remove(tmpPath, err => {
        console.error(err)
      })
    }
  })
};

schedule.scheduleJob('* * 23 * * *', () => {
  deleteUnseenMovies(); 
});

async function connectMongo() {
  try {
    const MONGO_URI = require("./config/keys").MONGO_URI;
    const mongoose = require("mongoose");
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    console.log("MongoDB successfully connected");
    } catch(err) { console.log(err); }
}
connectMongo();

const port = 5000;
server.listen(port, () => `Server running on port ${port}`);