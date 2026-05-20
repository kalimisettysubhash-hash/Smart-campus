import { useAuth } from "../../context/useAuth"
import "./Dashboard.css"

function Dashboard() {
  const { currentUser } = useAuth()
  const today = new Date()
  const monthName = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate()
  const firstDay = new Date(year, today.getMonth(), 1).getDay()
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const getNotes = () => {
    try {
      const notes = JSON.parse(localStorage.getItem("notes"))
      return Array.isArray(notes) ? notes : []
    } catch {
      return []
    }
  }

  const allNotes = getNotes()
  const userNotes = allNotes.filter((note) => note.owner === currentUser.email)

  const overviewCards = [
    {
      title: "Attendance",
      value: "92%",
      detail: "Above required 75%",
      tone: "blue",
    },
    {
      title: "Assignments",
      value: "4",
      detail: "2 due this week",
      tone: "green",
    },
    {
      title: "Notes Uploaded",
      value: userNotes.length,
      detail: "Your academic files",
      tone: "violet",
    },
    {
      title: "Library Books",
      value: "3",
      detail: "1 return pending",
      tone: "amber",
    },
  ]

  const timetable = [
    { time: "09:00", subject: "Data Structures", room: "Lab 204", status: "Now" },
    { time: "11:00", subject: "Computer Networks", room: "Room 112", status: "Next" },
    { time: "01:30", subject: "Database Systems", room: "Room 208", status: "Today" },
    { time: "03:00", subject: "Project Review", room: "Seminar Hall", status: "Today" },
  ]

  const notices = [
    { title: "Mid semester exam form closes tonight", tag: "Exam", date: "Today" },
    { title: "Tech fest volunteer registration is open", tag: "Event", date: "May 15" },
    { title: "Library will remain open till 8 PM", tag: "Library", date: "This week" },
  ]

  const services = [
    { label: "Bus Pass", value: "Active", tone: "green" },
    { label: "Hostel", value: "Room B-214", tone: "blue" },
    { label: "Canteen", value: "Rs. 320 balance", tone: "amber" },
    { label: "Support", value: "1 ticket open", tone: "red" },
  ]

  const assignments = [
    { title: "DBMS ER Diagram", course: "Database Systems", due: "Tomorrow", progress: 70 },
    { title: "Network Lab Record", course: "Computer Networks", due: "May 16", progress: 45 },
    { title: "Mini Project Demo", course: "Software Lab", due: "May 20", progress: 82 },
  ]
  const recentActivities = userNotes.length
    ? userNotes.slice(0, 4).map((note, index) => ({
        id: index + 1,
        title: `${note.title} uploaded`,
        meta: "Academic Hub",
      }))
    : [
        { id: 1, title: "Welcome profile created", meta: "Account" },
        { id: 2, title: "Dashboard access enabled", meta: "Smart Campus" },
      ]

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="hero-chip">Student Dashboard</span>
          <h1 className="welcome-title">Welcome back, {currentUser?.userId}</h1>
          <p className="welcome-subtitle">
            Track classes, notices, assignments, services, and campus updates from one place.
          </p>
        </div>

        <div className="profile-card">
          <p className="profile-text">Logged in as</p>
          <h3 className="profile-email">{currentUser?.email || "No Email"}</h3>
          <span className="profile-role">{currentUser?.role || "student"}</span>
        </div>
      </section>

      <section className="overview-grid">
        {overviewCards.map((card) => (
          <article key={card.title} className={`overview-card ${card.tone}`}>
            <div className="overview-icon">{card.title.charAt(0)}</div>
            <p className="overview-title">{card.title}</p>
            <h2 className="overview-value">{card.value}</h2>
            <p className="overview-detail">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel schedule-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Today Schedule</h2>
              <p className="section-subtitle">Classes and academic sessions</p>
            </div>
            <span className="panel-badge">{monthName} {today.getDate()}</span>
          </div>

          <div className="timeline">
            {timetable.map((item) => (
              <div key={`${item.time}-${item.subject}`} className="timeline-item">
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div>
                    <h3>{item.subject}</h3>
                    <p>{item.room}</p>
                  </div>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        

        <article className="panel assignments-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Pending Work</h2>
              <p className="section-subtitle">Assignments and submissions</p>
            </div>
          </div>

          <div className="assignment-list">
            {assignments.map((item) => (
              <div key={item.title} className="assignment-item">
                <div className="assignment-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.course}</p>
                  </div>
                  <span>{item.due}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel notice-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Campus Notices</h2>
              <p className="section-subtitle">Announcements you should not miss</p>
            </div>
          </div>

          <div className="notice-list">
            {notices.map((notice) => (
              <div key={notice.title} className="notice-item">
                <span>{notice.tag}</span>
                <div>
                  <h3>{notice.title}</h3>
                  <p>{notice.date}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel services-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Campus Services</h2>
              <p className="section-subtitle">Live student service summary</p>
            </div>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <div key={service.label} className={`service-card ${service.tone}`}>
                <p>{service.label}</p>
                <h3>{service.value}</h3>
              </div>
            ))}
          </div>
        </article>

        <article className="panel calendar-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Calendar</h2>
              <p className="section-subtitle">{monthName} {year}</p>
            </div>
          </div>

          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="calendar-weekday">{day}</span>
            ))}

            {calendarDays.map((day, index) => (
              <span
                key={`${day ?? "empty"}-${index}`}
                className={day === today.getDate() ? "calendar-day today" : "calendar-day"}
              >
                {day}
              </span>
            ))}
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-subtitle">Latest account updates</p>
            </div>
          </div>

          <div className="activity-list">
            {recentActivities.map((item) => (
              <div key={item.id} className="activity-item">
                <span></span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
