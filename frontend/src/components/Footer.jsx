import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">KDT Solar</h3>
            <p className="footer-description">
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <p className="footer-text">Email: info@kdtsolar.com</p>
            <p className="footer-text">Phone: (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                Twitter
              </a>
              <a href="#" className="social-link">
                LinkedIn
              </a>
              <a href="#" className="social-link">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} KDT Solar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}