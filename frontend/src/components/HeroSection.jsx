import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Lung Cancer Detection and Classification Using Deep Learning</h1>
        <p>
          A professional web-based system for analyzing lung scan images,
          predicting cancer class, showing confidence percentage, and providing
          medical guidance for further action.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/analyze")}>
            Analyze CT Scan
          </button>
          <button className="secondary-btn" onClick={() => navigate("/about")}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;