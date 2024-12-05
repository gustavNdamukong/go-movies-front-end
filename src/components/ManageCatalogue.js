import { useState, useEffect } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";


const ManageCatalogue = () => {
    const [movies, setMovies] = useState([]);
    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return
        }
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        // pass in headers that the '/admin' routes need
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }
 
        fetch(`${process.env.REACT_APP_BACKEND}/admin/movies`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); 
                setMovies(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [jwtToken, navigate]);

    return(
        <div className="text-center">
            <h2>Manage Catalogue</h2>
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
                                <Link to={ `/admin/movies/${movie.id}`}>
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

export default ManageCatalogue;