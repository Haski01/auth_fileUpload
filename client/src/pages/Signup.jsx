import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("avatar", profilePic);

    try {
      await axiosInstance.post("/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
