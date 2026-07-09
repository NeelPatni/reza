document.addEventListener("DOMContentLoaded", () => {
  const productForm =
    document.getElementById("productForm");

  const addSizeBtn =
    document.getElementById("addSizeBtn");

  const sizesContainer =
    document.getElementById(
      "sizesContainer"
    );

  const categorySelect =
    document.getElementById(
      "category"
    );

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

  // ==========================
  // ADD SIZE
  // ==========================
  addSizeBtn.addEventListener(
    "click",
    () => {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "row g-2 mb-3 size-row";

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
            placeholder="Quantity"
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

      sizesContainer.appendChild(
        row
      );
    }
  );

  // ==========================
  // REMOVE SIZE
  // ==========================
  sizesContainer.addEventListener(
    "click",
    (e) => {
      if (
        e.target.closest(
          ".removeBtn"
        )
      ) {
        e.target
          .closest(".size-row")
          .remove();
      }
    }
  );

  // ==========================
  // SUBMIT PRODUCT
  // ==========================
  productForm.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const formData =
          new FormData();

        formData.append(
          "name",
          document.getElementById(
            "name"
          ).value
        );

        formData.append(
          "sku",
          document.getElementById(
            "sku"
          ).value
        );

        formData.append(
          "category",
          document.getElementById(
            "category"
          ).value
        );

        formData.append(
          "description",
          document.getElementById(
            "description"
          ).value
        );

        formData.append(
          "price",
          document.getElementById(
            "price"
          ).value
        );

        formData.append(
          "salePrice",
          document.getElementById(
            "salePrice"
          ).value
        );

        formData.append(
          "featured",
          document.getElementById(
            "featured"
          ).checked
        );

        formData.append(
          "status",
          document.getElementById(
            "status"
          ).value
        );

        // ===================
        // Sizes
        // ===================
        const sizes = [];

        document
          .querySelectorAll(
            ".size-row"
          )
          .forEach((row) => {
            const size =
              row.querySelector(
                ".size"
              ).value;

            const quantity =
              row.querySelector(
                ".quantity"
              ).value;

            if (
              size &&
              quantity
            ) {
              sizes.push({
                size,
                quantity:
                  Number(
                    quantity
                  ),
              });
            }
          });

        formData.append(
          "sizes",
          JSON.stringify(
            sizes
          )
        );

        // ===================
        // Main Image
        // ===================
        const mainImage =
          document.getElementById(
            "mainImage"
          ).files[0];

        if (mainImage) {
          formData.append(
            "mainImage",
            mainImage
          );
        }

        // ===================
        // Sub Images
        // ===================
        [
          "subImage1",
          "subImage2",
          "subImage3",
          "subImage4",
        ].forEach((id) => {
          const file =
            document.getElementById(
              id
            ).files[0];

          if (file) {
            formData.append(
              "subImages",
              file
            );
          }
        });

        // ===================
        // Product Video
        // ===================
        const productVideo =
          document.getElementById(
            "productVideo"
          ).files[0];

        if (productVideo) {
          formData.append(
            "productVideo",
            productVideo
          );
        }

        console.log(
          "Submitting Product..."
        );

        const response =
          await fetch(
            `${API}/products`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Product Response:",
          data
        );

        if (data.success) {
  alert("Product Added Successfully!");
  window.location.href = "products.html";
} else {
  alert(data.message || "Something went wrong");
}
      } catch (error) {
        console.log(
          "Submit Error:",
          error
        );

        alert(
          "Product Create Failed"
        );
      }
    }
  );
});