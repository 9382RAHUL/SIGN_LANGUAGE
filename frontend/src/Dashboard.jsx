import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/protected", {
          headers: { Authorization: token },
        });
        setMessage(res.data.message);
      } catch (err) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };

    fetchProtected();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard (Protected)</h2>
      <p>{message}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/signin");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
