import { Link } from "react-router-dom";

function Brand() {
  return (
    <Link
      to='/'
      style={{ fontSize: "2rem", color: "#4FC483", textDecoration: "none" }}
    >
      Calorator
    </Link>
  );
}

export default Brand;
