import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const handleOpenDetails = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <Paper
      onClick={handleOpenDetails}
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",

        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
          borderColor: "primary.main",
        },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {ticket.title}
      </Typography>
    </Paper>
  );
};

export default TicketCard;
