const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost:3002/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get movies

app.get("/movies/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      movie
    ORDER BY
      movie_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//get post api1

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
      movie (director_id, movie_name,lead_actor)
    VALUES
      (
        ${directorId},
       '${movieName}',
         '${leadActor}',
         
      );`;

  const dbResponse = await db.run(addMovieQuery);
  const movieId = dbResponse.lastId;

  response.send("Movie Successfully Added");
});

//get movie

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getBooksQuery = `
    SELECT
      *
    FROM
      movie
    WHERE 
      movie_id=${movieId};
   `;
  const booksArray = await db.get(getBooksQuery);
  response.send(booksArray);
});

//update api
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id=${directorId},
      movie_name= '${movieName}',
      lead_actor= '${leadActor}'
      
    WHERE
      movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated ");
});

//delete api

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  await db.run(deleteBookQuery);
  response.send("Movie removed");
});

//director

app.get("/directors/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      director
    ORDER BY
      director_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//director movie

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getAuthorBooksQuery = `
    SELECT
     movie_name
    FROM
     movie
    WHERE
      director_id = ${directorId};`;
  const booksArray = await db.all(getAuthorBooksQuery);
  response.send(booksArray);
});

module.exports = app;
