function loadNavbar() {
  document.getElementById(
    "navbar"
  ).innerHTML = `
  
    <div>
      <h2 id="pageTitle">
        Dashboard
      </h2>
    </div>

    <div class="nav-right">

      <i
        class="fa-solid fa-bell"
      ></i>

      <img
        src="https://i.pravatar.cc/40"
        class="profile"
      >

    </div>
  `;
}

loadNavbar();