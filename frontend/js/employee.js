function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}

function goToChat() {
  window.location.href = 'chat.html';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem("user");
  window.location.href = "login.html"; // hoặc trang chính
}

const userItems = document.querySelectorAll(".chat-user");
const messagesDiv = document.querySelector(".chat-messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
let selectedUser = null;

  userItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedUser = item.textContent;
      messagesDiv.innerHTML = "";
      const messages = JSON.parse(localStorage.getItem(selectedUser)) || [];
      messages.forEach(msg => {
        const p = document.createElement("p");
        p.textContent = msg;
        messagesDiv.appendChild(p);
      });
    });
  });

  sendBtn.addEventListener("click", () => {
    if (chatInput.value.trim() === "") return;
    const messages = JSON.parse(localStorage.getItem(selectedUser)) || [];
    messages.push(chatInput.value);
    localStorage.setItem(selectedUser, JSON.stringify(messages));
    const p = document.createElement("p");
    p.textContent = chatInput.value;
    messagesDiv.appendChild(p);
    chatInput.value = "";
  });