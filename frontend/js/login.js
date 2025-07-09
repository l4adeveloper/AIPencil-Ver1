const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "👁" : "👁";
});

// === Xử lý đăng nhập ===
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const errorMsg = document.getElementById("errorMsg"); // Một thẻ <p id="errorMsg"> để hiển thị lỗi

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Lưu thông tin user vào localStorage (hoặc sessionStorage)
      localStorage.setItem("user", JSON.stringify(data.user));

      //window.location.href = "index.html";
      const role = data.user.role;
      if (role === "user") {
        window.location.href = "employee.html";
      } else if (role === "manager") {
        window.location.href = "manager.html"; 
      } else if (role === "director") {
        window.location.href = "director.html"; 
      } else if (role === "admin") {
        window.location.href = "admin.html"; 
      }else {
        window.location.href = "index.html"; 
      }
    } else {
      errorMsg.textContent = data.message || "Đăng nhập thất bại.";
    }
  } catch (err) {
    console.error("Lỗi:", err);
    errorMsg.textContent = "Lỗi kết nối đến server.";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // Nếu có lỗi từ Google OAuth redirect
  if (params.get("error") === "exists") {
    document.getElementById("errorMsg").textContent =
      "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập thủ công.";
  }

  // Nếu đã đăng nhập → chuyển về index.html
  // const user = localStorage.getItem("user");
  // if (user) {
  //   window.location.href = "index.html";
  // }
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const role = user.role;

      if (role === "user") {
        window.location.href = "employee.html";
      } else if (role === "manager") {
        window.location.href = "manager.html";
      } else if (role === "director") {
        window.location.href = "director.html";
      } else if (role === "admin") {
        window.location.href = "admin.html"; 
      } else {
        window.location.href = "index.html";
      }
    } catch (e) {
      console.error("Lỗi phân tích dữ liệu user:", e);
    }
  }
});


function loginWithGoogle() {
  window.location.href = "/api/auth/google";
}