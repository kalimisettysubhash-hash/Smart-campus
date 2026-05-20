import { useState } from "react";
import "./Reporter.css";

function Reporter() {
  const [tickets, setTickets] = useState(() => {
    return JSON.parse(localStorage.getItem("campusTickets")) || [
      {
        id: "TKT-1024",
        title: "Projector in Room 302 is not working",
        category: "IT Support",
        urgency: "High",
        status: "In Progress",
        date: "Oct 22, 2026",
      },
      {
        id: "TKT-1023",
        title: "Leaking tap in library washroom",
        category: "Maintenance",
        urgency: "Medium",
        status: "Resolved",
        date: "Oct 20, 2026",
      }
    ];
  });
  const [formData, setFormData] = useState({
    title: "",
    category: "Maintenance",
    urgency: "Low",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newTicket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        status: "Pending",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      const updatedTickets = [newTicket, ...tickets];
      setTickets(updatedTickets);
      localStorage.setItem("campusTickets", JSON.stringify(updatedTickets));
      
      setFormData({ title: "", category: "Maintenance", urgency: "Low", description: "" });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "Resolved": return "badge-resolved";
      case "In Progress": return "badge-progress";
      default: return "badge-pending";
    }
  };

  const getUrgencyClass = (urgency) => {
    switch(urgency) {
      case "High": return "urgency-high";
      case "Medium": return "urgency-medium";
      default: return "urgency-low";
    }
  };

  return (
    <div className="reporter-container">
      <div className="reporter-content">
        
        <div className="reporter-header">
          <h1 className="reporter-title">Issue Reporter</h1>
          <p className="reporter-subtitle">Report campus issues and track their resolution status.</p>
        </div>

        <div className="reporter-grid">
          
          {/* Form Column */}
          <div className="form-column">
            <div className="reporter-form-card">
              <h2 className="form-title">Submit a Ticket</h2>
              
              {showSuccess && (
                <div className="form-alert-success">
                  <svg style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  Ticket submitted successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Issue Title</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief description of the issue"
                    className="form-input"
                  />
                </div>
                
                <div className="form-row">
                  <div>
                    <label className="form-label">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Maintenance</option>
                      <option>IT Support</option>
                      <option>Cleaning</option>
                      <option>Security</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Urgency</label>
                    <select 
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{marginBottom: "1.5rem"}}>
                  <label className="form-label">Detailed Description</label>
                  <textarea 
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide more details about the issue..."
                    className="form-textarea"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-submit"
                >
                  {isSubmitting ? (
                    <svg className="spinner" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : "Submit Ticket"}
                </button>
              </form>
            </div>
          </div>

          {/* Tickets Column */}
          <div className="tickets-column">
            <div className="tickets-card">
              <div className="tickets-header">
                <h2 className="tickets-title">My Tickets</h2>
                <div className="tickets-count">{tickets.length} total</div>
              </div>
              
              <div className="tickets-list">
                {tickets.length === 0 ? (
                  <div className="empty-tickets">
                    <svg className="empty-tickets-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    <p>No tickets reported yet.</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-header-row">
                        <div>
                          <div className="ticket-badges">
                            <span className="ticket-id">{ticket.id}</span>
                            <span className={`badge ${getStatusClass(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`badge ${getUrgencyClass(ticket.urgency)}`}>
                              {ticket.urgency} Priority
                            </span>
                          </div>
                          <h3 className="ticket-title">{ticket.title}</h3>
                          <div className="ticket-category">
                            <svg className="ticket-category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                            {ticket.category}
                          </div>
                        </div>
                        <div className="ticket-date">
                          {ticket.date}
                        </div>
                      </div>
                      
                      {ticket.description && (
                        <p className="ticket-description">
                          {ticket.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Reporter;
