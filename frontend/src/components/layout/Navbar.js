import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useLanguage } from "../../i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { searchTickets } from "../../api/ticketApi";
import HistoryIcon from "@mui/icons-material/History";

const Navbar = ({ onMenuClick, onProfileClick }) => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const savedRecents =
      JSON.parse(localStorage.getItem("recentTickets")) || [];
    setRecentTickets(savedRecents);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 0) {
        const data = await searchTickets(searchTerm);
        setResults(data);
        setShowDropdown(true);
      } else if (searchTerm.length === 0) {
        setResults([]);
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectTicket = (ticket) => {
    const updatedRecents = [
      ticket,
      ...recentTickets.filter((t) => t.id !== ticket.id),
    ].slice(0, 5);

    setRecentTickets(updatedRecents);
    localStorage.setItem("recentTickets", JSON.stringify(updatedRecents));

    setSearchTerm("");
    setShowDropdown(false);
    navigate(`/tickets/${ticket.id}`);
  };

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

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <TextField
            size="small"
            value={searchTerm}
            placeholder={translate("search_navbar")}
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
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

          {showDropdown &&
            (searchTerm.length > 0 || recentTickets.length > 0) && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "100%",
                  mt: 1,
                  width: { xs: "100%", sm: "80%", md: 500 },
                  maxHeight: 350,
                  overflowY: "auto",
                  zIndex: 1000,
                  borderRadius: 2,
                  boxShadow: 3,
                  py: 1,
                }}
              >
                {searchTerm.length > 0 ? (
                  results.length > 0 ? (
                    results.map((ticket) => (
                      <MenuItem
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        sx={{
                          py: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{ticket.id} • {ticket.status}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ justifyContent: "center", py: 2 }}>
                      <Typography color="text.secondary">
                        {translate("no_tickets_found")}
                      </Typography>
                    </MenuItem>
                  )
                ) : (
                  recentTickets.length > 0 && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 1,
                          color: "text.secondary",
                          fontWeight: "bold",
                        }}
                      >
                        {translate("recent_search_title").toUpperCase()}
                      </Typography>
                      {recentTickets.map((ticket) => (
                        <MenuItem
                          key={`recent-${ticket.id}`}
                          onClick={() => handleSelectTicket(ticket)}
                          sx={{
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <HistoryIcon fontSize="small" color="action" />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {ticket.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              #{ticket.id}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </>
                  )
                )}
              </Paper>
            )}
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
