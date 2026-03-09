import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Box,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Person as PersonIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useThemeContext } from "../../theme/ThemeContext.js";

const ProfileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  const { currentLanguage, changeLanguage, translate, availableLanguages } =
    useLanguage();

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const getButtonStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      mb: 1,
      borderRadius: "12px",
      backgroundColor: isActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
      color: isActive ? theme.palette.primary.main : "text.primary",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        transform: "translateX(-5px)",
      },
      transition: "all 0.2s ease",
    };
  };

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "85%", sm: "340px" },
          height: isMobile ? "100vh" : "auto",
          maxHeight: isMobile ? "100vh" : "90vh",
          top: isMobile ? 0 : "5vh",
          right: isMobile ? 0 : "20px",
          borderRadius: isMobile ? 0 : "24px",
          bgcolor: "background.paper",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          border: "none",
          p: 1,
          mt: isMobile ? 0 : 2.5,
        },
      }}
    >
      <Toolbar
        sx={{
          mt: 2,
          mb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 4 }}>
          {translate("user_profile_sidebar")}
        </Typography>
      </Toolbar>

      <Divider sx={{ mx: 2, my: 2 }} />

      <List sx={{ px: 1 }}>
        <ListItemButton
          onClick={() => handleNavigate("/profile")}
          sx={getButtonStyle("/profile")}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={translate("account_settings_sidebar")} />
        </ListItemButton>

        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {isDarkMode ? (
                <LightModeIcon sx={{ color: "#ffb300" }} />
              ) : (
                <DarkModeIcon />
              )}
            </ListItemIcon>
            <Typography variant="body1">
              {translate("dark_mode_sidebar")}
            </Typography>
          </Box>
          <Switch checked={isDarkMode} onChange={toggleDarkMode} size="small" />
        </Box>

        <Box sx={{ px: 2, py: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-select-label">
              {translate("language_sidebar")}
            </InputLabel>
            <Select
              labelId="language-select-label"
              value={currentLanguage}
              label={translate("language_sidebar")}
              onChange={handleLanguageChange}
              startAdornment={
                <LanguageIcon
                  sx={{ mr: 1, color: "action.active", fontSize: 20 }}
                />
              }
              sx={{ borderRadius: "10px" }}
            >
              {availableLanguages.map((languageOption) => (
                <MenuItem key={languageOption.lang} value={languageOption.lang}>
                  {languageOption.lang === "ENG" &&
                    translate("english_language_sidebar")}
                  {languageOption.lang === "RO" &&
                    translate("romanian_language_sidebar")}
                  {languageOption.lang === "FR" &&
                    translate("french_language_sidebar")}
                  {languageOption.lang === "RU" &&
                    translate("russian_language_sidebar")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2, mx: 2 }} />

        <ListItemButton
          onClick={() => navigate("/logout")}
          sx={{
            borderRadius: "12px",
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={translate("sign_out_sidebar")} />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default ProfileSidebar;
