const token = localStorage.getItem("token");

// 🔒 Protect page
if (!token) {
  window.location.href = "login.html";
}

// 👤 Get admin info
const admin = JSON.parse(localStorage.getItem("admin"));

// Show admin name (optional)
console.log("Logged in Admin:", admin);