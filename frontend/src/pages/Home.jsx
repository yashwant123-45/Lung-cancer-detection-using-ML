import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />

      <section className="info-section">
        <h2>Why Early Detection Matters</h2>
        <p>
          Early analysis of lung scan images can support faster clinical review
          and improve the chances of timely diagnosis. This system is designed
          to assist in the classification of lung cancer image patterns using
          deep learning techniques.
        </p>
      </section>

      <section className="feature-section">
        <div className="feature-card">
          <h3>Image Upload</h3>
          <p>
            Upload scan images through a clean and simple interface for instant
            analysis.
          </p>
        </div>

        <div className="feature-card">
          <h3>4-Class Prediction</h3>
          <p>
            The model classifies images into Adenocarcinoma, Large Cell
            Carcinoma, Squamous Cell Carcinoma, and Normal.
          </p>
        </div>

        <div className="feature-card">
          <h3>Confidence Report</h3>
          <p>
            Each analysis provides confidence percentage, risk level, and
            suggested next step.
          </p>
        </div>

        <div className="feature-card">
          <h3>History Tracking</h3>
          <p>
            All predictions are saved in the database for future review and
            comparison.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;