import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.button`
    background: Bisque;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid Chocolate;
    border-radius: 3px;
`;

const Input = styled.input`
    margin: 0.25em;
`;

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
                    Username:
                    <Input />
                </div>
                <div>
                    Password:
                    <Input />
                </div>
                <div>
                    <Button type="submit" primary="">Login</Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
