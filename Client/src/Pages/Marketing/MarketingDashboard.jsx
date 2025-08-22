import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import MarketingForm from "../../compontents/Marketing/MarketingForm";
import LeadsModal from "../../compontents/Marketing/LeadsModal";

const MarketingDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openLeads, setOpenLeads] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      const res = await customFetch.get("/marketing"); // use customFetch
      setLogs(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleEdit = (log) => {
    setEditData(log);
    setOpenForm(true);
  };

  const handleLeads = (log) => {
    setSelectedLog(log);
    setOpenLeads(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketing Logs</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenForm(true)}
      >
        + Add Log
      </Button>

      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Meetings</TableCell>
            <TableCell>Names</TableCell>
            <TableCell>Created/Updated By</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>{log._id}</TableCell>
              <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
              <TableCell>{log.meetings}</TableCell>
              <TableCell>{log.names}</TableCell>
              <TableCell>{log.User?.name || "Unknown"}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(log)}>Edit</Button>
                <Button onClick={() => handleLeads(log)}>Leads</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {openForm && (
        <MarketingForm
          open={openForm}
          handleClose={() => {
            setOpenForm(false);
            setEditData(null);
            fetchLogs(); // refresh logs
          }}
          editData={editData}
        />
      )}

      {openLeads && (
        <LeadsModal
          open={openLeads}
          handleClose={() => {
            setOpenLeads(false);
            fetchLogs(); // refresh logs to get updated leads
          }}
          log={selectedLog}
        />
      )}
    </div>
  );
};

export default MarketingDashboard;
