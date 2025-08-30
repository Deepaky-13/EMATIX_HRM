"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  People,
  PersonAdd,
  Visibility,
  Close,
  Search,
} from "@mui/icons-material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const AdminMarketingLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get("/marketing");
        console.log(data, " : fetched marketing logs");

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Format time display
  const formatTime = (time) => {
    if (!time) return "-";
    return time;
  };

  // Format date display
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to handle verify authority update
  const handleVerifyUpdate = async (logId, value) => {
    try {
      await customFetch.put(`/marketing/${logId}`, {
        verifyAuthority: value,
      });
      // Optionally, update state so UI refreshes without reload
      setLogs((prevLogs) =>
        prevLogs.map((log) =>
          log._id === logId ? { ...log, verifyAuthority: value } : log
        )
      );
    } catch (error) {
      console.error("Error updating verifyAuthority:", error);
    }
  };

  // Calculate total KM
  const calculateTotalKM = (startKM, endingKM) => {
    if (!startKM || !endingKM) return "-";
    const total = endingKM - startKM;
    return total > 0 ? `${total} km` : "-";
  };

  // Search functionality
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;

    return logs.filter((log) => {
      const searchStr = searchQuery.toLowerCase();

      // Search in basic log fields
      const basicFields = [
        log.names,
        log.siteDetails,
        formatDate(log.date),
        formatTime(log.intime),
        formatTime(log.officeOutTime),
        formatTime(log.siteReachedTime),
        formatTime(log.siteOutTime),
        formatTime(log.officeReachedTime),
        log.startKM?.toString(),
        log.endingKM?.toString(),
        log.meetings?.toString(),
        log.verifyAuthority,
      ].some((field) => field?.toLowerCase().includes(searchStr));

      // Search in clients
      const clientsMatch = log.clients?.some((client) =>
        [
          client.clientName,
          client.clientContactNumber,
          client.clientRemarks,
        ].some((field) => field?.toLowerCase().includes(searchStr))
      );

      // Search in leads
      const leadsMatch = log.leads?.some((lead) =>
        [lead.leadName, lead.leadDesignation, lead.leadContactNumber].some(
          (field) => field?.toLowerCase().includes(searchStr)
        )
      );

      return basicFields || clientsMatch || leadsMatch;
    });
  }, [logs, searchQuery]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <CalendarToday sx={{ fontSize: 32, color: "#1976d2" }} />
        <Box>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="#333"
          >
            Marketing Logs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track daily marketing activities and client interactions
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: 230 }}
                gap={2}
              >
                <CalendarToday sx={{ color: "#1976d2" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Logs
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {logs.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: 230 }}
                gap={2}
              >
                <People sx={{ color: "#4caf50" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Clients
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {logs.reduce(
                      (acc, log) => acc + (log.clients?.length || 0),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: 230 }}
                gap={2}
              >
                <PersonAdd sx={{ color: "#ff9800" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Leads
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {logs.reduce(
                      (acc, log) => acc + (log.leads?.length || 0),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: 230 }}
                gap={2}
              >
                <LocationOn sx={{ color: "#9c27b0" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Meetings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {logs.reduce(
                      (acc, log) => acc + (Number.parseInt(log.meetings) || 0),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Box */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search in all marketing log details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fafafa",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card elevation={3}>
        <Box p={2} borderBottom="1px solid #e0e0e0">
          <Typography
            variant="h6"
            component="h2"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Visibility />
            Marketing Activity Log ({filteredLogs.length} records)
          </Typography>
        </Box>
        <TableContainer
          sx={{ maxHeight: 600, maxWidth: "100%", overflow: "auto" }}
        >
          <Table stickyHeader sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    // position: 'sticky',
                    left: 0,
                    zIndex: 3,
                    minWidth: 120,
                    width: 120,
                    maxWidth: 120,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    // position: 'sticky',
                    left: 120,
                    zIndex: 3,
                    minWidth: 140,
                    width: 140,
                    maxWidth: 140,
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 100,
                    width: 100,
                    maxWidth: 100,
                  }}
                >
                  Clients
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 100,
                    width: 100,
                    maxWidth: 100,
                  }}
                >
                  Leads
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 140,
                    width: 140,
                    maxWidth: 140,
                  }}
                >
                  Verified By
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 100,
                    width: 100,
                    maxWidth: 100,
                  }}
                >
                  Time In
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 80,
                    width: 80,
                    maxWidth: 80,
                  }}
                >
                  Meetings
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 160,
                    width: 160,
                    maxWidth: 160,
                  }}
                >
                  Site Information
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 120,
                    width: 120,
                    maxWidth: 120,
                  }}
                >
                  Schedule
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    minWidth: 140,
                    width: 140,
                    maxWidth: 140,
                  }}
                >
                  Travel Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "#ffffff",
                      zIndex: 2,
                      minWidth: 120,
                      width: 120,
                      maxWidth: 120,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(log.date)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 120,
                      backgroundColor: "#ffffff",
                      zIndex: 2,
                      minWidth: 140,
                      width: 140,
                      maxWidth: 140,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={log.names}
                    >
                      {log.names || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, width: 100, maxWidth: 100 }}>
                    {log.clients?.length > 0 ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<People sx={{ fontSize: 16 }} />}
                        onClick={() => {
                          setSelectedClients(log.clients);
                          setClientDialogOpen(true);
                        }}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        {log.clients.length}
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No clients
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, width: 100, maxWidth: 100 }}>
                    {log.leads?.length > 0 ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
                        onClick={() => {
                          setSelectedLeads(log.leads);
                          setLeadDialogOpen(true);
                        }}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        {log.leads.length}
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No leads
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 140, width: 140, maxWidth: 140 }}>
                    <TextField
                      size="small"
                      value={log.verifyAuthority || ""}
                      onChange={(e) =>
                        setLogs((prevLogs) =>
                          prevLogs.map((l) =>
                            l._id === log._id
                              ? { ...l, verifyAuthority: e.target.value }
                              : l
                          )
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleVerifyUpdate(log._id, log.verifyAuthority);
                          toast.success("Verify Authority updated");
                        }
                      }}
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, width: 100, maxWidth: 100 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime sx={{ fontSize: 16, color: "#666" }} />
                      <Typography variant="body2">
                        {formatTime(log.intime)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ minWidth: 80, width: 80, maxWidth: 80 }}>
                    <Chip
                      label={`${log.meetings || 0}`}
                      size="small"
                      sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
                    />
                  </TableCell>

                  <TableCell sx={{ minWidth: 140, width: 140, maxWidth: 140 }}>
                    <Box>
                      <Typography variant="caption" display="block">
                        Start: {log.startKM || "-"} km
                      </Typography>
                      <Typography variant="caption" display="block">
                        End: {log.endingKM || "-"} km
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: "#1976d2", fontWeight: "medium" }}
                      >
                        Total: {calculateTotalKM(log.startKM, log.endingKM)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 160, width: 160, maxWidth: 160 }}>
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mb={0.5}
                      >
                        <LocationOn sx={{ fontSize: 20, color: "#666" }} />
                        <Typography
                          variant="caption"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 120,
                          }}
                          title={log.siteDetails}
                        >
                          {log.siteDetails || "-"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" display="block">
                        Reached: {formatTime(log.siteReachedTime)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Left: {formatTime(log.siteOutTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120, width: 120, maxWidth: 120 }}>
                    <Box>
                      <Typography variant="caption" display="block">
                        Out: {formatTime(log.officeOutTime)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Back: {formatTime(log.officeReachedTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Client Dialog */}
      <Dialog
        open={clientDialogOpen}
        onClose={() => setClientDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <People />
              Clients ({selectedClients.length})
            </Box>
          </DialogTitle>
          <IconButton onClick={() => setClientDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedClients.map((client, index) => (
                  <TableRow key={client._id || index}>
                    <TableCell>
                      {client.images ? (
                        <img
                          src={client.images}
                          alt={client.clientName || "client"}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {client.clientName || "-"}
                    </TableCell>
                    <TableCell>{client.clientContactNumber || "-"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 250 }}>
                        {client.clientRemarks || "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Leads Dialog */}
      <Dialog
        open={leadDialogOpen}
        onClose={() => setLeadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonAdd />
              Leads ({selectedLeads.length})
            </Box>
          </DialogTitle>
          <IconButton onClick={() => setLeadDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLeads.map((lead, index) => (
                  <TableRow key={lead._id || index}>
                    <TableCell>
                      {lead.images ? (
                        <img
                          src={lead.images}
                          alt={lead.clientName || "client"}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {lead.leadName || "-"}
                    </TableCell>
                    <TableCell>{lead.leadDesignation || "-"}</TableCell>
                    <TableCell>{lead.leadContactNumber || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredLogs.length === 0 && logs.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Search sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query to find marketing logs.
            </Typography>
          </CardContent>
        </Card>
      )}

      {logs.length === 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <CalendarToday sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              No marketing logs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by adding your first marketing activity log.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminMarketingLog;
