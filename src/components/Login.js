import { useState } from "react";
import Input from "./form/Input";
import { useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // receive values from the context (passed in from the top component App.js)
    const { setJwtToken } = useOutletContext();
    const { setAlertClassName } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    const { toggleRefresh } = useOutletContext();

    // we need a hook to redirect the user to another page when they login successfully
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // build the request payload
        let payload = {
            email: email,
            password: password,
        }

        /* 
            NOTES: For cookies to be sent and received in cross-origin requests, 
            you need to set credentials: 'include' in your fetch request options.
        */
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }

        fetch(`${process.env.REACT_APP_BACKEND}/authenticate`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    //set token to token from backend so we can use to track login authentication
                    // for this we'll use something known as outlet context
                    // we need to give this Login component access to the jwtToken string available in App.js
                    // NOTES: By using setJwtToken() we are setting the JWT token from the backen server in a var. This is the only 
                    //  safe place currently coz people found ways to get from the localstorage & cookies when it used to be stored
                    //  in these ways. The only issue now is, the JWT lifetime was set by us to 15 minutes, which will be annoying
                    //  for users to have to log in that often. The fix for that is the reason we also sent back a refresh token 
                    // as an http cookie from the backend. 
                    setJwtToken(data.access_token)
                    setAlertClassName("d-none")
                    setAlertMessage("");
                    toggleRefresh(true)
                    // send the user back to the home page
                    navigate("/")
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage(error.message || "An unexpected error occurred"); 
            })
    }

    return(
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />

            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="Email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password-new"
                    onChange={(event) => setPassword(event.target.value)}
                />

                <hr />

                <input 
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />
            </form>
        </div>
    )
}

export default Login;