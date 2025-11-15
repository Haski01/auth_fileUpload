import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;
  // console.log("Profile picture url(user.avater.url)", user.avatar.url);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.fullName}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          display: "inline-block",
        }}
      >
        <img
          src={user.avatar.url}
          alt="Profile"
          width="120"
          height="120"
          style={{ borderRadius: "50%" }}
        />
        <h3>{user.fullName}</h3>
        <p>Email: {user.email}</p>
        <p>ID: {user._id}</p>
      </div>
    </div>
  );
};

export default Dashboard;
