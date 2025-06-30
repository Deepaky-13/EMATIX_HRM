import ProjectListModel from "../../model/Project/ProjectListModel.js";
import ProjectModel from "../../model/ProjectAssign/ProjectModel.js";
import RoleModel from "../../model/Roles/RoleModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// Create project
export const createProject = async (req, res) => {
  console.log(req.body);
  const { project_name, role, name } = req.body;

  console.log("project_name:", project_name, "role name:", role, "name:", name);

  // 1. Validate that project_name exists in ProjectList
  const projectExistsInList = await ProjectListModel.findOne({
    project_name: { $regex: new RegExp(`^${project_name.trim()}$`, "i") },
  });
  console.log("projectExist", projectExistsInList);

  if (!projectExistsInList) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Project name is not listed in the ProjectList collection",
    });
  }

  // 2. Find the role document using role name and name
  const roleDoc = await RoleModel.findOne({
    role: { $regex: new RegExp(`^${role.trim()}$`, "i") },
    name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, // validate name also
  });

  if (!roleDoc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Role or Name with the given name not found" });
  }

  const roleId = roleDoc._id;

  // 3. Proceed to create
  const newProject = await ProjectModel.create({ project_name, role: roleId });

  res.status(StatusCodes.CREATED).json({ project: newProject });
};

// Get all projects
export const getAllProjects = async (req, res) => {
  const projects = await ProjectModel.find().populate({
    path: "role",
    select: "name role departmentId empId",
    populate: {
      path: "departmentId",
      select: "department_name departmentId", // only fetch department_name
    },
  });

  res.status(StatusCodes.OK).json({ projects });
};

// Update project
export const updateProjectById = async (req, res) => {
  const { id } = req.params;
  const { project_name, role, name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Project ID" });
  }

  const projectExistsInList = await ProjectListModel.findOne({
    project_name: { $regex: new RegExp(`^${project_name.trim()}$`, "i") },
  });

  if (!projectExistsInList) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Project name is not listed in the ProjectList collection",
    });
  }

  let roleId;

  if (role && name) {
    const roleDoc = await RoleModel.findOne({
      role: { $regex: new RegExp(`^${role.trim()}$`, "i") },
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (!roleDoc) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Role or Name not found" });
    }

    roleId = roleDoc._id;
  }

  const updatedFields = {
    ...(project_name && { project_name }),
    ...(roleId && { role: roleId }),
  };

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    id,
    updatedFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProject) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Project not found" });
  }

  res.status(StatusCodes.OK).json({ project: updatedProject });
};

// Delete project
export const deleteProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Project ID" });
  }

  const deleted = await ProjectModel.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Project not found" });
  }

  res.status(StatusCodes.OK).json({ msg: "Project deleted successfully" });
};
