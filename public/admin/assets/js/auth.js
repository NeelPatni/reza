function getToken() {
  return localStorage.getItem("token");
}

function protectPage() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");

  window.location.href = "login.html";
}