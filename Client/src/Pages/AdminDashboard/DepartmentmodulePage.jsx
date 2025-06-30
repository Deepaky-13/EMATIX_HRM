import DepartmentComponent from "../../compontents/Department/DepartmentComponent";
import RoleComponent from "../../compontents/Department/RoleComponent";
import CreateProject from "../../compontents/Department/CreateProject";
import ProjectAssign from "../../compontents/Department/ProjectAssign";

const DepartmentmodulePage = ({ type }) => {
  let CompontentToRender;

  if (type === "department") {
    CompontentToRender = <DepartmentComponent />;
  } else if (type === "roles") {
    CompontentToRender = <RoleComponent />;
  } else if (type === "project") {
    CompontentToRender = <CreateProject />;
  } else if (type === "assign") {
    CompontentToRender = <ProjectAssign />;
  } else {
    CompontentToRender = <p>Select a valid section</p>;
  }

  return <div>{CompontentToRender}</div>;
};

export default DepartmentmodulePage;
