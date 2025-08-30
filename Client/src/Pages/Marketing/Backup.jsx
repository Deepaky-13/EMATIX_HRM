import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import BackupModal from "./BackUpModal";
// adjust path if needed

const BackupManager = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Marketing Backup & Restore
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage, download, and delete marketing backup data easily.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Open Backup Manager
        </Button>
      </Box>

      {/* Backup Modal */}
      <BackupModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default BackupManager;
