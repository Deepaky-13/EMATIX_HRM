import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import customFetch from "../../utils/customFetch";

const AdminMarketingLogs = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchLogs = async () => {
    try {
      const res = await customFetch.get("/marketing");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Admin - Marketing Logs
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Intime</TableCell>
            <TableCell>Meetings</TableCell>
            <TableCell>Names</TableCell>
            <TableCell>Start KM</TableCell>
            <TableCell>Office Out Time</TableCell>
            <TableCell>Site Reached Time</TableCell>
            <TableCell>Site Details & Updates</TableCell>
            <TableCell>Site Out Time</TableCell>
            <TableCell>Office Reached Time</TableCell>
            <TableCell>Ending KM</TableCell>
            <TableCell>Leads</TableCell>
            <TableCell>Verify Authority</TableCell>
            <TableCell>Expand</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <React.Fragment key={log._id}>
              <TableRow>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.intime}</TableCell>
                <TableCell>{log.meetings}</TableCell>
                <TableCell>{log.names}</TableCell>
                <TableCell>{log.startKM}</TableCell>
                <TableCell>{log.officeOutTime}</TableCell>
                <TableCell>{log.siteReachedTime}</TableCell>
                <TableCell>{log.siteDetails}</TableCell>
                <TableCell>{log.siteOutTime}</TableCell>
                <TableCell>{log.officeReachedTime}</TableCell>
                <TableCell>{log.endingKM}</TableCell>
                <TableCell>
                  {log.leads.length} Lead{log.leads.length > 1 ? "s" : ""}
                </TableCell>
                <TableCell>{log.verifyAuthority}</TableCell>
                <TableCell>
                  <IconButton onClick={() => toggleExpand(log._id)}>
                    {expandedLogId === log._id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Expandable section to show Leads */}
              <TableRow>
                <TableCell
                  colSpan={14}
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                >
                  <Collapse
                    in={expandedLogId === log._id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={1}>
                      {log.leads.length > 0 ? (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Lead Name</TableCell>
                              <TableCell>Designation</TableCell>
                              <TableCell>Contact</TableCell>
                              <TableCell>Created By</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {log.leads.map((lead) => (
                              <TableRow key={lead._id}>
                                <TableCell>{lead.leadName}</TableCell>
                                <TableCell>{lead.leadDesignation}</TableCell>
                                <TableCell>{lead.leadContactNumber}</TableCell>
                                <TableCell>
                                  {lead.User?.name || "Unknown"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="body2">
                          No leads generated
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminMarketingLogs;
