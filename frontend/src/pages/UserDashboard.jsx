function UserDashboard() {
  return (
    <div style={styles.container}>
      <h2>User Dashboard</h2>

      <div style={styles.grid}>
        <div className="card">Browse Resources</div>
        <div className="card">My Bookings</div>
        <div className="card">My Tickets</div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
};

export default UserDashboard;