const token = localStorage.getItem("token");

const tableBody =
document.getElementById("ordersTable");

const totalOrders =
document.getElementById("totalOrders");

let orders = [];
let filteredOrders = [];
let statusModal;


// ==============================
// Load Orders
// ==============================

async function loadOrders() {

    try {

        tableBody.innerHTML = `

<tr>

<td colspan="7" class="text-center py-5">

<div class="spinner-border text-primary"></div>

<p class="mt-3">Loading Orders...</p>

</td>

</tr>

`;

        const response =
        await fetch(`${API}/orders`, {

            headers:{

                Authorization:`Bearer ${token}`

            }

        });

        const data =
        await response.json();

        console.log(data);

        if(!data.success){

            alert(data.message);

            return;

        }

        orders =
        data.orders;

        filteredOrders =
        [...orders];

        renderOrders();

    }

    catch(error){

        console.log(error);

    }

}



// ==============================
// Render Orders
// ==============================

function renderOrders(){

totalOrders.innerHTML =
`${filteredOrders.length} Orders`;

if(filteredOrders.length===0){

tableBody.innerHTML=

`

<tr>

<td colspan="7" class="text-center py-5">

No Orders Found

</td>

</tr>

`;

return;

}

tableBody.innerHTML="";

filteredOrders.forEach(order=>{

tableBody.innerHTML+=`

<tr>

<td>

<strong>

${order.orderNumber || order._id.slice(-6)}

</strong>

</td>

<td>

<strong>

${order.shippingAddress.fullName}

</strong>

<br>

<small class="text-muted">

${order.shippingAddress.phone}

</small>

</td>

<td>

₹${order.totalAmount}

</td>

<td>

${paymentBadge(order.paymentStatus)}

</td>

<td>

${statusBadge(order.orderStatus)}

</td>

<td>

${new Date(order.createdAt)
.toLocaleDateString()}

</td>

<td>

<button

class="btn btn-sm btn-primary me-2"

onclick="viewOrder('${order._id}')"

>

<i class="fas fa-eye"></i>

</button>

<button

class="btn btn-sm btn-warning me-2"

onclick="changeStatus('${order._id}')"

>

<i class="fas fa-edit"></i>

</button>

<button

class="btn btn-sm btn-danger"

onclick="deleteOrder('${order._id}')"

>

<i class="fas fa-trash"></i>

</button>

</td>

</tr>

`;

});

}



// ==============================
// Payment Badge
// ==============================

function paymentBadge(status) {

  switch (status) {

    case "Paid":
      return `<span class="badge bg-success">Paid</span>`;

    case "Pending":
      return `<span class="badge bg-warning text-dark">Pending</span>`;

    case "Failed":
      return `<span class="badge bg-danger">Failed</span>`;

    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }

}



// ==============================
// Order Status Badge
// ==============================

function statusBadge(status) {

  switch (status) {

    case "Pending":
      return `<span class="badge bg-warning text-dark">Pending</span>`;

    case "Processing":
      return `<span class="badge bg-info">Processing</span>`;

    case "Shipped":
      return `<span class="badge bg-primary">Shipped</span>`;

    case "Delivered":
      return `<span class="badge bg-success">Delivered</span>`;

    case "Cancelled":
      return `<span class="badge bg-danger">Cancelled</span>`;

    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }

}


loadOrders();



// ========================================
// Search
// ========================================
document
  .getElementById("searchInput")
  .addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    filteredOrders = orders.filter((order) => {

      return (
        order.orderNumber
          ?.toLowerCase()
          .includes(keyword) ||

        order.user?.name
          ?.toLowerCase()
          .includes(keyword) ||

        order.user?.email
          ?.toLowerCase()
          .includes(keyword)
      );

    });

    currentPage = 1;

    renderOrders();

  });


// ========================================
// Status Filter
// ========================================
document
  .getElementById("statusFilter")
  .addEventListener("change", function () {

    const status = this.value;

    if (!status) {

      filteredOrders = [...orders];

    } else {

      filteredOrders = orders.filter(
        order => order.orderStatus === status
      );

    }

    currentPage = 1;

    renderOrders();

  });


// ========================================
// Reset Filters
// ========================================
function resetFilters() {

  document.getElementById("searchInput").value = "";

  document.getElementById("statusFilter").value = "";

  filteredOrders = [...orders];

  currentPage = 1;

  renderOrders();

}


// ========================================
// Pagination
// ========================================
function renderPagination() {

  const pagination =
    document.getElementById("pagination");

  pagination.innerHTML = "";

  const totalPages =
    Math.ceil(filteredOrders.length / perPage);

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {

    pagination.innerHTML += `
      <li class="page-item ${currentPage === i ? "active" : ""}">

        <button
          class="page-link"
          onclick="changePage(${i})"
        >
          ${i}
        </button>

      </li>
    `;

  }

}

function changePage(page) {

  currentPage = page;

  renderOrders();

}


// ========================================
// Delete Order
// ========================================
async function deleteOrder(id) {

  if (!confirm("Delete this order?")) return;

  try {

    const response = await fetch(
      `${API}/orders/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    alert(data.message);

    loadOrders();

  }

  catch (err) {

    console.log(err);

  }

}


// ========================================
// Update Order Status
// ========================================
async function updateStatus(id, status) {

  try {

    const response = await fetch(
      `${API}/orders/${id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          orderStatus: status,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      loadOrders();

    } else {

      alert(data.message);

    }

  }

  catch (err) {

    console.log(err);

  }

}


// ========================================
// View Order
// ========================================
function viewOrder(id) {

  window.location.href =
    `view-order.html?id=${id}`;

}


// ========================================
// Load Data
// ========================================
loadOrders();

// ============================
// View Order
// ============================

async function viewOrder(id) {
  try {
    const response = await fetch(`${API}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    const order = data.order;

    let itemsHtml = "";

    order.orderItems.forEach((item) => {
      itemsHtml += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${item.quantity * item.price}</td>
        </tr>
      `;
    });

    document.getElementById("modalBody").innerHTML = `
      <div class="row">

        <div class="col-md-6 mb-3">
          <strong>Order Number</strong><br>
          ${order.orderNumber}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Date</strong><br>
          ${new Date(order.createdAt).toLocaleString()}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Customer</strong><br>
          ${order.user?.name || ""}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Email</strong><br>
          ${order.user?.email || ""}
        </div>

        <div class="col-md-12 mb-3">
          <strong>Shipping Address</strong><br>

          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.phone}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city},
          ${order.shippingAddress.state}
          ${order.shippingAddress.pincode}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Payment</strong><br>
          ${order.paymentMethod}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Payment Status</strong><br>
          ${order.paymentStatus}
        </div>

      </div>

      <hr>

      <h5>Products</h5>

      <table class="table table-bordered">

        <thead>

          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>

        </thead>

        <tbody>

          ${itemsHtml}

        </tbody>

      </table>

      <h4 class="text-end">
        Grand Total :
        ₹${order.totalAmount}
      </h4>
    `;

    new bootstrap.Modal(
      document.getElementById("orderModal")
    ).show();

  } catch (err) {
    console.log(err);
  }
}


// =========================
// Delete Order
// =========================
async function deleteOrder(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${API}/orders/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (data.success) {

            alert(data.message);

            loadOrders();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

}


// =========================
// View Order
// =========================
function viewOrder(id) {

    window.location.href =
        `order-details.html?id=${id}`;

}


// =========================
// Format Date
// =========================
function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}


// =========================
// Currency
// =========================
function formatPrice(price) {

    return `₹${Number(price).toLocaleString("en-IN")}`;

}


// =========================
// Initial Load
// =========================
loadOrders();



// ==============================
// Load Order Items
// ==============================

function loadOrderItems(items) {

    let html = "";

    items.forEach(item => {

        html += `
        <tr>

            <td>
                <img
                    src="${item.image}"
                    width="60"
                    height="60"
                    style="object-fit:cover;border-radius:8px;"
                >
            </td>

            <td>
                ${item.name}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ₹${item.price}
            </td>

            <td>
                ₹${item.price * item.quantity}
            </td>

        </tr>
        `;

    });

    document.getElementById("orderItemsTable").innerHTML = html;

}

document.addEventListener("DOMContentLoaded", () => {

    statusModal = new bootstrap.Modal(
        document.getElementById("statusModal")
    );

});

// ==============================
// Open Status Modal
// ==============================

function changeStatus(orderId) {

    document.getElementById("statusOrderId").value =
        orderId;

    document.getElementById("newOrderStatus").value =
        "Pending";

    statusModal.show();

}

// ==============================
// Update Order Status
// ==============================

async function updateOrderStatus() {

    const orderId =
        document.getElementById("statusOrderId").value;

    const orderStatus =
        document.getElementById("newOrderStatus").value;

    try {

        const response = await fetch(

            `${API}/orders/${orderId}/status`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    orderStatus

                })

            }

        );

        const data = await response.json();

        if (!data.success) {

            return alert(data.message);

        }

        alert("Order Status Updated Successfully");

        statusModal.hide();

        loadOrders();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong");

    }

}