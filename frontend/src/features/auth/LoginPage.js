import { useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

const LoginPage = () => {
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const { translate } = useLanguage();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const data = new FormData(event.currentTarget);
    const username = data.get("username").toString() || "";
    const password = data.get("password").toString() || "";

    const validation = { username: "", password: "" };

    if (!username) {
      validation.username = translate("enter_username_login");
    }

    if (!password) {
      validation.password = translate("enter_password_login");
    }

    setErrors(validation);

    const hasErrors = validation.username !== "" || validation.password !== "";
    if (hasErrors) {
      return;
    }

    try {
      const response = await login(username, password);
      console.log(response);
      console.log("Login successful", response.data);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      if (
        err.status === 401 ||
        err.statusCode === 401 ||
        err.message === "Unauthorized"
      ) {
        setServerError(translate("invalid_credentials_login"));
      } else {
        setServerError(translate("server_error_login"));
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        padding: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ p: 0 }}>
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "secondary.main",
              marginBottom: 1,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="text.primary">
            {translate("sign_in_login")}
          </Typography>
          {serverError && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {serverError}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              name="username"
              label={translate("enter_username_login")}
              fullWidth
              required
              autoFocus
              error={errors.username !== ""}
              helperText={errors.username}
              sx={{ mb: 2 }}
            />
            <TextField
              name="password"
              label={translate("enter_password_login")}
              fullWidth
              required
              error={errors.password !== ""}
              helperText={errors.password}
              type="password"
              sx={{ mb: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              {translate("sign_in_login")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
