function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    document.addEventListener('DOMContentLoaded', () => {
      showTab('tab-nhansu');
    });

    function setStatus(status) {
      let iconMap = {
        online: "pictures/status-online.png",
        waiting: "pictures/status-waiting.png",
        busy: "pictures/status-busy.png"
      };
      let textMap = {
        online: "Online",
        waiting: "Chờ",
        busy: "Bận"
      };
      document.getElementById("status-icon").src = iconMap[status];
      document.querySelectorAll(".status-cell").forEach(cell => {
        cell.textContent = textMap[status];
      });
    }

  const friends = ["Phạm Lê Nguyễn Thành An","Nguyễn Văn A", "Trần Thị B", "Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C","Phạm Văn C"];
  const members = ["Nguyễn Văn A", "Trần Thị B", "Phạm Văn C", "Lê Thị D"];
  const groups = [];

  let currentChatFriend = null;
  let currentGroup = null;

  // Modal
  document.getElementById("openAddFriendModal").onclick = () => {
    document.getElementById("friendModal").classList.remove("hidden");
    const friendList = document.getElementById("friendList");
    friendList.innerHTML = "";
    friends.forEach(friend => {
      const item = document.createElement("div");
      item.className = "friend-item";
      item.innerText = friend;
      item.onclick = () => addFriend(friend);
      friendList.appendChild(item);
    });
  };

  function closeFriendModal() {
    document.getElementById("friendModal").classList.add("hidden");
  }

  function addFriend(name) {
    const grid = document.getElementById("friendGrid");
    const item = document.createElement("div");
    item.className = "friend-item";
    item.innerText = name;
    item.onclick = () => openChatWith(name);
    grid.appendChild(item);
    closeFriendModal();
  }

  function openChatWith(name) {
    document.getElementById("chatWithName").innerText = name;
    document.getElementById("chatBox").classList.remove("hidden");
    document.getElementById("friendGrid").classList.add("hidden");
    currentChatFriend = name;
  }

  function goBackToFriendList() {
    document.getElementById("chatBox").classList.add("hidden");
    document.getElementById("friendGrid").classList.remove("hidden");
  }

  function sendMessage() {
    const input = document.getElementById("chatInputText");
    const message = input.value.trim();
    if (message) {
      const msgContainer = document.createElement("div");
      msgContainer.innerText = `${message}`;
      document.getElementById("chatMessages").appendChild(msgContainer);
      input.value = "";
    }
  }

  // Group chat logic
  document.getElementById("openGroupModal").onclick = () => {
    document.getElementById("groupModal").classList.remove("hidden");
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";
    members.forEach(member => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = member;
      label.appendChild(checkbox);
      label.append(` ${member}`);
      memberList.appendChild(label);
      memberList.appendChild(document.createElement("br"));
    });
  };

  function closeGroupModal() {
    document.getElementById("groupModal").classList.add("hidden");
  }

  function createGroup() {
    const name = document.getElementById("groupNameInput").value.trim();
    if (!name) return;
    const checkboxes = document.querySelectorAll("#memberList input[type=checkbox]:checked");
    const members = Array.from(checkboxes).map(cb => cb.value);
    if (members.length === 0) return;

    const grid = document.getElementById("groupGrid");
    const item = document.createElement("div");
    item.className = "group-item";
    item.innerText = name;
    item.onclick = () => openGroupChat(name);
    grid.appendChild(item);
    closeGroupModal();
  }

  function openGroupChat(name) {
    document.getElementById("groupChatName").innerText = name;
    document.getElementById("groupChatBox").classList.remove("hidden");
    document.getElementById("groupGrid").classList.add("hidden");
    currentGroup = name;
  }

  function goBackToGroupList() {
    document.getElementById("groupChatBox").classList.add("hidden");
    document.getElementById("groupGrid").classList.remove("hidden");
  }

  function sendGroupMessage() {
    const input = document.getElementById("groupChatInputText");
    const message = input.value.trim();
    if (message) {
      const msgContainer = document.createElement("div");
      msgContainer.innerText = `${message}`;
      document.getElementById("groupChatMessages").appendChild(msgContainer);
      input.value = "";
    }
  }