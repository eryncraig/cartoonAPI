# Project: Movie Database and API
This project was created to better understand how to use Javascript in combination with data and a database, as well as understanding the logic and how to create, read, update, and delete. It primarily uses Javascript as the base language. There are several dependencies as well, libraries for working with non-relational databases. It required understanding of JSON file syntax, as well as knowing the difference between other file types such as XML. It uses the MERN stack, with the frontend stored in a separate project.

## My Role
I created the database, logic, and schema myself, based on a simple movie database concept. This was completed using the CLI and NodeJS. I also used Express as the framework to make the process simpler, not having to deal with writing boilerplate for server requests. This was in combination with NodeJS as the environment for the project. I also use the cors library for cross-origin security, plus morgan, mongoose and body-parser to access the correct stream source and parse for the browser.
Once the data was created, I then created the endpoints and logic to retrieve the data, contained in the index.js file, and combined with the model schema in the models.js file, as well as some JWToken and passport files.
If I were to make any changes to this project, I would have directors and actors in separate collections as well so that I could refer to their IDs within the movie data collection. I would also add some extra features to the user side, other data fields such as a bio. As it is now, this is simply a personal project meant to display my work with non-relational databases and the technology that is commonly used with them.

### Endpoints
`/users`
- This endpoint requires authorization and uses a JSON-based web token to verify authorized users. 
- This endpoint is primarily for use in the backend, reading, creating, or updating users manually, but also serves as the base for users to access their own information
- Uses GET

`/users/:username`
- The endpoint for a user to access their information. The username is the key identifier for which document to access. 
- Authorization is required here as well - only a logged in user can view their information
- Also allows a user to delete their account permanently
- Uses GET, DELETE and PATCH

`/users/:username/movies/:movieID`
- This endpoint allows users to access their list of favorite movies. 
- This will access an array of movie IDs that are tied to each movie in the movie collection, and pull that movie's information from the movie collection. The frontend allows them to be displayed to a user.
- This endpoint also allows users to add or remove a favorite from their list
- Uses PATCH and DELETE

`/movies`
- The endpoint to retrieve all the movies and their information from the database. Only certain parts are pulled by the frontend, but all data is available at this endpoint on the movies
- Uses GET

`/movies/:title`
- This endpoint retrieves information about a specific movie to the user. In my API, the title is the variable, but this will pull all details about that specific movie. My frontend displays selective pieces of data.
- Uses GET

`/movies/genre/:genreName`
- Similar to title, this give users information about a specific genre, and can also supply movies under that genre.
- Uses GET

`/movies/director/:directorName`
- Lastly, this endpoint is used to get information about a specific director, including what movies they made. This logic could also be reapplied to a list of actors and their individual information. Currently, the director information is embedded in the backend documents, but I plan on moving it to a referential collection in the future.
- Uses GET

### To Run Locally:
Make sure to install the necessary dependencies, listed in the package.json file. You can install them if you enter the project root and use `npm install`. Once installed, you can run the project using `node index.js`. If you have any trouble with access, check the cors settings in the index.js file and make sure your localhost is allowed.