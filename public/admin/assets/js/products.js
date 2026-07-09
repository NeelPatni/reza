protectPage();

const token =
  localStorage.getItem(
    "token"
  );

let currentPage = 1;

let keyword = "";
let category = "";
let status = "";


// ======================
// GET PRODUCTS
// ======================

async function getProducts(
  page = 1
) {
  try {
    currentPage = page;

    const url =
      `${API}/products?page=${page}&keyword=${keyword}&category=${category}&status=${status}`;

    console.log(url);

    const response =
      await fetch(url, {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

    console.log(
      "Status:",
      response.status
    );

    const data =
      await response.json();

    console.log(
      "Products Data:",
      data
    );

    if (!data.success) {
      return alert(
        data.message
      );
    }

    const count =
      document.getElementById(
        "totalProductsCount"
      );

    if (count) {
      count.innerText =
        `${data.totalProducts} Products`;
    }

    renderProducts(
      data.products
    );

    renderPagination(
      data.totalPages,
      page
    );
  } catch (error) {
    console.log(
      "PRODUCT ERROR:",
      error
    );
  }
}

// ======================
// PRODUCTS TABLE
// ======================

function renderProducts(
  products
) {
  const tbody =
    document.getElementById(
      "productsTable"
    );

  if (
    products.length === 0
  ) {
    tbody.innerHTML = `
      <tr>
        <td
          colspan="6"
          class="text-center p-5"
        >
          No Products Found
        </td>
      </tr>
    `;
    return;
  }

  let html = "";

  products.forEach(
    (product) => {
      const stock =
        product.stock || 0;

      let stockBadge =
        "";

      if (stock === 0) {
        stockBadge =
          `<span class="badge bg-danger">
            Out Of Stock
          </span>`;
      } else if (
        stock < 10
      ) {
        stockBadge =
          `<span class="badge bg-warning text-dark">
            Low Stock
          </span>`;
      } else {
        stockBadge =
          `<span class="badge bg-success">
            In Stock
          </span>`;
      }

      html += `
      <tr>

        <td>
          <img
            src="${
              product.mainImage ||
              "https://via.placeholder.com/70"
            }"
            width="70"
            class="rounded"
          >
        </td>

        <td>

          <div
            class="fw-bold"
          >
            ${product.name}
          </div>

          <small
            class="text-muted"
          >
            SKU :
            ${product.sku}
          </small>

          <br>

          <small
            class="text-primary"
          >
            ${
              product
                .category
                ?.name ||
              "No Category"
            }
          </small>

        </td>

        <td>

          ${
            product.salePrice >
            0
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
          ${stock}
          Units
        </td>

        <td>
          ${stockBadge}
        </td>

        <td>

          <button
            class="btn btn-info btn-sm me-2"
            onclick="viewProduct('${product._id}')"
          >
            <i class="fas fa-eye"></i>
          </button>

          <button
            class="btn btn-warning btn-sm me-2"
            onclick="editProduct('${product._id}')"
          >
            <i class="fas fa-edit"></i>
          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteProduct('${product._id}')"
          >
            <i class="fas fa-trash"></i>
          </button>

        </td>

      </tr>
      `;
    }
  );

  tbody.innerHTML =
    html;
}


// ======================
// PAGINATION
// ======================

function renderPagination(
  totalPages,
  currentPage
) {
  const pagination =
    document.getElementById(
      "pagination"
    );

  let html = "";

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {
    html += `
      <li
        class="page-item
        ${
          i === currentPage
            ? "active"
            : ""
        }"
      >
        <button
          class="page-link"
          onclick="getProducts(${i})"
        >
          ${i}
        </button>
      </li>
    `;
  }

  pagination.innerHTML =
    html;
}


// ======================
// SEARCH
// ======================

document
  .getElementById(
    "searchInput"
  )
  .addEventListener(
    "keyup",
    (e) => {
      keyword =
        e.target.value;

      getProducts(1);
    }
  );


// ======================
// CATEGORY FILTER
// ======================

document
  .getElementById(
    "categoryFilter"
  )
  .addEventListener(
    "change",
    (e) => {
      category =
        e.target.value;

      getProducts(1);
    }
  );


// ======================
// STATUS FILTER
// ======================

document
  .getElementById(
    "statusFilter"
  )
  .addEventListener(
    "change",
    (e) => {
      status =
        e.target.value;

      getProducts(1);
    }
  );


// ======================
// LOAD CATEGORY
// ======================

async function loadCategories() {
  try {
    const response =
      await fetch(
        `${API}/categories`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    const select =
      document.getElementById(
        "categoryFilter"
      );

    data.categories.forEach(
      (cat) => {
        select.innerHTML += `
          <option
            value="${cat._id}"
          >
            ${cat.name}
          </option>
        `;
      }
    );
  } catch (error) {
    console.log(error);
  }
}


// ======================
// DELETE
// ======================

async function deleteProduct(
  id
) {
  const yes =
    confirm(
      "Delete Product ?"
    );

  if (!yes) return;

  await fetch(
    `${API}/products/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  getProducts(
    currentPage
  );
}


// ======================
// VIEW
// ======================

function viewProduct(id) {
  location.href =
    `product-details.html?id=${id}`;
}


// ======================
// EDIT
// ======================

function editProduct(id) {
  location.href =
    `edit-product.html?id=${id}`;
}


loadCategories();
getProducts();