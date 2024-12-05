import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Alert from './components/Alert';


function App() {

  // we are doing authentication now & need a way to store auth secret strings
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const [tickInterval, setTickInterval] = useState();

  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
    .catch(error => {
      console.log("error logging out", error.message);
    })
    .finally(() => {
      // NOTES: this finally section of the fetch call will always be ran
      setJwtToken("");
      toggleRefresh(false);
    })

    navigate("/login");
  }

  /*
  const toggleRefresh = (status) => {
    console.log("REPLACING FOR REFRESH TOKEN");
  };
  */
 
  const toggleRefresh = useCallback((status) => {
    console.log("clicked");

    if (status) {
      console.log("Turning on ticking");

      const requestOptions = {
        method: "GET",
        credentials: "include",
      }

      let i = setInterval(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.log("user is not logged in");
        })
      }, 600000); // make it refresh every 10 minutes
      setTickInterval(i);
      console.log("Setting tickInterval to", i);
    } else {
      console.log("Turning off ticking");
      console.log("Turning off tickInterval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval]);
  
  


  useEffect(() => {
    // we need to refresh the jwt token whenever the page loads
    if (jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }
      fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error.message);
        })
    }
  }, [jwtToken, toggleRefresh])


  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go Watch a movie!</h1>
        </div>
        <div className="col text-end">
          {jwtToken === ""
            ? <Link to="/login">
              <span className="badge bg-success">Login</span>
            </Link>
            : <a href="#!" onClick={logOut} className='btn btn-danger btn-sm'><span className="badge badge-danger">Logout</span></a>
          }
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
          <div className="col-md-2">
            <nav>
              <div className="list-group">
                <Link to="/" className="list-group-item list-group-item-action">Home</Link>
                <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
                <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>

                { jwtToken !== "" && 
                  <>
                    <Link to="/admin/movies/0" className="list-group-item list-group-item-action">Add Movie</Link>
                    <Link to="/manage-catalogue" className="list-group-item list-group-item-action">Manage Catalogue</Link>
                    <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
                  </> 
                }
              </div>
            </nav>
          </div>

          <div className="col-md-10">
            <Alert message={alertMessage} className={alertClassName} />
            {/* 
              The way to pass data to components below this component is to use a context attribute 
              object. The way you tell which component is higher up than another, eg this App.js 
              component being higher than others, is from the Router. In our case, App.js is set in 
              the Router as the main or top element, while the other components are set as its children. 
            */}
            <Outlet context={{
              jwtToken, 
              setJwtToken, 
              setAlertClassName, 
              setAlertMessage, 
              toggleRefresh,
            }}/>
          </div>
      </div>
    </div>
  );
}

export default App;
