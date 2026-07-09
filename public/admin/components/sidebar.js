document.getElementById("sidebar").innerHTML = `
  <div class="logo">Admin Panel</div>

  <a href="dashboard.html">Dashboard</a>
  <a href="categories.html">Categories</a>
  <a href="products.html">Products</a>
  <a href="orders.html">Orders</a>
  <a href="users.html">Users</a>

  <a onclick="logout()">Logout</a>
`;