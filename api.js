// =============================================
//   js/api.js - API Helper Functions
//   All frontend-to-backend communication goes
//   through these helper functions
// =============================================

// The base URL of your backend server
// Change this if you deploy to a different host
const BASE_URL = "http://localhost:5000";

// -----------------------------------------------
//   apiPost(endpoint, data)
//   Sends a POST request with JSON body
//   Used for: login, register, book appointment, etc.
// -----------------------------------------------
const apiPost = async (endpoint, data) => {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };

  // If user is logged in, attach the JWT token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();

  // If the server returned an error status, throw it
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// -----------------------------------------------
//   apiGet(endpoint)
//   Sends a GET request
//   Used for: fetching appointments, doctors, etc.
// -----------------------------------------------
const apiGet = async (endpoint) => {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// -----------------------------------------------
//   apiPut(endpoint, data)
//   Sends a PUT request (update existing data)
//   Used for: updating status, profile, etc.
// -----------------------------------------------
const apiPut = async (endpoint, data) => {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// -----------------------------------------------
//   apiDelete(endpoint)
//   Sends a DELETE request
//   Used for: admin deleting users, etc.
// -----------------------------------------------
const apiDelete = async (endpoint) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};
