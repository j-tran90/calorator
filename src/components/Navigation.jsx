import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Link as={Link} to="/dashboard" style={{ marginRight: "20px" }}>
          Dashboard
        </Link>
        <Link as={Link} to="/profile" style={{ marginRight: "20px" }}>
          Profile
        </Link>
        <Link as={Link} to="/journal" style={{ marginRight: "20px" }}>
          Journal
        </Link>
        {/* <Link as={Link} to="/test" style={{ marginRight: "" }}>
          Test
        </Link> */}
      </div>
    </>
  );
}
