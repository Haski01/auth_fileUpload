import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      {!user ? (
        <>
          <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;
