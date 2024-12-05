import { Link } from 'react-router-dom';
import Movie1 from './../images/movie1.png';

const Home = () => {
    return(
        <>
            <div className="text-center">
                <h2>Find a movie to watch tonight</h2>
                <hr />
                <Link to="/movies">
                    <img src={Movie1} alt="movie tickets" width="400" height="300"></img>
                </Link>
            </div>
        </>
    )
}

export default Home;