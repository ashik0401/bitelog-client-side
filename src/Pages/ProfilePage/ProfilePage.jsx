import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ProfilePage = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get("/profile") // new backend route
      .then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          photoURL: res.data.photoURL || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please login again.");
      })
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    axiosSecure
      .put("/users/update-profile", formData) // backend update route
      .then((res) => {
        setUser(res.data.user);
        setEditing(false);
        setError("");
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
        setError("Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</div>;
  if (!user) return <div style={{ textAlign: "center", marginTop: "50px" }}>User not found</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img
          src={formData.photoURL || "https://i.ibb.co/dJLYqynf/Screenshot-45.png"}
          alt="Profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }}
        />
        <div>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Badge: {user.badge}</p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editing} style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px" }} />

        <label>Photo URL:</label>
        <input type="text" name="photoURL" value={formData.photoURL} onChange={handleChange} disabled={!editing} style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px" }} />

        <label>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editing} style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px" }} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!editing} style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px" }} />
      </div>

      {editing ? (
        <div>
          <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px" }}>Save</button>
          <button
            onClick={() => {
              setEditing(false);
              setFormData({
                name: user.name || "",
                photoURL: user.photoURL || "",
                phone: user.phone || "",
                address: user.address || "",
              });
            }}
            style={{ padding: "10px 20px" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ padding: "10px 20px" }}>Edit Profile</button>
      )}
    </div>
  );
};

export default ProfilePage;
