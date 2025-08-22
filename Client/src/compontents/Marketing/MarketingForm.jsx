import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import customFetch from "../../utils/customFetch"; // import customFetch

const MarketingForm = ({ open, handleClose, editData }) => {
  const [form, setForm] = useState({
    date: "",
    intime: "",
    meetings: "",
    names: "",
    startKM: "",
    officeOutTime: "",
    siteReachedTime: "",
    siteDetails: "",
    siteOutTime: "",
    officeReachedTime: "",
    endingKM: "",
    verifyAuthority: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date ? editData.date.split("T")[0] : "",
        intime: editData.intime || "",
        meetings: editData.meetings || "",
        names: editData.names || "",
        startKM: editData.startKM || "",
        officeOutTime: editData.officeOutTime || "",
        siteReachedTime: editData.siteReachedTime || "",
        siteDetails: editData.siteDetails || "",
        siteOutTime: editData.siteOutTime || "",
        officeReachedTime: editData.officeReachedTime || "",
        endingKM: editData.endingKM || "",
        verifyAuthority: editData.verifyAuthority || "",
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editData) {
        await customFetch.put(`/marketing/${editData._id}`, form);
      } else {
        await customFetch.post("/marketing", form);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Log" : "Add Log"}</DialogTitle>
      <DialogContent>
        {Object.keys(form).map((key) => (
          <TextField
            key={key}
            margin="dense"
            label={key}
            name={key}
            type={
              key.includes("KM") ? "number" : key === "date" ? "date" : "text"
            }
            value={form[key]}
            onChange={handleChange}
            fullWidth
            multiline={key === "siteDetails" || key === "meetings"}
            rows={key === "siteDetails" || key === "meetings" ? 3 : 1}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarketingForm;
