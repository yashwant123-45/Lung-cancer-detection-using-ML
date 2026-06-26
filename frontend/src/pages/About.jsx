import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <section className="page-section">
        <div className="page-header">
          <h1>About the Project</h1>
          <p>
            This project is a deep learning based web application developed for
            lung cancer detection and classification using medical scan images.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h3>Project Objective</h3>
            <p>
              To build an intelligent system that can analyze uploaded scan
              images and classify them into different lung cancer categories
              with confidence scores.
            </p>
          </div>

          <div className="about-card">
            <h3>Classes Used</h3>
            <p>
              The model predicts among four classes: Adenocarcinoma, Large Cell
              Carcinoma, Squamous Cell Carcinoma, and Normal.
            </p>
          </div>

          <div className="about-card">
            <h3>Technologies</h3>
            <p>
              React.js, Flask, TensorFlow, MobileNetV2, MongoDB, Python, and
              image preprocessing techniques are used in this system.
            </p>
          </div>

          <div className="about-card">
            <h3>Disclaimer</h3>
            <p>
              This system is intended for educational and research purposes
              only. It does not replace professional medical diagnosis.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;