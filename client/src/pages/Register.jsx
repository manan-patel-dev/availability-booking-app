import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const getPasswordRules = (password) => [
  {
    id: "length",
    label: "Minimum 8 characters",
    isValid: password.length >= 8,
  },
  {
    id: "uppercase",
    label: "1 uppercase letter",
    isValid: /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "1 lowercase letter",
    isValid: /[a-z]/.test(password),
  },
  {
    id: "special",
    label: "1 special character",
    isValid: /[^A-Za-z0-9]/.test(password),
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRules = getPasswordRules(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validateForm = () => {
    const nextErrors = { name: "", email: "", password: "", submit: "" };

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    } else if (form.name.trim().length > 50) {
      nextErrors.name = "Name must be 50 characters or less.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const isPasswordValid = passwordRules.every((rule) => rule.isValid);

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (!isPasswordValid) {
      nextErrors.password = "Please complete all password requirements.";
    }

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-brand">Availability Booking</div>
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p className="auth-note">
            Register to manage availability and booking links with ease.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={50}
              value={form.name}
              onChange={handleChange}
              className="auth-input"
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby="name-error"
            />
            <span id="name-error" className="auth-error">
              {errors.name}
            </span>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="auth-input"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby="email-error"
            />
            <span id="email-error" className="auth-error">
              {errors.email}
            </span>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              placeholder="Minimum 8 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-error password-rules"
            />
            {form.password && (
              <ul id="password-rules" className="password-rules">
                {passwordRules.map((rule) => (
                  <li key={rule.id} className={rule.isValid ? "is-valid" : ""}>
                    <span className="password-rule-icon" aria-hidden="true">
                      {rule.isValid ? "✓" : "•"}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
            <span id="password-error" className="auth-error">
              {errors.password}
            </span>
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <span className="auth-error auth-submit" role="alert">
            {errors.submit}
          </span>
        </form>

        <div className="auth-footer">
          Already registered?{" "}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
