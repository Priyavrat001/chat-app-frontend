import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React from 'react';
import { Navigate } from "react-router-dom";

const AdminLogin = () => {

    const admin = false;

    const secretKey = useInputValidation("");

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("submit")
    };
    if(admin) return <Navigate to="/admin/dashboard"/>

    return (
        <div
            style={{
                background: "linear-gradient(rgba(200, 200, 200, 0.5), rgba(120, 110, 220, 0.5))",
                width: "100%",
                height: "112vh",

            }}
        >
            <Container component={"main"} maxWidth="xs"
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "column",
                    alignItems: "center"
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <Typography variant='h5'>Login</Typography>
                    <form
                        style={{
                            width: "100%",
                            marginTop: "1rem"
                        }}

                        onSubmit={submitHandler}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            type='password'
                            margin='normal'
                            variant='outlined'
                            value={secretKey.value}
                            onChange={secretKey.changeHandler}
                        />
                        <Button
                            sx={{
                                marginTop: "1rem"
                            }}
                            fullWidth
                            variant='contained'
                            color='primary'
                            type='submit'
                        >
                            Login
                        </Button>

                    </form>


                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin