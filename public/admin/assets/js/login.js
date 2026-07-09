const loginForm =
  document.getElementById("loginForm");

loginForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const password =
      document
        .getElementById("password")
        .value
        .trim();

    try {
      const response =
        await fetch(
          `${API}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (!data.success) {
        return alert(
          data.message
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      window.location.href =
        "dashboard.html";
    } catch (error) {
      console.log(error);

      alert(
        "Server Error. Try Again."
      );
    }
  }
);