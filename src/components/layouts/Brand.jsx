import { Link } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

function Brand({ iconOnly = false }) {
  return (
    <Link
      to='/'
      style={{ fontSize: "2rem", color: "#4FC483", textDecoration: "none" }}
    >
      <LocalFireDepartmentIcon
        sx={{ fontSize: "2rem", mb: "-5px", color: "#4FC483", textDecoration: "none" }}
      />
      {!iconOnly && " Calorator"}
    </Link>
  );
}

export default Brand;
