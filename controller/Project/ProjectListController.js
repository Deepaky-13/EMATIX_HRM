import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ProjectListModel from "../../model/Project/ProjectListModel.js";

// Creating the Departments
export const createSingleProject = async (req, res) => {
  const project = await ProjectListModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ project });
};

//Getting all the departments
export const getAllProjectList = async (req, res) => {
  const projects = await ProjectListModel.find({});
  res.status(StatusCodes.OK).json({ projects });
};

// Update department by ID
export const updateSingleProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Project ID" });
  }

  const updatedproject = await ProjectListModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedproject) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Project not found" });
  }

  res.status(StatusCodes.OK).json({ updatedproject });
};

// Delete department by ID
export const deleteProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Project ID" });
  }

  const deleteProjectById = await ProjectListModel.findByIdAndDelete(id);

  if (!deleteProjectById) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Project not found" });
  }

  res.status(StatusCodes.OK).json({ msg: "project deleted successfully" });
};
