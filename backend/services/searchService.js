const { GoogleGenerativeAI } = require('@google/generative-ai');
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');
const { contextMemory } = require('./contextMemoryService');

// Thêm stealth plugin
chromium.use(stealth);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache để lưu kết quả tìm kiếm
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

async function extractKeywords(userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  
  const prompt = `Tìm từ khóa trọng tâm của câu "${userMessage}"
Chỉ trả về kết quả ngắn gọn hết sức có thể. Giữa lại những từ khóa up to date, real time để đề cao tính xác thực của thông tin.Đảm bảo chỉ tách ra những keyword quan trọng nhất viết liền mạch`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

async function waitForSelectorWithRetry(page, selector, options = {}) {
  const maxRetries = options.maxRetries || 3;
  const timeout = options.timeout || 5000;
  const retryDelay = options.retryDelay || 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(retryDelay);
    }
  }
  return false;
}

async function checkForCaptcha(page) {
  try {
    const captchaSelectors = [
      'iframe[src*="captcha"]',
      'div[class*="captcha"]',
      'form[action*="captcha"]',
      'div[class*="g-recaptcha"]',
      'div[class*="h-captcha"]'
    ];

    for (const selector of captchaSelectors) {
      const exists = await page.$(selector);
      if (exists) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log('Lỗi kiểm tra CAPTCHA:', error.message);
    return false;
  }
}

async function handleCaptcha(page) {
  try {
    const hasCaptcha = await checkForCaptcha(page);
    if (!hasCaptcha) return true;

    console.log('Phát hiện CAPTCHA, đang thử giải quyết...');
    
    // Thử các phương pháp giải CAPTCHA
    // 1. Đợi một lúc
    await page.waitForTimeout(5000);
    
    // 2. Refresh trang
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // 3. Kiểm tra lại CAPTCHA
    const stillHasCaptcha = await checkForCaptcha(page);
    if (stillHasCaptcha) {
      throw new Error('Không thể vượt qua CAPTCHA');
    }
    
    return true;
  } catch (error) {
    console.error('Lỗi xử lý CAPTCHA:', error.message);
    throw error;
  }
}

async function searchWeb(keyword) {
  // Kiểm tra cache
  const cacheKey = keyword.toLowerCase().trim();
  const cachedResult = searchCache.get(cacheKey);
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    console.log('Sử dụng kết quả từ cache');
    return cachedResult.data;
  }

  console.log('Bắt đầu tìm kiếm với từ khóa:', keyword);
  
  const browser = await chromium.launch({ 
    headless: true,
    channel: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-site-isolation-trials',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-sync',
      '--force-color-profile=srgb',
      '--metrics-recording-only',
      '--password-store=basic'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    permissions: ['geolocation'],
    geolocation: { latitude: 21.0285, longitude: 105.8542 },
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    deviceMemory: 8,
    hardwareConcurrency: 8,
    platform: 'Win32',
    webglVendorAndRenderer: 'Google Inc. (NVIDIA)',
    webglVersion: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)'
  });

  // Tối ưu headers
  await context.setExtraHTTPHeaders({
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'DNT': '1',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"'
  });

  // Tối ưu request interception
  await context.route('**/*.{png,jpg,jpeg,gif,svg,css,font,woff,woff2,eot,ttf,otf,mp4,webm,mp3,wav,ogg}', route => route.abort());
  await context.route('**/analytics/**', route => route.abort());
  await context.route('**/tracking/**', route => route.abort());
  await context.route('**/ads/**', route => route.abort());
  
  const page = await context.newPage();

  try {
    // 1. Truy cập DuckDuckGo với từ khóa trực tiếp
    console.log('Đang truy cập DuckDuckGo...');
    await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(keyword)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // 2. Chờ đúng selector kết quả
    const selectors = [
      'a[data-testid="result-title-a"]',
      '.result__title',
      '.result__a',
      'h2.result__title',
      '[data-testid="result"]'
    ];

    let foundSelector = null;
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { 
          timeout: 3000,
          state: 'visible'
        });
        foundSelector = selector;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!foundSelector) {
      throw new Error('Không tìm thấy kết quả tìm kiếm');
    }

    // 3. Lấy thông tin kết quả đầu tiên
    const resultInfo = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;

      const title = element.textContent || '';
      const url = element.href || '';
      const description = element.closest('div').querySelector('[data-testid="result-snippet"], .result__snippet')?.textContent || '';
      const source = element.closest('div').querySelector('[data-testid="result-domain"], .result__domain')?.textContent || '';

      return { title, description, url, source };
    }, foundSelector);

    if (!resultInfo?.url) {
      throw new Error('Không tìm thấy URL kết quả');
    }

    // 4. Truy cập trang kết quả
    await page.goto(resultInfo.url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // 5. Lấy nội dung trang với chất lượng cao hơn
    const content = await page.evaluate(() => {
      const getMainContent = () => {
        const selectors = [
          'article',
          'main',
          '.content',
          '.article-content',
          '.post-content',
          '.entry-content',
          '#content',
          '.main-content',
          '.detail-content',
          '.news-content',
          '.article-detail',
          '.post-detail',
          '.article-body',
          '.post-body',
          '.story-body',
          '.news-body'
        ];

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) return element;
        }
        return document.body;
      };

      const mainContent = getMainContent();
      
      // Loại bỏ các phần tử không cần thiết
      const removeElements = mainContent.querySelectorAll('script, style, iframe, nav, footer, header, .ads, .comments, .sidebar, .menu, .navigation, .social-share, .related-posts');
      removeElements.forEach(el => el.remove());

      // Lấy nội dung có cấu trúc
      const structuredContent = {
        title: document.querySelector('h1')?.textContent.trim() || '',
        headings: Array.from(mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map(h => ({ level: parseInt(h.tagName[1]), text: h.textContent.trim() }))
          .filter(h => h.text.length > 0),
        paragraphs: Array.from(mainContent.querySelectorAll('p'))
          .map(p => p.textContent.trim())
          .filter(text => text.length > 0),
        lists: Array.from(mainContent.querySelectorAll('ul, ol'))
          .map(list => Array.from(list.querySelectorAll('li'))
            .map(li => li.textContent.trim())
            .filter(text => text.length > 0)),
        tables: Array.from(mainContent.querySelectorAll('table'))
          .map(table => {
            const rows = Array.from(table.querySelectorAll('tr'))
              .map(row => Array.from(row.querySelectorAll('th, td'))
                .map(cell => cell.textContent.trim())
                .join(' | '))
              .join('\n');
            return rows;
          })
      };

      // Tạo nội dung có cấu trúc
      let formattedContent = '';
      
      if (structuredContent.title) {
        formattedContent += `# ${structuredContent.title}\n\n`;
      }

      structuredContent.headings.forEach(h => {
        formattedContent += `${'#'.repeat(h.level)} ${h.text}\n\n`;
      });

      structuredContent.paragraphs.forEach(p => {
        formattedContent += `${p}\n\n`;
      });

      structuredContent.lists.forEach(list => {
        formattedContent += list.map(item => `- ${item}`).join('\n') + '\n\n';
      });

      if (structuredContent.tables.length > 0) {
        formattedContent += '## Bảng dữ liệu\n\n';
        structuredContent.tables.forEach(table => {
          formattedContent += table + '\n\n';
        });
      }

      return {
        structured: structuredContent,
        formatted: formattedContent.trim(),
        fullText: mainContent.innerText.trim()
      };
    });

    const result = {
      title: resultInfo.title,
      description: resultInfo.description,
      source: resultInfo.source,
      url: resultInfo.url,
      content
    };

    // Lưu vào cache
    searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    return {
      title: 'Lỗi tìm kiếm',
      description: 'Không thể hoàn thành tìm kiếm',
      content: {
        structured: {},
        formatted: error.message,
        fullText: ''
      },
      url: null
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

async function processSearchQuery(userMessage) {
  try {
    // Kiểm tra context trước đó
    const relevantContext = await contextMemory.getRelevantContext(userMessage);
    
    // Nếu có context liên quan, sử dụng nó
    if (relevantContext) {
      console.log('Sử dụng context trước đó');
      return `Câu hỏi: ${userMessage}\n\nThông tin từ cuộc trò chuyện trước:\n${relevantContext}`;
    }

    // Nếu không có context liên quan, thực hiện tìm kiếm mới
    const keywords = await extractKeywords(userMessage);
    console.log('Từ khóa đã trích xuất:', keywords);
    
    const searchResults = await searchWeb(keywords);
    
    const combinedContext = `Câu hỏi: ${userMessage}
Nguồn: ${searchResults.url}
Tiêu đề: ${searchResults.title}
Mô tả: ${searchResults.description}
Tác giả/Nguồn: ${searchResults.source}

NỘI DUNG CHI TIẾT:
${searchResults.content.formatted}

NỘI DUNG ĐẦY ĐỦ:
${searchResults.content.fullText}`;

    // Lưu kết quả vào context memory
    contextMemory.addContext(userMessage, combinedContext);
    
    return combinedContext;
  } catch (error) {
    console.error('Lỗi xử lý tìm kiếm:', error);
    return `Câu hỏi: ${userMessage}\nDữ liệu: Không thể tìm kiếm thông tin. Lỗi: ${error.message}`;
  }
}

module.exports = {
  processSearchQuery
};
