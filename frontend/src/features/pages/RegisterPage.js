import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { register } from "../../api/registerApi";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import { useLanguage } from "../../i18n/LanguageContext";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";

const RegisterPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const { translate } = useLanguage();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.firstname?.trim())
      tempErrors.firstname = translate("firstname_required");
    if (!formData.lastname?.trim())
      tempErrors.lastname = translate("lastname_required");

    if (!formData.username?.trim()) {
      tempErrors.username = translate("username_required");
    } else if (formData.username.trim().length < 3) {
      tempErrors.username = translate("username_length_invalid");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      tempErrors.email = translate("email_required");
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = translate("email_invalid");
    }

    if (!formData.password) {
      tempErrors.password = translate("password_required");
    } else if (formData.password.length < 6) {
      tempErrors.password = translate("password_length_invalid");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage({ type: "", text: "" });

    if (!validateForm()) return;

    try {
      const result = await register(formData);
      setServerMessage({
        type: "success",
        text: `${translate("user")} ${result.username || formData.username} ${translate("user_created_successfully")}`,
      });
      setNotificationOpen(true);
      setFormData({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        role: "USER",
      });
    } catch (error) {
      setServerMessage({
        type: "error",
        text: error.message || translate("registration_error"),
      });
      setNotificationOpen(true);
    }
  };

  const handleSidebarToggle = () => setSidebarOpen(!isSidebarOpen);
  const handleProfileClick = () => setProfileSidebarOpen(!isProfileSidebarOpen);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <ProfileSidebar
        open={isProfileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar
          onMenuClick={handleSidebarToggle}
          onProfileClick={handleProfileClick}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            p: { xs: 2, sm: 4 },
            overflowY: "auto",
            pt: { xs: "64px", sm: "70px" },
            mt: 4,
          }}
        >
          <Container maxWidth="xs">
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                mt: { xs: 2, sm: 4 },
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: 800, mb: 3, color: "primary.main" }}
              >
                {translate("create_account_title")}
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    label={translate("firstname_label")}
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={translate("lastname_label")}
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={translate("username_label")}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={translate("email_label")}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={translate("password_label")}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    select
                    name="role"
                    label={translate("user_role_label")}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                  </TextField>

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    sx={{
                      py: 1.2,
                      fontWeight: "bold",
                      mt: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {translate("create_account_button")}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Container>
        </Box>
      </Box>
      <ConfirmationNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        severity={serverMessage.type}
        message={serverMessage.text}
      />
    </Box>
  );
};

export default RegisterPage;
