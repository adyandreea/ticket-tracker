import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useLanguage } from "../../i18n/LanguageContext";

const Navbar = ({ onMenuClick, onProfileClick }) => {
  const { translate } = useLanguage();
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        backdropFilter: "blur(10px)",
        width: "100%",
        borderBottom: "1",
        borderColor: "divider",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 1, sm: 3 },
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{
            mr: 1,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <TextField
            size="small"
            placeholder={translate("search_navbar")}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: "80%", md: 500 },
              maxWidth: "700px",
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover": {
                  bgcolor: "background.paper",
                  opacity: 0.9,
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused": {
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  "& fieldset": {
                    borderColor: "primary.light",
                    borderWidth: "2px",
                  },
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onProfileClick}
            sx={{
              mr: 1,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
