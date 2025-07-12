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
  window.location.href = "login.html";
}

function loadUsers() {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  fetch("http://localhost:3000/profile/all")
    .then(res => res.json())
    .then(data => {
      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td class="user-actions">
            <button class="edit" onclick="editUser('${user._id}')">Sửa</button>
            <button class="delete" onclick="deleteUser('${user._id}')">Ắxa</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    });
}

function addUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  fetch("http://localhost:3000/profile/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password, role })
  })
    .then(res => res.json())
    .then(() => {
      alert("Tạo người dùng thành công!");
      document.getElementById("addUserForm").reset();
      loadUsers();
    });
}

function deleteUser(userId) {
  if (!confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;

  fetch(`http://localhost:3000/profile/delete/${userId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => {
      loadUsers();
    });
}

function editUser(userId) {
  const newEmail = prompt("Nhập email mới:");
  const newRole = prompt("Nhập role mới (user, manager, admin):");
  if (!newEmail || !newRole) return;

  fetch(`http://localhost:3000/profile/update/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: newEmail, role: newRole })
  })
    .then(res => res.json())
    .then(() => {
      loadUsers();
    });
}

document.getElementById("addUserForm").addEventListener("submit", addUser);

window.onload = loadUsers;

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