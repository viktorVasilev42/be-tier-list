"use client"
import { Alert, Button, Collapse, IconButton, Paper, TextField } from '@mui/material';
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../layout';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [warnColOpen, setWarnColOpen] = useState(false);
    const {authToken, setAuthToken} = useContext(AuthContext);

    const handleLogin = async () => {
        const res = await axios.post("http://localhost:8080/auth/login", {
            username: `${emailValue}`,
            password: `${passwordValue}`
        })
        .catch((e) => {})

        if (res == undefined || res.status != 200) {
            setWarnColOpen(true);
            return;
        }

        setAuthToken(res.data.jwt);
        router.push("/");
    }

    return (
        <div>
            <Paper elevation={3} style={{ width: "40vw", padding: "5vh" }}>
                <div style={{ display: "flex", justifyContent: "center", height: "8vh" }}>
                    <LockPersonTwoToneIcon fontSize='large' />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2vh", alignItems: "center" }}>
                    <TextField
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        required
                        label="email"
                        variant="outlined"
                        sx={{ width: "25vw" }}
                    />
                    <TextField
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        sx={{ width: "25vw" }}
                    />
                    <div style={{ width: "25vw", display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" sx={{ float: "right" }} onClick={handleLogin}>Log in</Button>
                    </div>
                    <Collapse in={warnColOpen}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => setWarnColOpen(false)}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            Invalid login!
                        </Alert>
                    </Collapse>
                </div>
            </Paper>
        </div>
    )
}