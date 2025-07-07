
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "👁" : "👁";
});

toggleConfirmPassword.addEventListener("click", () => {
  const isHidden = confirmInput.type === "password";
  confirmInput.type = isHidden ? "text" : "password";
  toggleConfirmPassword.textContent = isHidden ? "👁" : "👁";
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMsg = document.getElementById("errorMsg");

  if (password !== confirmPassword) {
    errorMsg.textContent = "Mật khẩu nhập lại không khớp.";
    return;
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Tạo tài khoản thành công ! Đang chờ xác minh");
    //  localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = data.message;
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Lỗi kết nối đến máy chủ.";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("user")) {
    const user = JSON.parse(decodeURIComponent(params.get("user")));
    localStorage.setItem("user", JSON.stringify(user));
    // Xóa query param để không lưu mãi trên URL
    window.history.replaceState({}, document.title, "index.html");
    // Hiển thị giao diện đăng nhập thành công
  }
});

function signupWithGoogle() {
  window.location.href = "/api/auth/google";
}
