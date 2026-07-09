
const token = localStorage.getItem("token");

const tableBody = document.getElementById("categoryTable");
const totalCount = document.getElementById("totalCategory");


let categories = [];
let filteredCategories = [];

// =========================
// Load Categories
// =========================
async function loadCategories() {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          Loading...
        </td>
      </tr>
    `;

   const response = await fetch(`${API}/categories`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log(response);

const data = await response.json();

console.log(data);

if (!data.success) {
  alert(data.message);
  return;
}

categories = data.categories;
filteredCategories = [...categories];

renderCategories();
  } catch (err) {
    console.log(err);
  }
}

// =========================
// Render Table
// =========================
function renderCategories() {
  totalCount.innerHTML =
    `${filteredCategories.length} Categories`;

  if (filteredCategories.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          No Categories Found
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";

  filteredCategories.forEach((category) => {
    tableBody.innerHTML += `
      <tr>

        <td>
          ${
            category.image
              ? `<img src="${category.image}"
                     width="70"
                     height="70"
                     style="object-fit:cover;border-radius:10px;">`
              : `<div style="
                    width:70px;
                    height:70px;
                    background:#eee;
                    border-radius:10px;
                    display:flex;
                    align-items:center;
                    justify-content:center;">
                    No Image
                 </div>`
          }
        </td>

        <td>
          <strong>${category.name}</strong>
          <br>
          <small class="text-muted">
            ${category.slug}
          </small>
        </td>

        <td>
          ${
            category.status === "active"
              ? `<span class="badge bg-success">
                    Active
                 </span>`
              : `<span class="badge bg-danger">
                    Inactive
                 </span>`
          }
        </td>

        <td>
          ${new Date(
            category.createdAt
          ).toLocaleDateString()}
        </td>

        <td>

          <button
            class="btn btn-sm btn-warning me-2"
            onclick="editCategory('${category._id}')"
          >
            <i class="fas fa-edit"></i>
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="deleteCategory('${category._id}')"
          >
            <i class="fas fa-trash"></i>
          </button>

        </td>

      </tr>
    `;
  });
}

// =========================
// Search
// =========================
document
  .getElementById("searchInput")
  .addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();

    filteredCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(keyword)
    );

    renderCategories();
  });

// =========================
// Status Filter
// =========================
document
  .getElementById("statusFilter")
  .addEventListener("change", function () {

    const status = this.value;

    if (!status) {
      filteredCategories = [...categories];
    } else {
      filteredCategories = categories.filter(
        (cat) => cat.status === status
      );
    }

    renderCategories();
  });

// =========================
// Reset Filters
// =========================
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("statusFilter").value = "";

  filteredCategories = [...categories];

  renderCategories();
}

// =========================
// Delete
// =========================
async function deleteCategory(id) {

  if (!confirm("Delete this category?")) return;

  try {

    const response = await fetch(
      `${API}/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    loadCategories();

  } catch (err) {
    console.log(err);
  }
}

// =========================
// Edit
// =========================
function editCategory(id) {
  window.location.href =
    `edit-category.html?id=${id}`;
}

// =========================
loadCategories();