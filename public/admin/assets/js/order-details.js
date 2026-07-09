const token = localStorage.getItem("token");

const orderId = new URLSearchParams(window.location.search).get("id");

if (!orderId) {
    alert("Order ID not found");
    window.location.href = "orders.html";
}

async function loadOrder() {

    try {

        const response = await fetch(`${API}/orders/${orderId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log(data);

        if(!data.success){
            alert(data.message);
            return;
        }

        const order = data.order;

        // =============================
        // CUSTOMER
        // =============================

        document.getElementById("customerName").textContent =
            order.shippingAddress?.fullName || "-";

        document.getElementById("customerEmail").textContent =
            order.user?.email || "-";

        document.getElementById("customerPhone").textContent =
            order.shippingAddress?.phone ||
            order.user?.phone ||
            "-";

        // =============================
        // SHIPPING ADDRESS
        // =============================

        document.getElementById("fullName").innerHTML =
            `<strong>Name :</strong> ${order.shippingAddress?.fullName || "-"}`;

        document.getElementById("address").innerHTML =
            `<strong>Address :</strong> ${order.shippingAddress?.address || "-"}`;

        document.getElementById("city").innerHTML =
            `<strong>City :</strong> ${order.shippingAddress?.city || "-"}`;

        document.getElementById("state").innerHTML =
            `<strong>State :</strong> ${order.shippingAddress?.state || "-"}`;

        document.getElementById("pincode").innerHTML =
            `<strong>Pincode :</strong> ${order.shippingAddress?.pincode || "-"}`;

        document.getElementById("country").innerHTML =
            `<strong>Country :</strong> ${order.shippingAddress?.country || "-"}`;

        // =============================
        // ORDER INFO
        // =============================

        document.getElementById("orderNumber").textContent =
            order.orderNumber || order._id.slice(-6);

        document.getElementById("paymentMethod").textContent =
            order.paymentMethod || "-";

        document.getElementById("paymentStatus").textContent =
            order.paymentStatus || "-";

        document.getElementById("orderStatus").textContent =
            order.orderStatus || "-";

        document.getElementById("orderDate").textContent =
            new Date(order.createdAt).toLocaleString();

        loadProducts(order);

    }

    catch(error){

        console.log(error);

        alert("Something went wrong");

    }

}

function loadProducts(order){

    let html = "";

    order.orderItems.forEach(item=>{

        const image =
            item.image ||
            item.product?.mainImage ||
            "";

        const name =
            item.name ||
            item.product?.name ||
            "-";

        const qty =
            item.quantity || 0;

        const price =
            item.price ||
            item.product?.price ||
            0;

        html += `

        <tr>

            <td>
                <img
                    src="${image}"
                    style="width:70px;height:70px;object-fit:cover;border-radius:10px;"
                >
            </td>

            <td>${name}</td>

            <td>${qty}</td>

            <td>₹${price}</td>

            <td><strong>₹${qty * price}</strong></td>

        </tr>

        `;

    });

    document.getElementById("productsTable").innerHTML = html;

    document.getElementById("subTotal").textContent =
        `₹${order.totalAmount || 0}`;

    document.getElementById("shippingPrice").textContent =
        `₹${order.shippingPrice || 0}`;

    document.getElementById("taxPrice").textContent =
        `₹${order.taxPrice || 0}`;

    document.getElementById("discountAmount").textContent =
        `₹${order.discountAmount || 0}`;

    document.getElementById("grandTotal").textContent =
        `₹${order.totalAmount || 0}`;

    document.getElementById("razorOrderId").textContent =
        order.razorpayOrderId || "-";

    document.getElementById("razorPaymentId").textContent =
        order.razorpayPaymentId || "-";

    document.getElementById("razorSignature").textContent =
        order.razorpaySignature || "-";

}

loadOrder();