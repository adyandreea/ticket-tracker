import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import TicketCard from "../../components/ticket/TicketCard";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import {
  getTicketsByBoardId,
  updateTicket,
  createTicket,
} from "../../api/ticketApi";
import { useLanguage } from "../../i18n/LanguageContext";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";

const BoardCard = ({ selectedBoardId }) => {
  const columns = ["TODO", "IN_PROGRESS", "DONE"];
  const statusMap = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
  };

  const columnConfig = {
    TODO: { label: "to_do_column_dashboard", color: "#1976d2" },
    IN_PROGRESS: { label: "in_progress_column_dashboard", color: "#ed6c02" },
    DONE: { label: "done_column_dashboard", color: "#2e7d32" },
  };

  const [tickets, setTickets] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  const [error, setError] = useState(null);
  const { translate } = useLanguage();
  const [serverMessage, setServerMessage] = useState({
    type: "success",
    text: "",
  });
  const [notificationOpen, setNotificationOpen] = useState(false);

  const triggerNotification = (type, text) => {
    setServerMessage({ type, text });
    setNotificationOpen(true);
  };

  useEffect(() => {
    const reverseStatusMap = {
      TODO: "TODO",
      IN_PROGRESS: "IN_PROGRESS",
      DONE: "DONE",
    };

    const fetchTickets = async () => {
      if (!selectedBoardId) {
        setTickets({ TODO: [], IN_PROGRESS: [], DONE: [] });
        return;
      }
      setError(null);

      try {
        const data = await getTicketsByBoardId(selectedBoardId);
        const groupedTickets = { TODO: [], IN_PROGRESS: [], DONE: [] };

        data.forEach((ticket) => {
          const columnName = reverseStatusMap[ticket.status];
          if (columnName) {
            groupedTickets[columnName].push(ticket);
          }
        });

        setTickets(groupedTickets);
      } catch (err) {
        setError(translate("ticket_not_found"));
        console.error("Error loading tickets:", err);
      }
    };
    fetchTickets();
  }, [selectedBoardId, translate]);

  const [editingText, setEditingText] = useState("");

  const [isAdding, setIsAdding] = useState({
    TODO: false,
    IN_PROGRESS: false,
    DONE: false,
  });

  const [newCardText, setNewCardText] = useState({
    TODO: "",
    IN_PROGRESS: "",
    DONE: "",
  });

  const [draggedTicket, setDraggedTicket] = useState(null);
  const [draggedFromCol, setDraggedFromCol] = useState(null);

  const handleAddClick = (col) => {
    setIsAdding({ ...isAdding, [col]: true });
  };

  const handleSaveClick = (col) => {
    if (newCardText[col].trim() !== "") {
      const newTicketData = {
        title: newCardText[col],
        description: "",
        position: tickets[col].length,
        status: statusMap[col],
        boardId: selectedBoardId,
      };

      createTicket(newTicketData)
        .then((createdTicket) => {
          const ticketId = createdTicket.id;
          const completeTicket = {
            ...createdTicket,
            ...newTicketData,
            id: ticketId,
          };
          setTickets((prevTickets) => ({
            ...prevTickets,
            [col]: [...prevTickets[col], completeTicket],
          }));
          setServerMessage({
            type: "success",
            text: translate("ticket_created_successfully"),
          });
          setNotificationOpen(true);
        })
        .catch((err) => {
          console.error("Failed to create ticket:", err);
          setError(translate("create_ticket_error"));
        });
    }
    setNewCardText({ ...newCardText, [col]: "" });
    setIsAdding({ ...isAdding, [col]: false });
  };

  const handleDragStart = (ticket, col) => {
    setDraggedTicket(ticket);
    setDraggedFromCol(col);
  };

  const handleDrop = (col) => {
    if (!draggedTicket) return;

    if (col === draggedFromCol) {
      setDraggedTicket(null);
      setDraggedFromCol(null);
      return;
    }

    const newStatusJava = statusMap[col];
    const destTickets = [...tickets[col]];
    const newPosition = destTickets.length;

    const ticketToUpdate = {
      ...draggedTicket,
      boardId: selectedBoardId,
      status: newStatusJava,
      position: newPosition,
    };

    const sourceTickets = tickets[draggedFromCol].filter(
      (t) => t.id !== draggedTicket.id,
    );

    const updatedDestTickets = [...destTickets, ticketToUpdate];

    setTickets((prevTickets) => ({
      ...prevTickets,
      [draggedFromCol]: sourceTickets,
      [col]: updatedDestTickets,
    }));

    updateTicket(draggedTicket.id, ticketToUpdate)
      .then((response) => {
        console.log(
          `Ticket ${draggedTicket.id} updated successfully with status ${newStatusJava}`,
        );
      })
      .catch((error) => {
        console.error(
          "Failed to update status in DB. Rolling back local changes.",
          error,
        );

        setTickets((prevTickets) => {
          const revertedSourceTickets = [...sourceTickets, draggedTicket];
          const revertedDestTickets = updatedDestTickets.filter(
            (t) => t.id !== draggedTicket.id,
          );

          return {
            ...prevTickets,
            [draggedFromCol]: revertedSourceTickets,
            [col]: revertedDestTickets,
          };
        });
        setError(translate("move_ticket_error"));
      });

    setDraggedTicket(null);
    setDraggedFromCol(null);
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        flexGrow: 1,
        height: "100%",
      }}
    >
      {columns.map((col) => (
        <Paper
          key={col}
          sx={{
            minWidth: { xs: "280px", sm: "300px", md: "1fr" },
            flex: { xs: "0 0 auto", md: 1 },
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: "1",
            borderColor: "divider",
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(col)}
        >
          <Box
            sx={{
              p: 2,
              borderTop: `4px solid ${columnConfig[col].color}`,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: columnConfig[col].color,
              }}
            >
              {translate(columnConfig[col].label)}
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "divider",
                borderRadius: "10px",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "text.disabled",
                },
              },
            }}
          >
            {tickets[col].map((ticket) => (
              <Box
                key={ticket.id}
                draggable
                onDragStart={() => handleDragStart(ticket, col)}
              >
                <TicketCard
                  ticket={ticket}
                  onEditChange={(e) => setEditingText(e.target.value)}
                  editingText={editingText}
                  tickets={tickets}
                  setTickets={setTickets}
                  setError={setError}
                  onNotify={triggerNotification}
                />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "transparent",
            }}
          >
            {isAdding[col] ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  value={newCardText[col]}
                  onChange={(e) =>
                    setNewCardText({ ...newCardText, [col]: e.target.value })
                  }
                  size="small"
                  autoFocus
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveClick(col);
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleSaveClick(col)}
                >
                  <CheckIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddClick(col)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                {translate("add_card_dashboard")}
              </Button>
            )}
          </Box>
        </Paper>
      ))}

      <ConfirmationNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        severity={serverMessage.type}
        message={serverMessage.text}
      />
    </Box>
  );
};

export default BoardCard;
