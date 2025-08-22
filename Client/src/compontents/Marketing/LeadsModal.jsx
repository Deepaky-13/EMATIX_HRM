import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import customFetch from "../../utils/customFetch"; // import customFetch

const LeadsModal = ({ open, handleClose, log }) => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    leadName: "",
    leadDesignation: "",
    leadContactNumber: "",
  });

  useEffect(() => {
    if (log) setLeads(log.leads || []);
  }, [log]);

  const handleAddLead = async () => {
    try {
      const res = await customFetch.post(
        `/marketing/${log._id}/leads`,
        newLead
      );
      setLeads(res.data.leads);
      setNewLead({
        leadName: "",
        leadDesignation: "",
        leadContactNumber: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      const res = await customFetch.delete(`/marketing/${log._id}/leads/${id}`);
      setLeads(res.data.leads);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Manage Leads for "{log?.names || log?.meetings}"
      </DialogTitle>
      <DialogContent>
        <List>
          {leads.map((lead) => (
            <ListItem
              key={lead._id}
              secondaryAction={
                <Button
                  color="error"
                  onClick={() => handleDeleteLead(lead._id)}
                >
                  Delete
                </Button>
              }
            >
              <ListItemText
                primary={`${lead.leadName} (${lead.leadDesignation})`}
                secondary={`Contact: ${lead.leadContactNumber} | By: ${
                  lead.User?.name || "Unknown"
                }`}
              />
            </ListItem>
          ))}
        </List>

        <TextField
          margin="dense"
          label="Lead Name"
          value={newLead.leadName}
          onChange={(e) => setNewLead({ ...newLead, leadName: e.target.value })}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Designation"
          value={newLead.leadDesignation}
          onChange={(e) =>
            setNewLead({ ...newLead, leadDesignation: e.target.value })
          }
          fullWidth
        />
        <TextField
          margin="dense"
          label="Contact Number"
          value={newLead.leadContactNumber}
          onChange={(e) =>
            setNewLead({ ...newLead, leadContactNumber: e.target.value })
          }
          fullWidth
        />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddLead}>
          + Add Lead
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadsModal;
