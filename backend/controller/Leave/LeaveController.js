import Leave from "../../model/Leave/LeaveModel.js";

import cloudinary from "../../utils/Cloudinary.js";

export const createLeave = async (req, res) => {
  console.log(req);

  try {
    const {
      leaveType,
      reason,
      assignedTo,
      totalDays,
      startDate,
      endDate,
      dateOfLeave,
    } = req.body;

    let documentUrl;

    // If file is present, upload to Cloudinary
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "leave-documents" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      try {
        const result = await streamUpload(req.file.buffer);
        documentUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({ message: "Document upload failed" });
      }
    }

    // Create the leave record
    const newLeave = await Leave.create({
      userId: req.user.userId,
      leaveType,
      reason,
      assignedTo,
      documentUrl,
      totalDays: leaveType === "planned" ? totalDays : 1,
      startDate: leaveType === "planned" ? startDate : undefined,
      endDate: leaveType === "planned" ? endDate : undefined,
      dateOfLeave: leaveType === "emergency" ? dateOfLeave : undefined,
    });

    return res.status(201).json(newLeave);
  } catch (error) {
    console.error("Error creating leave:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({}).populate("userId", "name");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single leave by ID
export const getLeavesByUserId = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.params.userId }).populate({
      path: "userId",
      select: "empId name email role departmentId isActive DOB",
    });
    console.log(leaves);

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update leave by ID
export const updateLeave = async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete leave by ID
export const deleteLeave = async (req, res) => {
  try {
    const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
