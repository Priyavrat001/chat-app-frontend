import { useInputValidation } from "6pp";
import {
  AdminPanelSettingsRounded as AdminIcon,
  ArrowForwardRounded as ArrowIcon,
  AutoAwesomeRounded as SparkleIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {

  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);


  useEffect(() => {
    if (!isAdmin) return navigate("/admin");

    if (isAdmin) return navigate("/admin/dashboard");
  }, [isAdmin, navigate])


  return (
    <Stack
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        background:
          "radial-gradient(ellipse at 12% 15%, rgba(129,140,248,.42), transparent 34%), radial-gradient(ellipse at 88% 90%, rgba(34,211,238,.16), transparent 30%), #101426",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "linear-gradient(to bottom, black, transparent 80%)",
        },
      }}
    >
      <Container
        component={"main"}
        maxWidth="md"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            width: "100%",
            maxWidth: 880,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.16)",
            borderRadius: { xs: 4, sm: 6 },
            bgcolor: "#fff",
            boxShadow: "0 32px 100px rgba(0,0,0,.35)",
          }}
        >
          <Stack
            justifyContent="space-between"
            sx={{
              minHeight: { xs: 220, md: 500 },
              p: { xs: 3, sm: 5 },
              color: "#fff",
              background:
                "radial-gradient(circle at 80% 20%, rgba(165,180,252,.25), transparent 34%), linear-gradient(145deg, #3730a3, #171a35 72%)",
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <AdminIcon sx={{ color: "#c7d2fe", fontSize: 30 }} />
              <Typography variant="subtitle1" fontWeight={800} letterSpacing={0.3}>
                CHATTER
              </Typography>
            </Stack>
            <Box>
              <SparkleIcon sx={{ color: "#c7d2fe", fontSize: 28, mb: 1 }} />
              <Typography
                variant="h3"
                fontWeight={800}
                letterSpacing={-1.4}
                sx={{ fontSize: { xs: 30, sm: 40 } }}
              >
                A clearer view of your community.
              </Typography>
              <Typography
                sx={{ mt: 2, maxWidth: 330, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}
              >
                Sign in to access your workspace insights and administration tools.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,.48)" }}>
              SECURE WORKSPACE ACCESS
            </Typography>
          </Stack>

          <Stack
            justifyContent="center"
            sx={{ p: { xs: 3, sm: 5, md: 6 }, minWidth: 0 }}
          >
            <Typography variant="overline" sx={{ color: "#6258e8", fontWeight: 800, letterSpacing: 1.5 }}>
              ADMINISTRATOR
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              letterSpacing={-1}
              sx={{ mt: 0.5, color: "#202238", fontSize: { xs: 28, sm: 34 } }}
            >
              Welcome back
            </Typography>
            <Typography sx={{ mt: 1, mb: 3.5, color: "#777b8e" }}>
              Enter your secret key to continue.
            </Typography>
            <form onSubmit={submitHandler}>
              <TextField
                required
                fullWidth
                label="Secret key"
                type="password"
                autoComplete="current-password"
                margin="normal"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#f8f9fc",
                  },
                }}
              />
              <Button
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  bgcolor: "#5146d8",
                  boxShadow: "0 8px 18px rgba(81,70,216,.23)",
                  "&:hover": { bgcolor: "#4338ca", boxShadow: "0 10px 22px rgba(81,70,216,.3)" },
                }}
                variant="contained"
                type="submit"
                fullWidth
                endIcon={<ArrowIcon />}
              >
                Continue to dashboard
              </Button>
            </form>
            <Typography variant="caption" sx={{ mt: 3, color: "#a0a2b0", textAlign: "center" }}>
              Authorized administrators only
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Stack>
  );
}

export default AdminLogin