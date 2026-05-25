// =============================================
//   js/auth.js - Authentication Utilities
//   Shared functions used across all pages
// =============================================

// -----------------------------------------------
//   getUser()
//   Returns the currently logged-in user object
//   from localStorage, or null if not logged in
// -----------------------------------------------
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// -----------------------------------------------
//   isLoggedIn()
//   Returns true if user is logged in
// -----------------------------------------------
const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// -----------------------------------------------
//   logout()
//   Clears all auth data and redirects to login
// -----------------------------------------------
const logout = () => {
  // Redirect to the logout page which clears data and shows a message
  window.location.href = "logout.html";
};

// -----------------------------------------------
//   requireAuth(role)
//   Redirects to login if user is not logged in,
//   or to home if they don't have the right role.
//   Call this at the top of protected pages.
//   Usage: requireAuth("patient") or requireAuth("admin")
// -----------------------------------------------
const requireAuth = (role = null) => {
  if (!isLoggedIn()) {
    window.location.href = "/pages/login.html";
    return;
  }

  if (role) {
    const user = getUser();
    if (user.role !== role) {
      alert("Access denied. You don't have permission to view this page.");
      window.location.href = "/index.html";
    }
  }
};

// -----------------------------------------------
//   showAlert(message, type)
//   Shows an alert box on the page.
//   type = "success" or "error"
// -----------------------------------------------
const showAlert = (message, type = "success") => {
  const alertBox = document.getElementById("alertBox");
  if (!alertBox) return;

  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.style.display = "block";

  // Auto-hide after 4 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
};

// -----------------------------------------------
//   formatDate(dateString)
//   Converts "2024-06-15T00:00:00Z" to "15 Jun 2024"
// -----------------------------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
