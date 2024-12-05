import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";


const OneGenre = () => {
    // we need to get the prop passed to this component
    const location = useLocation();
    const { genreName } = location.state;

    // set stateful variables
    const [movies, setMovies] = useState([]);

    // get the id from the url
    let { id } = useParams();

    // use useEffect to get list of movies
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")
        
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/movies/genres/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.message);
                } else {
                    setMovies(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [id])

    // return jsx

    


    /*if (error !== null) {
        return <div>Error: {error.message}</div>
    } else {   */
    return(
        <>
        <div className="text-center">
            <h2>Genre: {genreName}</h2>
            <hr />

            {movies ? (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((m) => (
                        <tr key={m.id}>
                            <td>
                                <Link to={`/movies/${m.id}`}>
                                    {m.Title}
                                </Link>
                            </td>
                            <td>{m.release_date}</td>
                            <td>{m.mpaa_rating}</td>
                        </tr>
                    ))}
                </tbody>
                
            </table>

            ) : (
                <p>There are no movies in this genre</p>
            )}

        </div>
        </>
    )
}

export default OneGenre;