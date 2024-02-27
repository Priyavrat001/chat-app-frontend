import React, { useState } from 'react'
import { Container, Paper, Typography, TextField, Button, Stack, Avatar, IconButton } from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisualyHiddenInput } from '../components/styles/StyledComponents';
import { useInputValidation, useFileHandler } from "6pp";
import { userNameValidators } from '../utils/validators';

const Login = () => {

    const [isLogin, setIsLogin] = useState(true);

    const name = useInputValidation("");
    const userName = useInputValidation("", userNameValidators);
    const password = useInputValidation();
    const bio = useInputValidation("");
    const avatar = useFileHandler("single");

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("loginForm submited")
    }
    const handleRegisterSubmit = (e) => {
        e.preventDefault()
        console.log("registerForm submited")
    }
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

                    {
                        isLogin ?
                            (<>
                                <Typography variant='h5'>Login</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem"
                                    }}

                                    onSubmit={handleLoginSubmit}
                                >
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin='normal'
                                        variant='outlined'
                                        value={userName.value}
                                        onChange={userName.changeHandler}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type='password'
                                        margin='normal'
                                        variant='outlined'
                                        value={password.value}
                                        onChange={password.changeHandler}
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
                                    <Typography sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "1rem"
                                    }}>Or</Typography>
                                    <Button
                                        sx={{
                                            marginTop: "1rem"
                                        }}
                                        fullWidth
                                        variant='text'
                                        onClick={toggleLogin}
                                    >
                                        Register
                                    </Button>
                                </form>
                            </>)
                            :
                            (<>
                                <Typography variant='h5'
                                    sx={{
                                        marginTop: "3rem"
                                    }}
                                >Register</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                        height: "100vh",

                                    }}

                                    onSubmit={handleRegisterSubmit}
                                >
                                    <Stack
                                        position={"relative"}
                                        width={"10rem"}
                                        margin={"auto"}
                                    >
                                        <Avatar
                                            sx={{
                                                width: "10rem",
                                                height: "10rem",
                                                objectFit: "contain"
                                            }}
                                            src={avatar.preview}
                                        />

                                        {
                                            avatar.error && (
                                                <Typography color={"error"}
                                                    variant='caption'>
                                                    {avatar.error}
                                                </Typography>
                                            )
                                        }

                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                button: "0",
                                                right: "0",
                                                bgColor: "rgba(255,255,255,0.5)"
                                            }}
                                            component="label"
                                        >
                                            <>
                                                <CameraAltIcon />
                                                <VisualyHiddenInput type='file' onChange={avatar.changeHandler} />
                                            </>
                                        </IconButton>
                                    </Stack>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Name"
                                        margin='normal'
                                        variant='outlined'
                                        value={name.value}
                                        onChange={name.changeHandler}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Bio"
                                        margin='normal'
                                        variant='outlined'
                                        value={bio.value}
                                        onChange={bio.changeHandler}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin='normal'
                                        variant='outlined'
                                        value={userName.value}
                                        onChange={userName.changeHandler}
                                    />

                                    {
                                        userName.error && (
                                            <Typography color={"error"}
                                                variant='caption'>
                                                {userName.error}
                                            </Typography>
                                        )
                                    }

                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type='password'
                                        margin='normal'
                                        variant='outlined'
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />
                                    {/* {
                                    password.error && (
                                        <Typography color={"error"}
                                        variant='caption'>
                                            {password.error}
                                        </Typography>
                                    )
                                } */}
                                    <Button
                                        sx={{
                                            marginTop: "1rem"
                                        }}
                                        fullWidth
                                        variant='contained'
                                        color='primary'
                                        type='submit'
                                    >
                                        Register
                                    </Button>
                                    <Typography sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "1rem"
                                    }}>Or</Typography>
                                    <Button
                                        sx={{
                                            marginTop: "1rem"
                                        }}
                                        fullWidth
                                        variant='text'
                                        onClick={toggleLogin}
                                    >
                                        Login
                                    </Button>
                                </form>
                            </>)

                    }

                </Paper>
            </Container>
        </div>
    )
}

export default Login