protectPage();

const token =
  localStorage.getItem(
    "token"
  );

async function loadDashboard() {
  try {
    const response =
      await fetch(
        `${API}/dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    console.log(
      "Dashboard Data:",
      data
    );

    if (!data.success) {
      return alert(
        data.message
      );
    }

    // =====================
    // Dashboard Cards
    // =====================
    document.getElementById(
      "totalUsers"
    ).innerText =
      data.totalUsers;

    document.getElementById(
      "totalProducts"
    ).innerText =
      data.totalProducts;

    document.getElementById(
      "totalOrders"
    ).innerText =
      data.totalOrders;

    document.getElementById(
      "totalRevenue"
    ).innerText =
      `₹${data.totalRevenue}`;

    // =====================
    // Orders Table
    // =====================
    renderOrders(
      data.recentOrders || []
    );

    // =====================
    // Products Table
    // =====================
    renderProducts(
      data.products || []
    );
  } catch (error) {
    console.log(
      "Dashboard Error:",
      error
    );
  }
}

// ====================================
// Render Orders
// ====================================
function renderOrders(
  orders
) {
  const tbody =
    document.getElementById(
      "recentOrders"
    );

  if (
    orders.length === 0
  ) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          No Orders Found
        </td>
      </tr>
    `;
    return;
  }

  let html = "";

  orders.forEach(
    (order) => {
      html += `
      <tr>

        <td>
          ${order._id.slice(-6)}
        </td>

        <td>
          ${
            order.user?.name ||
            "Guest"
          }
        </td>

        <td>
          ₹${order.totalAmount}
        </td>

        <td>
          ${order.orderStatus}
        </td>

      </tr>
      `;
    }
  );

  tbody.innerHTML =
    html;
}

// ====================================
// Render Products
// ====================================
function renderProducts(products) {
  const tbody =
    document.getElementById(
      "productsTable"
    );

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          No Products Found
        </td>
      </tr>
    `;
    return;
  }

  let html = "";

  products.forEach((product) => {
    const stock =
      product.stock || 0;

    let status = "";
    let badge = "";

    if (stock === 0) {
      status =
        "Out of Stock";
      badge =
        "bg-danger";
    } else if (stock < 10) {
      status =
        "Low Stock";
      badge =
        "bg-warning";
    } else {
      status =
        "In Stock";
      badge =
        "bg-success";
    }

    html += `
      <tr>

        <td>
          <div class="d-flex align-items-center">

            <img
              src="${
                product.mainImage ||
                'https://via.placeholder.com/60'
              }"
              class="rounded me-3"
              width="60"
              height="60"
            >

            <div>

              <div class="fw-bold">
                ${product.name}
              </div>

              <small class="text-muted">
                SKU:
                ${product.sku}
              </small>

              <br>

              <small class="text-primary">
                ${
                  product.category
                    ?.name ||
                  "No Category"
                }
              </small>

            </div>

          </div>
        </td>

        <td>
          ${stock} Units
        </td>

        <td>
          ${
            product.salePrice > 0
              ? `
              <div class="text-decoration-line-through text-muted">
                ₹${product.price}
              </div>

              <div class="fw-bold text-danger">
                ₹${product.salePrice}
              </div>
            `
              : `
              <div class="fw-bold">
                ₹${product.price}
              </div>
            `
          }
        </td>

        <td>
          <span class="badge ${badge}">
            ${status}
          </span>
        </td>

        <td>

          <button
            class="btn btn-sm btn-info me-2"
            onclick="viewProduct('${product._id}')"
          >
            <i class="fas fa-eye"></i>
          </button>

          <button
            class="btn btn-sm btn-warning me-2"
            onclick="editProduct('${product._id}')"
          >
            <i class="fas fa-edit"></i>
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="deleteProduct('${product._id}')"
          >
            <i class="fas fa-trash"></i>
          </button>

        </td>

      </tr>
    `;
  });

  tbody.innerHTML =
    html;
}


// ====================================
// Edit Product
// ====================================
function editProduct(
  productId
) {
  window.location.href =
    `edit-product.html?id=${productId}`;
}

// ====================================
// Delete Product
// ====================================
async function deleteProduct(
  productId
) {
  const confirmDelete =
    confirm(
      "Delete this product?"
    );

  if (
    !confirmDelete
  )
    return;

  try {
    const response =
      await fetch(
        `${API}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    alert(data.message);

    loadDashboard();
  } catch (error) {
    console.log(error);
  }
}

// ====================================
// Logout
// ====================================
function logout() {
  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "admin"
  );

  window.location.href =
    "login.html";
}

// ====================================
// Start Dashboard
// ====================================
loadDashboard();