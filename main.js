// =============================================
//   js/main.js - Homepage Logic
// =============================================

// When the page loads, check if user is already logged in
// and update the nav buttons accordingly
window.addEventListener("DOMContentLoaded", () => {
  const user     = getUser ? getUser() : null;
  const navAuth  = document.getElementById("navAuth");

  if (user && navAuth) {
    // Replace Login/Register buttons with user name + logout
    navAuth.innerHTML = `
      <span style="font-weight:600; color:var(--primary);">
        Hi, ${user.name.split(" ")[0]}!
      </span>
      <a href="pages/${user.role}-dashboard.html" class="btn btn-outline">Dashboard</a>
      <button class="btn btn-danger" onclick="logout()" style="padding:8px 16px;">Logout</button>
    `;
  }
});
