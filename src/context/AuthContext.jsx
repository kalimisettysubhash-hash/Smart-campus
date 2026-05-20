import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContextCore";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("currentUser");

    if (!token || !storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user", error);
      localStorage.removeItem("currentUser");
      return null;
    }
  });
  const navigate = useNavigate();

  const register = (userId, email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((u) => u.userId === userId || u.email === email);

    if (userExists) {
      alert("User ID or Email already exists!");
      return false;
    }

    const newUser = { userId, email, password, studentId: `STU${Math.floor(Math.random() * 10000)}` };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    alert("Registration successful! Please login.");
    return true;
  };

  const login = (userId, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.userId === userId && u.password === password);

    if (user) {
      const mockToken = btoa(JSON.stringify({ userId: user.userId, exp: Date.now() + 3600000 }));
      localStorage.setItem("jwt_token", mockToken);
      
      const userInfo = { userId: user.userId, studentId: user.studentId, email: user.email };
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      navigate("/home/dashboard");
      return true;
    }
    alert("Invalid credentials.");
    return false;
  };

  const resetPassword = (userId, newPassword) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.userId === userId);

    if (!userExists) {
      alert("User ID not found.");
      return false;
    }

    const updatedUsers = users.map((user) =>
      user.userId === userId ? { ...user, password: newPassword } : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Password updated successfully. Please login with your new password.");
    return true;
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
