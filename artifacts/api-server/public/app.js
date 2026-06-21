(function () {
  const THEME_KEY = 'lul_theme';
  const HISTORY_KEY = 'lul_history';
  const SETTINGS_KEY = 'lul_settings';

  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
  }

  function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  window.pasteLink = function () {
    navigator.clipboard.readText().then(text => {
      const input = document.getElementById('urlInput');
      if (input) input.value = text;
    }).catch(() => {
      const input = document.getElementById('urlInput');
      if (input) input.focus();
    });
  };

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
  }

  function saveToHistory(url) {
    const settings = getSettings();
    if (settings.historyOff) return;
    let history = getHistory();
    history = history.filter(h => h.url !== url);
    history.unshift({ url, time: new Date().toISOString() });
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  window.renderHistory = function () {
    const list = document.getElementById('historyList');
    if (!list) return;
    const history = getHistory();
    if (history.length === 0) {
      list.innerHTML = '<div class="history-empty"><div class="icon">📂</div><p>Koi download history nahi hai abhi</p><a href="index.html" class="btn btn-primary mt-4">Pehla download karo</a></div>';
      return;
    }
    list.innerHTML = history.map((item, i) => {
      const time = new Date(item.time).toLocaleString('hi-IN');
      const short = item.url.length > 45 ? item.url.slice(0, 45) + '...' : item.url;
      return `<div class="history-item">
        <div class="history-thumb">🎵</div>
        <div class="history-info">
          <div class="history-url" title="${item.url}">${short}</div>
          <div class="history-time">${time}</div>
        </div>
        <button class="history-btn" onclick="redownload('${item.url}')">Download</button>
      </div>`;
    }).join('');
  };

  window.clearHistory = function () {
    if (confirm('Sari history delete karo?')) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  };

  window.redownload = function (url) {
    window.location.href = 'index.html?url=' + encodeURIComponent(url);
  };

  window.handleDownload = function (e) {
    e.preventDefault();
    const input = document.getElementById('urlInput');
    if (!input || !input.value.trim()) {
      alert('Pehle TikTok link paste karo!');
      return;
    }
    const url = input.value.trim();
    if (!url.includes('tiktok.com') && !url.includes('vm.tiktok.com')) {
      alert('Valid TikTok URL daalo (tiktok.com)');
      return;
    }
    saveToHistory(url);
    const resultBox = document.getElementById('resultBox');
    const loadingBox = document.getElementById('loadingBox');
    if (loadingBox) { loadingBox.style.display = 'block'; }
    if (resultBox) { resultBox.style.display = 'none'; }
    setTimeout(() => {
      if (loadingBox) loadingBox.style.display = 'none';
      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.classList.add('show');
      }
    }, 1800);
  };

  window.initSettings = function () {
    const settings = getSettings();
    const darkToggle = document.getElementById('darkModeToggle');
    const historyToggle = document.getElementById('historyToggle');
    const langSelect = document.getElementById('langSelect');
    if (darkToggle) {
      darkToggle.checked = (localStorage.getItem(THEME_KEY) === 'dark');
      darkToggle.onchange = function () {
        const t = this.checked ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, t);
        applyTheme(t);
      };
    }
    if (historyToggle) {
      historyToggle.checked = !settings.historyOff;
      historyToggle.onchange = function () {
        const s = getSettings();
        s.historyOff = !this.checked;
        saveSettings(s);
      };
    }
    if (langSelect) {
      langSelect.value = settings.lang || 'en';
      langSelect.onchange = function () {
        const s = getSettings();
        s.lang = this.value;
        saveSettings(s);
      };
    }
  };

  function prefillUrl() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) {
      const input = document.getElementById('urlInput');
      if (input) input.value = url;
    }
  }

  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', function () {
        const item = this.closest('.faq-item');
        item.classList.toggle('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    prefillUrl();
    renderHistory();
    initSettings();
    initFaq();
  });
})();
