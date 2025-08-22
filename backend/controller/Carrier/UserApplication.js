import UserApplication from "../../model/Carrier/UserApplication.js";

// Create a new user application
export const createApplication = async (req, res) => {
  try {
    const { job, name, email, phone, description } = req.body;

    if (!job || !name || !email || !phone || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }
    console.log(req.user);

    const newApplication = await UserApplication.create({
      job,
      user: req.user.userId, // store user ID from auth middleware
      employeeName: req.user.name, // store employee name from auth middleware
      name,
      email,
      phone,
      description,
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const getMyApplications = async (req, res) => {
  try {
    const myApps = await UserApplication.find({ user: req.user.userId })
      .populate("job", "position department role deadline")
      .sort({ createdAt: -1 });

    res.status(200).json(myApps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await UserApplication.find()
      .populate("job", "position department role deadline") // populate job details
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const getApplicationById = async (req, res) => {
  try {
    const application = await UserApplication.findById(req.params.id).populate(
      "job",
      "position department role deadline"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const updateApplication = async (req, res) => {
  try {
    const { name, email, phone, description, employeeName } = req.body;

    const updatedApplication = await UserApplication.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, description, employeeName },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteApplication = async (req, res) => {
  try {
    const deleted = await UserApplication.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
