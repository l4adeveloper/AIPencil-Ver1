window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromURL = urlParams.get("token");
  const userParam = urlParams.get("user");

  const loginBtn = document.getElementById("loginBtn");
  const tryBtn = document.getElementById("tryBtn");
  const userPanel = document.getElementById("userPanel");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ Nếu đăng nhập từ Google OAuth có token → gọi /profile để lấy thông tin user
  if (tokenFromURL) {
    
    localStorage.setItem("token", tokenFromURL);
    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${tokenFromURL}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = {
          id: data.id,
          email: data.email,
          role: data.role

        }
        if (data.id != null) {
          localStorage.setItem("user", JSON.stringify(user));
          renderUI(user);
        } else {
          console.warn("Không lấy được user từ token.");
        }
        cleanUrl();
      })
      .catch((err) => {
        console.error("Lỗi lấy user từ token:", err);
        cleanUrl();
      });
  }

  // ✅ Trường hợp Google redirect truyền object user qua ?user=...
  else if (userParam) {
    try {
      const parsedUser = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem("user", JSON.stringify(parsedUser));
      renderUI(parsedUser);
      cleanUrl();
    } catch (e) {
      console.error("❌ Lỗi parse user param:", e);
    }
  }

  // ✅ Nếu user đã lưu localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    renderUI(user);
  }

  function renderUI(user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (tryBtn) tryBtn.style.display = "none";
    if (userPanel) userPanel.style.display = "inline-block";
    if (userEmail) userEmail.textContent = user.email;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  function cleanUrl() {
    window.history.replaceState({}, document.title, "index.html");
  }
});
