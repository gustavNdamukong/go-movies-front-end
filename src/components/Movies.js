import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Movies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/movies`, requestOptions) 
            .then((response) => response.json())
            .then((data) => {
                console.log(data); 
                setMovies(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);


    return(
        <div className="text-center">
            <h2>Movies</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>
                                <Link to={ `/movies/${movie.id}`}>
                                    {movie.Title}
                                </Link>
                            </td>
                            <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                            <td>{movie.mpaa_rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Movies;