import CareerJob from "../../model/Carrier/CarrierModal.js";

// Create a new job posting
export const createJob = async (req, res) => {
  try {
    const { position, department, role, deadline } = req.body;

    if (!position || !department || !role || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await CareerJob.create({
      position,
      department,
      role,
      deadline,
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all job postings
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await CareerJob.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job posting by ID
export const getJobById = async (req, res) => {
  try {
    const job = await CareerJob.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job posting by ID
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await CareerJob.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { position, department, role, deadline } = req.body;

    const updatedJob = await CareerJob.findByIdAndUpdate(
      req.params.id,
      {
        position,
        department,
        role,
        deadline,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
