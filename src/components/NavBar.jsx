import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Link as={Link} to='/dashboard' style={{ marginRight: "20px" }}>
          Dashboard
        </Link>
        <Link as={Link} to='/profile' style={{ marginRight: "20px" }}>
          Profile
        </Link>
        <Link as={Link} to='/journal' style={{ marginRight: "0px" }}>
          Journal
        </Link>
        {/* <Link as={Link} to="/test" style={{ marginLeft: "20px" }}>
          Test
        </Link> */}
      </div>
    </>
  );
}
