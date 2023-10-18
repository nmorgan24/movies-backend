////////////////////////////
// IMPORT OUR DEPENDENCIES
////////////////////////////
// read our .env file and create environmental variables
require("dotenv").config();
// pull PORT from .env, give default value
// const PORT = process.env.PORT || 8000
// const DATABASE_URL = process.env.DATABASE_URL
const { PORT = 8000, DATABASE_URL } = process.env
// import express
const express = require("express");
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import cors
const cors = require("cors")
// import morgan
const morgan = require("morgan")


///////////////////////////
// DATABASE CONNECTION
///////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL)

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))


////////////////////////////
// Models
////////////////////////////
// models = PascalCase, singular "Movie"
// collections, tables =snake_case, plural "movies"

const movieSchema = new mongoose.Schema({
    image: String,
    name: String,
    author: String,
    released: String
})

const Movie = mongoose.model("People", movieSchema)


//////////////////////////////
// Middleware
//////////////////////////////
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

////////////////////////////
// ROUTES
////////////////////////////

// INDEX - GET - /movie - gets all movie
app.get("/movie", async (req, res) => {
    try {
      // fetch all movie from database
      const movie = await Movie.find({});
      // send json of all movie
      res.json(movie);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });

  // CREATE - POST - /movie - create a new movie
app.post("/movie", async (req, res) => {
    try {
        // create the new movie
        const Movie = await Movie.create(req.body)
        // send newly created movies as JSON
        res.json(Movie)
    }
    catch(error){
        res.status(400).json({ error })
    }
})

// SHOW - GET - /movie/:id - get a single movie
app.get("/movie/:id", async (req, res) => {
    try {
      // get a movie from the database
      const Movie = await Movie.findById(req.params.id);
      // return the movie as json
      res.json(Movie);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // UPDATE - PUT - /movie/:id - update a single movie
app.put("/movie/:id", async (req, res) => {
    try {
      // update the movie
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated movie as json
      res.json(movie);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // DESTROY - DELETE - /movie/:id - delete a single movie
app.delete("/movie/:id", async (req, res) => {
    try {
        // delete the movie
        const movie = await Movie.findByIdAndDelete(req.params.id)
        // send deleted movie as json
        res.status(204).json(movie)
    } catch(error){
        res.status(400).json({error})
    }
})


// create a test route
app.get("/", (req, res) => {
    res.json({hello: "world"})
})

////////////////////////////
// LISTENER
////////////////////////////
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))