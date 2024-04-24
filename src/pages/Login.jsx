import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisualyHiddenInput } from '../components/styles/StyledComponents';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';
import { userNameValidators } from '../utils/validators';


const Login = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const name = useInputValidation("");
    const username = useInputValidation("", userNameValidators);
    const password = useInputValidation();
    const bio = useInputValidation("");
    const avatar = useFileHandler("single");

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Loging in...")

        setIsLoading(true);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        };

        try {
            const { data } = await axios.post(`${server}/user/login`, {
                username: username.value,
                password: password.value

            },
                config
            );

            dispatch(userExists(data.user));

            toast.success(data.message, {
                id: toastId
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: toastId
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Regestering...");

        setIsLoading(true);

        const formData = new FormData();

        formData.append("avatar", avatar.file);
        formData.append("name", name.value);
        formData.append("username", username.value);
        formData.append("password", password.value);
        formData.append("bio", bio.value);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        try {
            const { data } = await axios.post(`${server}/user/new`, formData, config)

            dispatch(userExists(data.user));

            toast.success(data.message, {
                id: toastId
            });

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: toastId
            });
        } finally {
            setIsLoading(false);
        }
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
                                        label="username"
                                        margin='normal'
                                        variant='outlined'
                                        value={username.value}
                                        onChange={username.changeHandler}
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        label="username"
                                        margin='normal'
                                        variant='outlined'
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    {
                                        username.error && (
                                            <Typography color={"error"}
                                                variant='caption'>
                                                {username.error}
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