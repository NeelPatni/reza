const token = localStorage.getItem("token");

const categoryForm =
document.getElementById("categoryForm");


// Image Preview

document
.getElementById("image")
.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const img =
        document.getElementById("imagePreview");

        img.src = e.target.result;

        img.style.display = "block";

    }

    reader.readAsDataURL(file);

});


// Submit Form

categoryForm.addEventListener("submit", async (e) => {

    e.preventDefault();

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

        formData.append(
            "image",
            image
        );

    }

    try {

        const response =
        await fetch(`${API}/categories`, {

            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData

        });

        const data =
        await response.json();

        if (data.success) {

            alert("Category Added Successfully");

            categoryForm.reset();

            document
            .getElementById("imagePreview")
            .style.display = "none";

        } else {

            alert(data.message);

        }

    }

    catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

});