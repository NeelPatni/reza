const token = localStorage.getItem("token");

const categoryId = new URLSearchParams(window.location.search).get("id");

const categoryForm = document.getElementById("categoryForm");

const currentImage = document.getElementById("currentImage");
const imagePreview = document.getElementById("imagePreview");

// ==========================
// Check ID
// ==========================
if (!categoryId) {
  alert("Category ID not found");
  window.location.href = "categories.html";
}

// ==========================
// Load Category
// ==========================
async function loadCategory() {
  try {
    const response = await fetch(`${API}/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    const category = data.category;

    document.getElementById("name").value = category.name;
    document.getElementById("status").value = category.status;

    if (category.image) {
      currentImage.src = category.image;
      currentImage.style.display = "block";
    }
  } catch (err) {
    console.log(err);
    alert("Failed to load category");
  }
}

// ==========================
// Image Preview
// ==========================
document
  .getElementById("image")
  .addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });

// ==========================
// Update Category
// ==========================
categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append(
      "name",
      document.getElementById("name").value
    );

    formData.append(
      "status",
      document.getElementById("status").value
    );

    const image =
      document.getElementById("image").files[0];

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(
      `${API}/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Category Updated Successfully");
      window.location.href = "categories.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
});

// ==========================
// Initial Load
// ==========================
loadCategory();