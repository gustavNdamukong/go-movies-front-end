import { useEffect, useState } from "react";
import Input from "./form/Input";
import { Link } from "react-router-dom";



const GraphQL = () => {
    // setup stateful variables
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // allow ability to keep full (original) movie list separate from search results list
    const [fullList, setFullList] = useState([]);

    // perform search
    const performSearch = () => {
        const payload = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`;

        // Note that this time the content type of the request is "application/graphql" & not "application/json"
        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: payload,
        }

        // here we get the action field 'search' from the grapgql object data returned from backend
        fetch(`${process.env.REACT_APP_BACKEND}/graph`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                let theList = Object.values(response.data.search);
                setMovies(theList);
            })
            .catch(err => { console.log(err)})
    }

    const handleChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        setSearchTerm(value);

        //check if they typed at least 3 xters
        if (value.length > 2) {
            performSearch();
        } else {
            setMovies(fullList);
        }
    }

    // useEffect
    useEffect(() => {
        // make a request for only the fields you want
        const payload = `
        {
            list {
                id
                title
                runtime 
                release_date
                mpaa_rating
            }
        }`;

        const headers = new Headers();
        // Note that this time the content type of the request is "application/graphql" & not "application/json"
        headers.append("Content-Type", "application/graphql");

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: payload,
        }

        // here we get the action field 'list' from the grapgql object data returned from backend
        fetch(`${process.env.REACT_APP_BACKEND}/graph`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                let theList = Object.values(response.data.list);
                setMovies(theList);
                setFullList(theList);
            })
            .catch(err => { console.log(err)})
    }, [])

    return(
        <div className="text-center">
            <h2>GraphQL</h2>
            <hr />

            <form onSubmit={handleChange}>
                <Input 
                    title={"Search"}
                    type={"search"}
                    name={"search"}
                    className={"form-control"}
                    value={searchTerm}
                    onChange={handleChange}
                />
            </form>

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
                                        {m.title}
                                    </Link>
                                </td>
                                <td>{new Date(m.release_date).toLocaleDateString()}</td>
                                <td>{m.mpaa_rating}</td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>
            ) : (
                <p>No movies (yet)! </p>
            )}
        </div>
    )
}

export default GraphQL;