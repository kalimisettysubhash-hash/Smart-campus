import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import "./Login.css";

function Login() {
  const { login, register, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    userId: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = () => {
    if (!user.userId || !user.email || !user.password) {
      alert("Please fill all fields");
      return;
    }
    const success = register(user.userId.trim(), user.email.trim(), user.password);
    if (success) {
      setIsLogin(true);
      setUser({ userId: "", email: "", password: "" });
    }
  };

  const handleLoginSubmit = () => {
    if (!user.userId || !user.password) {
      alert("Please enter User ID and Password");
      return;
    }
    login(user.userId.trim(), user.password);
  };

  const handleForgotPassword = () => {
    const userId = window.prompt("Enter your User ID");
    if (!userId) return;

    const newPassword = window.prompt("Enter a new password");
    if (!newPassword) return;

    resetPassword(userId.trim(), newPassword);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="form-container">
          <div className="form-toggle">
            <button
              type="button"
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <div className="form">
              <h2>Login Form</h2>
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={user.userId}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="link-button"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleLoginSubmit}
              >
                Login
              </button>
            </div>
          ) : (
            <div className="form">
              <h2>Register Form</h2>
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={user.userId}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email (Gmail)"
                value={user.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="submit-btn"
                onClick={handleRegisterSubmit}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
