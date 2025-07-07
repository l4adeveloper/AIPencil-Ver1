
const toggleButton = document.getElementById("modelToggle");
const modelOptions = document.getElementById("modelOptions");

toggleButton.addEventListener("mousedown", (e) => {
  e.stopPropagation(); // ✅ ngăn lan ra ngoài
  modelOptions.classList.toggle("show");
});




// Chọn model
function selectModel(name, iconUrl) {
  // Cập nhật model hiển thị trong combobox
  const modelSpan = document.getElementById("selectedModel");
  modelSpan.innerHTML = `<img src="${iconUrl}" /> ${name}`;
  document.getElementById("ai-model").value = name;
  modelOptions.classList.remove("show");

  // Cập nhật tiêu đề "Trò chuyện với ..."
  const titleSpan = document.querySelector("#chatTitle .highlight");
  if (titleSpan) {
    titleSpan.textContent = name;
  }

  // Xoá nội dung chat cũ
  const chatBody = document.getElementById("chat-body");
  chatBody.innerHTML = "";
}

// Đóng dropdown khi click ra ngoài
window.addEventListener("click", function (e) {
  if (!e.target.closest(".model-dropdown")) {
    modelOptions.classList.remove("show");
  }
});

// Gửi tin nhắn
function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  const model = document.getElementById("ai-model").value;
  const searchChecked = document.querySelector("input[value='Search']").checked;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  if (msg) {
    const chatBody = document.getElementById("chat-body");

    const bubble = document.createElement("div");
    bubble.className = "chat-message user";
    bubble.textContent = msg;
    chatBody.appendChild(bubble);
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Chèn tin nhắn đang gõ
    const aiBubble = document.createElement("div");
    aiBubble.className = "chat-message bot";
    aiBubble.innerHTML = `
  <span class="typing">
    <span>.</span><span>.</span><span>.</span>
  </span>
`;
    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Gửi yêu cầu tới backend
  fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: model, message: msg, userId: userId, search: searchChecked })
    })
      .then(res => res.json())
      .then(data => {
        aiBubble.innerHTML = data.reply || "Không có phản hồi!";
        chatBody.scrollTop = chatBody.scrollHeight;
      })
      .catch(err => {
        aiBubble.textContent = "Lỗi gửi yêu cầu!";
        chatBody.scrollTop = chatBody.scrollHeight;
      });

  }
}

// Gửi bằng Enter
document.getElementById("chatInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function fetchHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  fetch(`/api/history/${user.id}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("historyList");
      list.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.role}: ${item.message}`;
        list.appendChild(li);
      });
    })
    .catch(err => console.error("Lỗi lấy lịch sử:", err));
}

function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("collapsed");
}

window.addEventListener("DOMContentLoaded", fetchHistory);


const multiToggle = document.getElementById("multiToggle");
const multiOptions = document.getElementById("multiOptions");
const multiDisplay = document.getElementById("multiDisplay");

multiToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  multiOptions.classList.toggle("show");
});

document.addEventListener("click", () => {
  multiOptions.classList.remove("show");
});

multiOptions.querySelectorAll("input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", () => {
    const selected = Array.from(multiOptions.querySelectorAll("input[type='checkbox']:checked"))
      .map(cb => cb.value);
    multiDisplay.textContent = selected.length > 0 ? selected.join(", ") : "Chọn chức năng";

    // 🔴 Gửi dữ liệu về server
    const allOptions = Array.from(multiOptions.querySelectorAll("input[type='checkbox']"));
    const optionStatus = {};
    allOptions.forEach(cb => {
      optionStatus[cb.value] = cb.checked;
    });

    fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ options: optionStatus })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Phản hồi backend:", data);
      })
      .catch(err => {
        console.error("Lỗi khi gửi options:", err);
      });
  });
});


