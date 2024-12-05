import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Genres = () => {
    // TODO: Restore this line & delete the temporal hard-coded 'genres' array below
    const [genres, setGenres] = useState([])
    const [error, setError] = useState(null)


    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")
        
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/genres`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.message);
                } else {
                    setGenres(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
            // notes: The [] at the end ensures useEffect only 
            //  runs once after the component mounts.
    }, [])
    


    if (error !== null) {
        return <div>Error: {error.message}</div>
    } else {   
        return(
            <div className="text-center">
                <h2>Genres</h2>
                <hr />
                <div className="list-group">
                    {genres.map((g) => (
                        <Link 
                            key={g.id}
                            className="list-group-item list-group-item-action"
                            to={`/genres/${g.id}`}
                            /* 
                                notes: below is how you pass props using React's Router DOM 
                                We're basically passing stuff down for other components to access.
                                Note that here we pass an object, and in there, u can pass as many things
                                as you want. We will access them in another component 'OneGenre'. The receiving
                                component/file will utilise it using React's useLocation hook it like so:

                                const location = useLocation();
                                const { genreName } = location.state;
                            */
                            state={
                                {
                                    genreName: g.genre,
                                }
                            }
                        >{g.genre}</Link>
                    ))}
                </div>
            </div>
        )
    }
}

export default Genres;