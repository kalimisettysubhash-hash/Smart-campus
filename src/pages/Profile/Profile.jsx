import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import "./Profile.css";

function Profile() {
  const { currentUser, resetPassword } = useAuth();
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem(`profile_${currentUser?.userId}`));
    if (savedUser) return savedUser;
    
    return {
      name: currentUser?.userId || "Student Name",
      email: currentUser?.email || "student@aurora.edu",
      role: "Student",
      studentId: currentUser?.studentId || "AU2026",
      bio: "Campus portal member",
      joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [savedMessage, setSavedMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUser(formData);
    localStorage.setItem(`profile_${currentUser?.userId}`, JSON.stringify(formData));
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleChangePassword = () => {
    const newPassword = window.prompt("Enter a new password");
    if (!newPassword) return;

    const success = resetPassword(currentUser?.userId, newPassword);
    if (success) {
      setSavedMessage("Password changed successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information and preferences.</p>
        </div>

        {savedMessage && (
          <div className="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            {savedMessage}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-banner">
            <div className="profile-avatar-container">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg" 
                alt="Profile" 
                className="profile-avatar"
              />
            </div>
          </div>

          <div className="profile-card-content">
            <div className="profile-info-header">
              <div>
                <h2>{user.name}</h2>
                <p>{user.role} - {user.studentId}</p>
              </div>
              <button 
                onClick={() => {
                  if (isEditing) {
                    setFormData({ ...user });
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`btn-edit-toggle ${isEditing ? "active" : ""}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="profile-form">
              <div className="form-column">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Student ID</label>
                  <input 
                    type="text" 
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Role / Department</label>
                  <input 
                    type="text" 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button onClick={handleSave} className="btn-save">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Joined</p>
              <p className="stat-value">{user.joined}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Account Status</p>
              <p className="stat-value success">Active</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Password</p>
              <button type="button" className="btn-link" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Profile;
