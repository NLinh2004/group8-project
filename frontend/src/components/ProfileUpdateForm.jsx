import React, { useState, useEffect } from "react";

const ProfileUpdateForm = ({ user, onUpdate }) => {
  const [name, setName] = useState("");
  const [gitname, setGitname] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Khi component mount hoặc user thay đổi, set giá trị ban đầu
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setGitname(user.gitname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Tên không được để trống";
    if (!gitname.trim()) newErrors.gitname = "Git name không được để trống";
    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Giả lập call API cập nhật thông tin
    setTimeout(() => {
      const updatedUser = { ...user, name, gitname, email };
      onUpdate && onUpdate(updatedUser);
      setIsSubmitting(false);
      alert("Cập nhật thành công!");
    }, 1000);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#1976d2" }}>Cập nhật thông tin cá nhân</h2>

      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleInputChange("name", e.target.value, setName)}
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.name ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
          )}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              handleInputChange("email", e.target.value, setEmail)
            }
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.email ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>
          )}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Git Name: </label>
          <input
            type="text"
            value={gitname}
            onChange={(e) =>
              handleInputChange("gitname", e.target.value, setGitname)
            }
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.gitname ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.gitname && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.gitname}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#cccccc" : "#1976d2",
            color: "#fff",
            padding: "8px 22px",
            border: "none",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
