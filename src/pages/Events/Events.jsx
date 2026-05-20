import { useState } from "react";
import "./Events.css";

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Annual Tech Symposium",
    date: "Oct 24, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    attendees: 120,
    rsvped: false,
  },
  {
    id: 2,
    title: "Campus Job Fair",
    date: "Nov 02, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Student Center",
    category: "Career",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800",
    attendees: 350,
    rsvped: true,
  },
  {
    id: 3,
    title: "Art & Culture Fest",
    date: "Nov 15, 2026",
    time: "4:00 PM - 10:00 PM",
    location: "Campus Grounds",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    attendees: 85,
    rsvped: false,
  },
];

function Events() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filter, setFilter] = useState("All");

  const toggleRSVP = (eventId) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          rsvped: !ev.rsvped,
          attendees: ev.rsvped ? ev.attendees - 1 : ev.attendees + 1
        };
      }
      return ev;
    }));
  };

  const filteredEvents = filter === "All" ? events : events.filter(e => e.category === filter);
  const categories = ["All", "Technology", "Career", "Culture"];

  return (
    <div className="events-container">
      {/* Header */}
      <div className="events-header-wrapper">
        <div>
          <h1 className="events-header-title">Campus Events</h1>
          <p className="events-header-subtitle">Discover and join upcoming events on campus.</p>
        </div>
        
        <div className="events-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? "active" : "inactive"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-image-wrapper">
              <img 
                src={event.image} 
                alt={event.title} 
                className="event-image"
              />
              <div className="event-image-overlay"></div>
              <div className="event-category-badge">
                {event.category}
              </div>
            </div>
            
            <div className="event-body">
              <h3 className="event-title">{event.title}</h3>
              
              <div className="event-details-list">
                <div className="event-detail-item">
                  <div className="event-detail-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  {event.date} • {event.time}
                </div>
                <div className="event-detail-item">
                  <div className="event-detail-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  {event.location}
                </div>
                <div className="event-detail-item">
                  <div className="event-detail-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                  {event.attendees} students attending
                </div>
              </div>

              <button 
                onClick={() => toggleRSVP(event.id)}
                className={`btn-rsvp ${event.rsvped ? "rsvped" : "not-rsvped"}`}
              >
                {event.rsvped ? "RSVP'd (Cancel)" : "RSVP Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
