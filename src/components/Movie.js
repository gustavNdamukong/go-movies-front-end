import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({});

    // we need to get the movie id from the URL, & to do that, we 
    // use the built-in react hook, useParams()
    let { id } = useParams();

    // lets simulate calling a backend
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }
        fetch(`${process.env.REACT_APP_BACKEND}/movies/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMovie(data);
            })
            .catch(err => {
                console.log("Error getting movie: ", err);
            })
    }, [id])

    if (movie.genres) {
        //NOTES: Object.values() converts an object into an array
        movie.genres = Object.values(movie.genres);
    } else {
        // the movie has no genres, so set to blank array to avoid errors
        movie.genres = [];
    }

    return(
        <div className="text-center">
            <h2>Movie: {movie.Title}</h2>
            <small><em>{new Date(movie.release_date).toLocaleDateString()}, {movie.runtime} minutes, Rated: {movie.mpaa_rating}</em></small><br />
            {movie.genres.map((g) => (
                <span key={g.genre} className="badge bg-secondary me-2">{g.genre}</span>
            ))}
            <hr />

            {movie.Image !== "" &&
                <div className="mb-3">
                    <img src={`https://image.tmdb.org/t/p/w200/${movie.image}`} alt="poster" />
                </div>
            }
            <p>{movie.description}</p>
        </div>
    )
}

export default Movie;