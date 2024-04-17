/*

//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption")
// const md5 = require("md5")
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("publc"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(
	session({
		secret: "Mysecret",
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
var usr = mongoose.createConnection(
	"mongodb+srv://admin-homeokart:homeokart%40123@cluster0.toq9z.mongodb.net/usersDB",
	{
		useNewUrlParser: true
	}
);
// mongoose.set("useCreateIndex",true)

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
	secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

// const User = new mongoose.model("User", userSchema);

const User = usr.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/secrets",
			// userProfileURL: "https://www.googleapis.com/oauth/v3/userinfo",
			passReqToCallback: true
		},
		function (request, accessToken, refreshToken, profile, done) {
			console.log(profile);
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user);
			});
		}
	)
);

app.get("/", function (req, res) {
	res.render("homepage");
});

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile"] })
);

app.get(
	"/auth/google/secrets",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/secrets");
	}
);

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {
	res.render("register");
});

// app.post("/register",function(req,res){

//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//         // Store hash in your password DB.
//         const newUser = new User({
//             email: req.body.username,
//             password: hash
//         });

//         newUser.save(function(err){
//             if(err) {
//                 console.log(err);
//             } else{
//                 res.render("secrets");
//             }
//         })
//     });
//     // const newUser = new User({
//     //     email: req.body.username,
//     //     password: md5(req.body.password)
//     // });

//     // newUser.save(function(err){
//     //     if(err) {
//     //         console.log(err);
//     //     } else{
//     //         res.render("secrets");
//     //     }
//     // })
// })
// // console.log(md5("Hash@123"));

// app.post("/login",function(req,res){
//     const username = req.body.username;
//     const password = req.body.password;
//     // const password = md5(req.body.password);

//     User.findOne({email: username}, function(err,foundUser){
//         if(err){
//             console.log(err);
//         }
//         else{
//             if (foundUser){
//                 // if(foundUser.password === password){
//                     bcrypt.compare(password, foundUser.password, function(err, result) {
//                         // result == true
//                         if(result === true){
//                             res.render("secrets")
//                         }
//                     });

//                 // }
//             }
//         }
//     })
// })

app.get("/secrets", function (req, res) {
	// if(req.isAuthenticated()){
	//     res.render("secrets")
	// }
	// else{
	//     res.redirect("/login");
	// }

	User.find({ secret: { $ne: null } }, function (err, foundUsers) {
		if (err) {
			console.log(err);
		} else {
			if (foundUsers) {
				res.render("secrets", { usersWithSecrets: foundUsers });
			}
		}
	});
});

app.post("/register", function (req, res) {
	// res.render("register")
	User.register(
		{ username: req.body.email },
		req.body.password,
		function (err, user) {
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/secrets");
				});
			}
		}
	);
});

app.post("/login", function (req, res) {
	const user = new User({
		username: req.body.email,
		password: req.body.password
	});

	console.log("This user", user);
	req.login(user, function (err) {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/");
			});
		}
	});
	// res.render("login")
});

app.get("/submit", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("submit");
	} else {
		res.redirect("/login");
	}
});

app.post("/submit", function (req, res) {
	const submittedSecret = req.body.secret;

	console.log(req.user.id);

	User.findById(req.user.id, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				foundUser.secret = submittedSecret;
				foundUser.save(function () {
					res.redirect("/secrets");
				});
			}
		}
	});
});

app.get("/logout", function (req, res) {
	req.logOut();
	res.redirect("/");
});

app.listen(5000, function (req, res) {
	console.log("server started on port 3000..!!!");
});
*/
