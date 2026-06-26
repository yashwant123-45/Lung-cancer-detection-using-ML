import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Analyze() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("Please select a CT scan image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await API.post("/api/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze image. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="page-section">
        <div className="page-header">
          <h1>CT Scan Analysis</h1>
          <p>Upload a CT scan image here for analysis.</p>
        </div>

        <div className="analyze-card">
          <label className="upload-box">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <div>
              <h3>Upload CT Scan Image</h3>
              <p>Click here to choose an image file</p>
            </div>
          </label>

          {previewUrl && (
            <div className="preview-section">
              <h3>Preview</h3>
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <p className="file-name">{selectedImage?.name}</p>

              <button
                className="primary-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          {result && (
            <div className="result-card">
              <h2>Analysis Result</h2>
              <p>
                <strong>Prediction:</strong>{" "}
                {getReadableLabel(result.predicted_class)}
              </p>
              <p>
                <strong>Confidence:</strong> {result.confidence}%
              </p>
              <p>
                <strong>Risk Level:</strong> {result.risk_level}
              </p>
              <p>
                <strong>Suggestion:</strong> {result.suggestion}
              </p>

              <div className="probability-box">
                <h3>Other Probabilities</h3>
                {result.other_probabilities &&
                  Object.entries(result.other_probabilities).map(([key, value]) => (
                    <p key={key}>
                      {getReadableLabel(key)}: {value}%
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Analyze;