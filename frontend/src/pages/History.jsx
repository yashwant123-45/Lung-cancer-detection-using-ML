import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getReadableLabel = (label) => {
    switch (label) {
      case "adenocarcinoma":
        return "Adenocarcinoma";
      case "large_cell_carcinoma":
        return "Large Cell Carcinoma";
      case "squamous_cell_carcinoma":
        return "Squamous Cell Carcinoma";
      case "normal":
        return "Normal";
        case "invalid_image":
  return "Invalid Image";
      default:
        return label;
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get("/api/history");
        setHistory(response.data);
      } catch (err) {
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />

      <section className="page-section">
        <div className="page-header">
          <h1>Analysis History</h1>
          <p>
            View previous scan reports, prediction labels, confidence scores,
            and risk levels saved in the system.
          </p>
        </div>

        <div className="history-wrapper">
          {loading && <p className="center-text">Loading history...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && history.length === 0 && (
            <p className="center-text">No history found yet.</p>
          )}

          {!loading && history.length > 0 && (
            <table className="history-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Image Name</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.image_name}</td>
                    <td>{getReadableLabel(item.predicted_class)}</td>
                    <td>{item.confidence}%</td>
                    <td>{item.risk_level}</td>
                    <td>{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default History;