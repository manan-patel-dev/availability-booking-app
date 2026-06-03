import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="app-page">
      <section className="page-shell narrow-shell">
        <div className="panel center-panel">
          <p className="page-kicker">404</p>
          <h1>Page Not Found</h1>
          <p className="page-description">
            The page you are looking for does not exist or the link is invalid.
          </p>
          <Link className="primary-button link-button" to="/">
            Back to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
