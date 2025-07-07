
    const mainContent = document.getElementById('mainContent');
    const tabButtons = document.querySelectorAll('.tab-button');

    const sectionsContent = {
      overview: `
        <h1>Tổng quan Automation</h1>
        <p>Quản lý tất cả các công cụ tự động hóa của bạn tại đây.</p>
        <div class="cards-grid">
          <div class="card">
            <h2>Trạng thái hệ thống</h2>
            <p>Hệ thống đang hoạt động ổn định, không có sự cố nào được báo cáo.</p>
          </div>
          <div class="card">
            <h2>Hoạt động gần đây</h2>
            <ul>
              <li>Auto điền form: hoàn thành 15/05/2025 10:30</li>
              <li>Gửi tin nhắn Zalo: gửi 120 tin hôm nay</li>
              <li>Tự động đăng bài Facebook: bài mới nhất được đăng 2 giờ trước</li>
            </ul>
          </div>
          <div class="card">
            <h2>Thống kê sử dụng</h2>
            <p>Người dùng active: 1,254 | Automation đã chạy: 3,765</p>
          </div>
        </div>
      `,
      autofill: `
        <h1>Auto điền Form</h1>
        <p>Tự động điền thông tin vào các form trên website nhanh chóng.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Tên form, danh sách các trường cần điền.</p>
          <p><b>Đầu ra:</b> Form được tự động điền dữ liệu theo cấu hình.</p>
        </div>
        <form id="autofillForm">
          <label for="formName">Tên form:</label>
          <input type="text" id="formName" placeholder="Nhập tên form" required />
          <label for="fields">Các trường cần điền (cách nhau bằng dấu phẩy):</label>
          <textarea id="fields" placeholder="Ví dụ: tên, email, số điện thoại" required></textarea>
          <button type="submit">Lưu và chạy</button>
        </form>
        <div id="autofillResult" style="margin-top:1rem;"></div>
      `,
      'payment-info': `
        <h1>Auto lấy Thông tin Thanh toán</h1>
        <p>Tự động thu thập và xử lý thông tin thanh toán từ các nguồn.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> URL nguồn thanh toán, định dạng dữ liệu cần lấy.</p>
          <p><b>Đầu ra:</b> Dữ liệu thanh toán được tổng hợp và xuất báo cáo.</p>
        </div>
        <form id="paymentForm">
          <label for="sourceUrl">URL nguồn thanh toán:</label>
          <input type="text" id="sourceUrl" placeholder="Nhập URL" required />
          <button type="submit">Bắt đầu thu thập</button>
        </form>
        <div id="paymentResult" style="margin-top:1rem;"></div>
      `,
      calendar: `
        <h1>Automation Google Calendar</h1>
        <p>Tự động tạo, chỉnh sửa và nhắc nhở sự kiện trên Google Calendar.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Tên sự kiện, ngày giờ sự kiện.</p>
          <p><b>Đầu ra:</b> Sự kiện được tạo/điều chỉnh trên Google Calendar, thông báo nhắc nhở.</p>
        </div>
        <form id="calendarForm">
          <label for="eventName">Tên sự kiện:</label>
          <input type="text" id="eventName" placeholder="Nhập tên sự kiện" required />
          <label for="eventDate">Ngày sự kiện:</label>
          <input type="date" id="eventDate" required />
          <button type="submit">Tạo sự kiện</button>
        </form>
        <div id="calendarResult" style="margin-top:1rem;"></div>
      `,
      'fb-bot': `
        <h1>Bot chat Facebook Page</h1>
        <p>Tự động trả lời tin nhắn khách hàng trên trang Facebook của bạn.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Tên fanpage, nội dung tin nhắn trả lời tự động.</p>
          <p><b>Đầu ra:</b> Tin nhắn tự động trả lời khách hàng trên Facebook Page.</p>
        </div>
        <form id="fbBotForm">
          <label for="pageName">Tên trang Facebook:</label>
          <input type="text" id="pageName" placeholder="Nhập tên fanpage" required />
          <label for="autoReply">Tin nhắn tự động trả lời:</label>
          <textarea id="autoReply" placeholder="Nhập nội dung trả lời" required></textarea>
          <button type="submit">Lưu và kích hoạt</button>
        </form>
        <div id="fbBotResult" style="margin-top:1rem;"></div>
      `,
      'zalo-bot': `
        <h1>Chatbot Zalo</h1>
        <p>Tạo chatbot tự động trả lời tin nhắn trên Zalo.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Tên chatbot, nội dung trả lời tự động.</p>
          <p><b>Đầu ra:</b> Chatbot trả lời tin nhắn tự động trên Zalo.</p>
        </div>
        <form id="zaloBotForm">
          <label for="zaloBotName">Tên chatbot:</label>
          <input type="text" id="zaloBotName" placeholder="Nhập tên chatbot" required />
          <label for="zaloBotReply">Tin nhắn trả lời:</label>
          <textarea id="zaloBotReply" placeholder="Nội dung trả lời tự động" required></textarea>
          <button type="submit">Lưu chatbot</button>
        </form>
        <div id="zaloBotResult" style="margin-top:1rem;"></div>
      `,
      'zalo-msg': `
        <h1>Gửi tin nhắn từ Zalo cá nhân</h1>
        <p>Tự động gửi tin nhắn hàng loạt từ tài khoản Zalo cá nhân.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Danh sách người nhận, nội dung tin nhắn.</p>
          <p><b>Đầu ra:</b> Tin nhắn được gửi tới nhiều người nhận.</p>
        </div>
        <form id="zaloMsgForm">
          <label for="recipientList">Danh sách người nhận (cách nhau dấu phẩy):</label>
          <textarea id="recipientList" placeholder="Nhập số điện thoại hoặc ID" required></textarea>
          <label for="messageContent">Nội dung tin nhắn:</label>
          <textarea id="messageContent" placeholder="Nội dung tin nhắn" required></textarea>
          <button type="submit">Gửi tin nhắn</button>
        </form>
        <div id="zaloMsgResult" style="margin-top:1rem;"></div>
      `,
      'customer-care': `
        <h1>Bot chăm sóc khách hàng</h1>
        <p>Tự động chăm sóc, tư vấn và theo dõi khách hàng với bot thông minh.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Tên bot, kịch bản chăm sóc khách hàng.</p>
          <p><b>Đầu ra:</b> Bot tự động thực hiện kịch bản chăm sóc, nhắc nhở khách hàng.</p>
        </div>
        <form id="careBotForm">
          <label for="careBotName">Tên bot:</label>
          <input type="text" id="careBotName" placeholder="Nhập tên bot" required />
          <label for="careBotScript">Kịch bản chăm sóc:</label>
          <textarea id="careBotScript" placeholder="Nhập kịch bản chăm sóc khách hàng" required></textarea>
          <button type="submit">Lưu kịch bản</button>
        </form>
        <div id="careBotResult" style="margin-top:1rem;"></div>
      `,
      'fb-post': `
        <h1>Tự động đăng bài Facebook</h1>
        <p>Lên lịch và tự động đăng bài trên Facebook cá nhân hoặc fanpage.</p>
        <div class="function-desc">
          <h3>Chức năng</h3>
          <p><b>Đầu vào:</b> Nội dung bài viết, thời gian đăng bài.</p>
          <p><b>Đầu ra:</b> Bài viết được đăng tự động theo lịch đã thiết lập.</p>
        </div>
        <form id="fbPostForm">
          <label for="fbPostContent">Nội dung bài viết:</label>
          <textarea id="fbPostContent" placeholder="Nhập nội dung bài viết" required></textarea>
          <label for="fbPostTime">Thời gian đăng bài:</label>
          <input type="datetime-local" id="fbPostTime" required />
          <button type="submit">Lên lịch đăng bài</button>
        </form>
        <div id="fbPostResult" style="margin-top:1rem;"></div>
      `
    };

    function loadTab(tab) {
      // Cập nhật nội dung
      mainContent.innerHTML = sectionsContent[tab] || '<p>Không tìm thấy nội dung.</p>';
      
      // Thêm sự kiện submit cho từng form tương ứng
      if(tab === 'autofill') {
        document.getElementById('autofillForm').onsubmit = e => {
          e.preventDefault();
          const formName = e.target.formName.value.trim();
          const fields = e.target.fields.value.trim();
          if(formName && fields){
            document.getElementById('autofillResult').textContent = `Form "${formName}" đã được cấu hình với các trường: ${fields}.`;
          }
        };
      }
      else if(tab === 'payment-info'){
        document.getElementById('paymentForm').onsubmit = e => {
          e.preventDefault();
          const url = e.target.sourceUrl.value.trim();
          if(url) {
            document.getElementById('paymentResult').textContent = `Đang thu thập dữ liệu từ: ${url}`;
          }
        };
      }
      else if(tab === 'calendar'){
        document.getElementById('calendarForm').onsubmit = e => {
          e.preventDefault();
          const name = e.target.eventName.value.trim();
          const date = e.target.eventDate.value;
          if(name && date) {
            document.getElementById('calendarResult').textContent = `Sự kiện "${name}" được tạo vào ngày ${date}.`;
          }
        };
      }
      else if(tab === 'fb-bot'){
        document.getElementById('fbBotForm').onsubmit = e => {
          e.preventDefault();
          const page = e.target.pageName.value.trim();
          const reply = e.target.autoReply.value.trim();
          if(page && reply) {
            document.getElementById('fbBotResult').textContent = `Bot cho trang "${page}" đã được kích hoạt với nội dung trả lời.`;
          }
        };
      }
      else if(tab === 'zalo-bot'){
        document.getElementById('zaloBotForm').onsubmit = e => {
          e.preventDefault();
          const botName = e.target.zaloBotName.value.trim();
          const reply = e.target.zaloBotReply.value.trim();
          if(botName && reply) {
            document.getElementById('zaloBotResult').textContent = `Chatbot "${botName}" đã được lưu.`;
          }
        };
      }
      else if(tab === 'zalo-msg'){
        document.getElementById('zaloMsgForm').onsubmit = e => {
          e.preventDefault();
          const recipients = e.target.recipientList.value.trim();
          const msg = e.target.messageContent.value.trim();
          if(recipients && msg) {
            document.getElementById('zaloMsgResult').textContent = `Đang gửi tin nhắn tới: ${recipients.split(',').length} người.`;
          }
        };
      }
      else if(tab === 'customer-care'){
        document.getElementById('careBotForm').onsubmit = e => {
          e.preventDefault();
          const botName = e.target.careBotName.value.trim();
          const script = e.target.careBotScript.value.trim();
          if(botName && script) {
            document.getElementById('careBotResult').textContent = `Bot chăm sóc "${botName}" đã lưu kịch bản.`;
          }
        };
      }
      else if(tab === 'fb-post'){
        document.getElementById('fbPostForm').onsubmit = e => {
          e.preventDefault();
          const content = e.target.fbPostContent.value.trim();
          const time = e.target.fbPostTime.value;
          if(content && time){
            document.getElementById('fbPostResult').textContent = `Bài viết đã được lên lịch vào ${time}.`;
          }
        };
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTab(btn.dataset.tab);
      });
    });

    // Load mặc định tab overview khi trang load
    loadTab('overview');