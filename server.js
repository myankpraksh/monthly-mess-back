const express = require("express");
const cors = require("cors");
const knex = require("knex");
const app = express();
const bcrypt = require("bcrypt-nodejs");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "Icola",
    password: "tree",
    database: "monthly_mess",
  },
});

app.use(cors());
app.use(express.json());

//endpoint to search mess using pincode and return array containing messes found in db
app.get("/mess/:pin", (req, res) => {
  const { pin } = req.params;
  db.select(
    "id",
    "name",
    "email",
    "phone",
    "short_description",
    "address",
    "pincode",
    "city",
    "rating"
  )
    .from("mess")
    .where("pincode", "=", pin)
    .then((mess) => {
      if (mess.length) {
        res.json(mess);
      } else {
        res.json("Mess not found");
      }
    })
    .catch((err) => res.status(400).json("error getting mess"));
});
//endpoint to verify user for sign and return user details
app.post("/signin", (req, res) => {
  const profile = {};
  db.select("email", "password")
    .from("mess")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].password);
      if (isValid) {
        return db
          .select(
            "id",
            "name",
            "email",
            "phone",
            "short_description",
            "address",
            "pincode",
            "city",
            "rating"
          )
          .from("mess")
          .where("email", "=", req.body.email)
          .then((user) => {
            return res.json(user[0]);
          })
          .catch((err) => res.status(400).json("some error occurred"));
      } else {
        res.json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});
//endpoint to register new user and store it's information to database
app.post("/register", (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    short_description,
    address,
    pincode,
    city,
  } = req.body;
  const hash = bcrypt.hashSync(password);
  db("mess")
    .returning([
      "id",
      "name",
      "email",
      "phone",
      "short_description",
      "address",
      "pincode",
      "city",
      "rating",
    ])
    .insert({
      password: hash,
      email: email,
      name: name,
      phone: phone,
      short_description: short_description,
      address: address,
      pincode: pincode,
      city: city,
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      if (err.detail.includes("already exists")) {
        res.json("User already registered. Please Sign in");
      } else {
        res
          .status(400)
          .json("Some error occurred. Unable to register. Please try again.");
      }
    });
});

//endpoint to rate a mess
app.post("/rate/:id/:score", (req, res) => {
  let { id, score } = req.params;
  score = Number(score);
  let rating_f = 50;
  let no_of_rating_f = 0;
  db.select("no_of_rating", "rating")
    .from("mess")
    .where("id", "=", id)
    .then((mess) => {
      let { rating, no_of_rating } = mess[0];
      if (no_of_rating > 0)
        rating_f =
          Math.round(
            ((rating * no_of_rating + score) / (no_of_rating + 1)) * 100
          ) / 100;
      else rating_f = score;
      no_of_rating_f = no_of_rating + 1;
      db("mess")
        .where("id", "=", id)
        .update({
          rating: rating_f,
          no_of_rating: no_of_rating_f,
        })
        .then((user) => {
          res.json(rating_f);
        })
        .catch((err) => res.status(400).json("Error trying to rate"));
    })
    .catch((err) => res.status(400).json("error trying to rate"));
});
app.listen(3000, () => {
  console.log("App started successfully on port 3000");
});
