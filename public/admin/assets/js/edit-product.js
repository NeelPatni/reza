const token = localStorage.getItem("token");

const productId = new URLSearchParams(window.location.search).get("id");

const productForm = document.getElementById("productForm");
const categorySelect = document.getElementById("category");
const sizesContainer = document.getElementById("sizesContainer");
const addSizeBtn = document.getElementById("addSizeBtn");

if (!productId) {
    alert("Product ID not found.");
    window.location.href = "products.html";
}

  // ==========================
  // FETCH CATEGORIES
  // ==========================
  const fetchCategories =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API}/categories`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "Categories:",
          data
        );

        categorySelect.innerHTML =
          `<option value="">Select Category</option>`;

        if (
          data.success &&
          data.categories
            .length
        ) {
          data.categories.forEach(
            (cat) => {
              const option =
                document.createElement(
                  "option"
                );

              option.value =
                cat._id;

              option.textContent =
                cat.name;

              categorySelect.appendChild(
                option
              );
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  fetchCategories();

// This fetches one product from MongoDB.

async function loadProduct() {

    try {

        const response = await fetch(`${API}/products/${productId}`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const product = data.product;

        document.getElementById("name").value = product.name;

        document.getElementById("sku").value = product.sku;

        document.getElementById("description").value = product.description;

        document.getElementById("price").value = product.price;

        document.getElementById("salePrice").value = product.salePrice;

        document.getElementById("featured").checked = product.featured;

        document.getElementById("status").value = product.status;

        await loadCategories(product.category._id);

        loadSizes(product.sizes);

    }

    catch (err) {

        console.log(err);

    }

}

// Now create the size loader.

function loadSizes(sizes) {

    sizesContainer.innerHTML = "";

    sizes.forEach(size => {

        const row = document.createElement("div");

        row.className = "row g-2 mb-3 size-row";

        row.innerHTML = `

<div class="col-md-5">

<select class="form-select size">

<option value="">Select Size</option>

<option ${size.size=="XS"?"selected":""}>XS</option>

<option ${size.size=="S"?"selected":""}>S</option>

<option ${size.size=="M"?"selected":""}>M</option>

<option ${size.size=="L"?"selected":""}>L</option>

<option ${size.size=="XL"?"selected":""}>XL</option>

<option ${size.size=="XXL"?"selected":""}>XXL</option>

<option ${size.size=="Free Size"?"selected":""}>Free Size</option>

</select>

</div>

<div class="col-md-5">

<input

type="number"

class="form-control quantity"

value="${size.quantity}"

>

</div>

<div class="col-md-2">

<button

type="button"

class="btn btn-danger removeBtn"

>

<i class="fas fa-trash"></i>

</button>

</div>

`;

        sizesContainer.appendChild(row);

    });

}



// Load everything automatically.

loadProduct();

// Add Size Button

addSizeBtn.addEventListener("click", () => {

    const row = document.createElement("div");

    row.className = "row g-2 mb-3 size-row";

    row.innerHTML = `

<div class="col-md-5">

<select class="form-select size">

<option value="">Select Size</option>

<option>XS</option>

<option>S</option>

<option>M</option>

<option>L</option>

<option>XL</option>

<option>XXL</option>

<option>Free Size</option>

</select>

</div>

<div class="col-md-5">

<input
type="number"
class="form-control quantity"
placeholder="Quantity">

</div>

<div class="col-md-2">

<button
type="button"
class="btn btn-danger removeBtn">

<i class="fas fa-trash"></i>

</button>

</div>

`;

    sizesContainer.appendChild(row);

});

// Remove Size

sizesContainer.addEventListener("click", (e) => {

    if (e.target.closest(".removeBtn")) {

        e.target.closest(".size-row").remove();

    }

});

// Submit Update Form


productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);

    formData.append("sku", document.getElementById("sku").value);

    formData.append("category", document.getElementById("category").value);

    formData.append("description", document.getElementById("description").value);

    formData.append("price", document.getElementById("price").value);

    formData.append("salePrice", document.getElementById("salePrice").value);

    formData.append("featured", document.getElementById("featured").checked);

    formData.append("status", document.getElementById("status").value);

    const sizes = [];

    document.querySelectorAll(".size-row").forEach((row) => {

        const size = row.querySelector(".size").value;

        const quantity = row.querySelector(".quantity").value;

        if (size && quantity) {

            sizes.push({

                size,

                quantity

            });

        }

    });

    formData.append("sizes", JSON.stringify(sizes));

    if (document.getElementById("mainImage").files.length > 0) {

        formData.append(
            "mainImage",
            document.getElementById("mainImage").files[0]
        );

    }

    ["subImage1", "subImage2", "subImage3", "subImage4"].forEach(id => {

        const file = document.getElementById(id).files[0];

        if (file) {

            formData.append("subImages", file);

        }

    });

    if (document.getElementById("productVideo").files.length > 0) {

        formData.append(
            "productVideo",
            document.getElementById("productVideo").files[0]
        );

    }

    try {

        const response = await fetch(`${API}/products/${productId}`, {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await response.json();

        if (data.success) {

            alert("Product Updated Successfully");

            window.location.href = "products.html";

        }

        else {

            alert(data.message);

        }

    }

    catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

});