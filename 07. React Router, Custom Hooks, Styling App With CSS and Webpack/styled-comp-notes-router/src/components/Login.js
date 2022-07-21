import React from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const Login = (props) => {
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        props.onLogin("jdoe");
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <TextField label="Username" />
                </div>
                <div>
                    <TextField label="Password" type="password" />
                </div>
                <div>
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
