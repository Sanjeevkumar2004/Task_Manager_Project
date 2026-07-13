function DashboardCard({ title, value, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div
        className="card text-white"
        style={{
          background: color,
        }}
      >
        <div className="card-body">

          <h5>{title}</h5>

          <h2>{value}</h2>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard;