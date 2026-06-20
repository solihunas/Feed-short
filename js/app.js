// =============================================
//  FEEDSHORT — Main Application
// =============================================

'use strict';

// ---- State ----
const state = {
  currentIndex: 0,
  isMuted: false,
  isPlaying: true,
  activeDrawer: null,
  activePage: 'home',
  currentVideoId: null,
  feedData: JSON.parse(JSON.stringify(FEED_DATA)),
  tapCount: 0,
  tapTimer: null
};

// ---- DOM refs ----
const dom = {
  loading: () => document.getElementById('loadingScreen'),
  feed: () => document.getElementById('feedContainer'),
  heartPop: () => document.getElementById('heartPop'),
  muteToast: () => document.getElementById('muteToast'),
  muteIcon: () => document.getElementById('muteIcon'),
  muteText: () => document.getElementById('muteText'),
  backdrop: () => document.getElementById('backdropEl'),
  commentDrawer: () => document.getElementById('commentDrawer'),
  commentList: () => document.getElementById('commentList'),
  commentCount: () => document.getElementById('commentCountLabel'),
  commentInput: () => document.getElementById('commentInput'),
  shareModal: () => document.getElementById('shareModal'),
  searchPage: () => document.getElementById('searchPage'),
  profilePage: () => document.getElementById('profilePage'),
  profileGrid: () => document.getElementById('profileVideosGrid'),
  trendingCreators: () => document.getElementById('trendingCreators'),
  toast: () => document.getElementById('toastEl')
};

// ===========================
//  INIT
// ===========================
function init() {
  buildFeed();
  buildTrendingCreators();
  buildProfileGrid();
  bindEvents();

  setTimeout(() => {
    dom.loading().classList.add('hidden');
  }, 900);
}

// ===========================
//  BUILD FEED
// ===========================
function buildFeed() {
  const container = dom.feed();
  container.innerHTML = '';

  state.feedData.forEach((item, index) => {
    const el = createFeedItem(item, index);
    container.appendChild(el);
  });

  setupScrollObserver();
}

function createFeedItem(item, index) {
  const div = document.createElement('div');
  div.className = 'video-item';
  div.dataset.index = index;
  div.dataset.id = item.id;

  const hashtagsHtml = item.hashtags.map(h =>
    `<span class="hashtag-tag">${h}</span> `
  ).join('');

  const musicText = item.music + ' · ' + item.music + ' · ';

  // Image or Video content
  let mediaHtml = '';
  if (item.type === 'image') {
    mediaHtml = `
      <img class="feed-image" src="${item.imageUrl}" alt="${item.description}" loading="${index < 3 ? 'eager' : 'lazy'}">
    `;
  } else {
    mediaHtml = `
      <img class="video-thumb" src="${item.thumbnail}" alt="" loading="lazy">
      <video
        class="video-el"
        src="${item.videoUrl}"
        loop muted playsinline
        preload="${index < 2 ? 'metadata' : 'none'}"
        poster="${item.thumbnail}"
        data-index="${index}"
      ></video>
    `;
  }

  div.innerHTML = `
    ${mediaHtml}

    <!-- Gradients -->
    <div class="video-gradient-top"></div>
    <div class="video-gradient-bottom"></div>

    <!-- Right action sidebar -->
    <div class="action-sidebar">
      <div class="sidebar-avatar-wrap action-btn" data-action="avatar" data-index="${index}">
        <img class="sidebar-avatar" src="${item.user.avatar}" alt="${item.user.displayName}" loading="lazy">
        <div class="sidebar-follow ${item.user.following ? 'following' : ''}" data-follow="${item.id}">
          ${item.user.following ? '✓' : '+'}
        </div>
      </div>

      <div class="action-btn like-btn ${item.isLiked ? 'liked' : ''}" data-action="like" data-index="${index}">
        <div class="action-icon-wrap">${item.isLiked ? '❤️' : '🤍'}</div>
        <span class="action-count like-count">${formatNum(item.likeCount)}</span>
      </div>

      <div class="action-btn" data-action="comment" data-index="${index}">
        <div class="action-icon-wrap">💬</div>
        <span class="action-count">${item.comments}</span>
      </div>

      <div class="action-btn" data-action="share" data-index="${index}">
        <div class="action-icon-wrap">↗️</div>
        <span class="action-count">${item.shares}</span>
      </div>

      <div class="action-btn" data-action="bookmark" data-index="${index}">
        <div class="action-icon-wrap">🔖</div>
        <span class="action-count">Simpan</span>
      </div>

      <div class="music-disc ${index === 0 ? 'playing' : ''}" data-disc="${index}">
        <img src="${item.user.avatar}" alt="music">
        <div class="music-disc-center"></div>
      </div>
    </div>

    <!-- Bottom video info -->
    <div class="video-info">
      <div class="video-username">
        ${item.user.username}
        ${item.user.verified ? '<span class="verified-badge">✓</span>' : ''}
      </div>
      <div class="video-description">${item.description}</div>
      <div class="video-hashtags">${hashtagsHtml}</div>
      <div class="video-music">
        <span class="music-note-icon">🎵</span>
        <div class="music-marquee-wrap">
          <span class="music-marquee">${musicText}</span>
        </div>
      </div>
    </div>

    <!-- Progress bar (image = static full) -->
    <div class="video-progress" data-index="${index}">
      <div class="video-progress-fill" id="progress-${index}"
        style="${item.type === 'image' ? 'width:100%' : ''}"></div>
    </div>
  `;

  // Bind events for video items
  if (item.type !== 'image') {
    const video = div.querySelector('.video-el');
    bindVideoEvents(video, div, index);
  }

  // Tap to like on image items
  bindTapEvents(div, index);

  return div;
}

// ===========================
//  TAP EVENTS
// ===========================
function bindTapEvents(container, index) {
  let tapCount = 0;
  let tapTimer = null;

  container.addEventListener('click', (e) => {
    if (e.target.closest('.action-sidebar') || e.target.closest('.video-progress')) return;

    tapCount++;
    if (tapCount === 1) {
      tapTimer = setTimeout(() => {
        tapCount = 0;
        const item = state.feedData[index];
        if (item.type !== 'image') {
          const video = container.querySelector('.video-el');
          togglePlayPause(video);
        }
      }, 250);
    } else if (tapCount === 2) {
      clearTimeout(tapTimer);
      tapCount = 0;
      doubleTapLike(index);
    }
  });
}

// ===========================
//  VIDEO EVENTS
// ===========================
function bindVideoEvents(video, container, index) {
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    const fill = document.getElementById(`progress-${index}`);
    if (fill) fill.style.width = pct + '%';
  });

  const progressBar = container.querySelector('.video-progress');
  progressBar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });
}

function togglePlayPause(video) {
  if (!video) return;
  if (video.paused) {
    video.play().catch(() => {});
  } else {
    video.pause();
    showMuteToast(true, null, '⏸', 'Paused');
  }
}

function doubleTapLike(index) {
  const heart = dom.heartPop();
  heart.classList.remove('animate');
  void heart.offsetWidth;
  heart.classList.add('animate');
  setTimeout(() => heart.classList.remove('animate'), 800);
  if (!state.feedData[index].isLiked) {
    triggerLike(index);
  }
}

// ===========================
//  SCROLL OBSERVER
// ===========================
function setupScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = parseInt(entry.target.dataset.index);
      const video = entry.target.querySelector('.video-el');
      const disc = entry.target.querySelector('.music-disc');

      if (entry.isIntersecting) {
        state.currentIndex = idx;
        state.currentVideoId = state.feedData[idx].id;

        pauseAllExcept(idx);

        if (video) {
          video.muted = state.isMuted;
          video.play().catch(() => {});
        }
        if (disc) disc.classList.add('playing');
      } else {
        if (video) video.pause();
        if (disc) disc.classList.remove('playing');
      }
    });
  }, { threshold: 0.65 });

  document.querySelectorAll('.video-item').forEach(el => observer.observe(el));
}

function pauseAllExcept(currentIdx) {
  document.querySelectorAll('.video-el').forEach((v, i) => {
    if (i !== currentIdx) {
      v.pause();
    }
  });
  document.querySelectorAll('.music-disc').forEach((d, i) => {
    d.classList.toggle('playing', i === currentIdx);
  });
}

// ===========================
//  MUTE TOGGLE
// ===========================
function toggleMute() {
  state.isMuted = !state.isMuted;
  document.querySelectorAll('.video-el').forEach(v => { v.muted = state.isMuted; });
  showMuteToast(true, state.isMuted);
}

function showMuteToast(show, isMuted, iconOverride, textOverride) {
  if (!show) return;
  const toast = dom.muteToast();
  dom.muteIcon().textContent = iconOverride || (isMuted ? '🔇' : '🔊');
  dom.muteText().textContent = textOverride || (isMuted ? 'Muted' : 'Unmuted');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1200);
}

// ===========================
//  LIKE
// ===========================
function triggerLike(index) {
  const item = state.feedData[index];
  item.isLiked = !item.isLiked;
  item.likeCount += item.isLiked ? 1 : -1;

  const likeBtn = document.querySelector(`.video-item[data-index="${index}"] .like-btn`);
  if (!likeBtn) return;

  likeBtn.classList.toggle('liked', item.isLiked);
  likeBtn.querySelector('.action-icon-wrap').textContent = item.isLiked ? '❤️' : '🤍';
  likeBtn.querySelector('.action-count').textContent = formatNum(item.likeCount);

  if (item.isLiked) {
    likeBtn.classList.remove('liked');
    void likeBtn.offsetWidth;
    likeBtn.classList.add('liked');
  }
}

// ===========================
//  FOLLOW
// ===========================
function triggerFollow(videoId) {
  const item = state.feedData.find(v => v.id === parseInt(videoId));
  if (!item) return;
  item.user.following = !item.user.following;

  document.querySelectorAll(`[data-follow="${videoId}"]`).forEach(btn => {
    btn.classList.toggle('following', item.user.following);
    btn.textContent = item.user.following ? '✓' : '+';
  });
  showToast(item.user.following ? `Following ${item.user.username}` : `Unfollowed ${item.user.username}`);
}

// ===========================
//  COMMENTS
// ===========================
function openComments(index) {
  const item = state.feedData[index];
  dom.commentCount().textContent = item.comments;

  const list = dom.commentList();
  list.innerHTML = '';

  item.comments_data.forEach(c => {
    const el = document.createElement('div');
    el.className = 'comment-item';
    el.innerHTML = `
      <img class="comment-avatar" src="${c.avatar}" alt="${c.user}" loading="lazy">
      <div class="comment-body">
        <div class="comment-user">${c.user}</div>
        <div class="comment-text">${c.text}</div>
        <div class="comment-meta">
          <span class="comment-time">${c.time} lalu</span>
          <button class="comment-reply-btn">Balas</button>
          <div class="comment-like-wrap">
            <span class="comment-like-btn">🤍</span>
            <span class="comment-like-count">${c.likes}</span>
          </div>
        </div>
      </div>
    `;
    list.appendChild(el);
  });

  openDrawer('comment');
}

function addComment(text, index) {
  if (!text.trim()) return;
  const item = state.feedData[index];
  item.comments_data.unshift({
    id: 'c_' + Date.now(),
    user: '@myusername',
    avatar: './assets/avatar-ipi.png',
    text: text,
    time: 'Baru saja',
    likes: 0
  });
  item.commentCount = (item.commentCount || 0) + 1;
  openComments(index);
  showToast('Komentar dikirim! 💬');
}

// ===========================
//  DRAWERS & MODALS
// ===========================
function openDrawer(type) {
  state.activeDrawer = type;
  dom.backdrop().classList.add('show');
  if (type === 'comment') dom.commentDrawer().classList.add('open');
  else if (type === 'share') dom.shareModal().classList.add('open');
  pauseCurrentVideo();
}

function closeDrawer() {
  dom.backdrop().classList.remove('show');
  dom.commentDrawer().classList.remove('open');
  dom.shareModal().classList.remove('open');
  state.activeDrawer = null;
  resumeCurrentVideo();
}

function pauseCurrentVideo() {
  const video = document.querySelectorAll('.video-el')[state.currentIndex];
  if (video) video.pause();
}

function resumeCurrentVideo() {
  const video = document.querySelectorAll('.video-el')[state.currentIndex];
  if (video) video.play().catch(() => {});
}

// ===========================
//  PAGE NAVIGATION
// ===========================
function navigateTo(page) {
  if (page === state.activePage) return;
  const prev = state.activePage;
  state.activePage = page;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  if (page === 'search') {
    dom.searchPage().classList.add('open');
    pauseCurrentVideo();
    setTimeout(() => document.getElementById('searchInput').focus(), 400);
  } else if (page === 'profile') {
    dom.profilePage().classList.add('open');
    pauseCurrentVideo();
  } else if (page === 'home') {
    dom.searchPage().classList.remove('open');
    dom.profilePage().classList.remove('open');
    resumeCurrentVideo();
  } else if (page === 'inbox') {
    showToast('Inbox — Segera hadir! 📬');
    state.activePage = prev;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === prev);
    });
  } else if (page === 'create') {
    showToast('Upload konten — Segera hadir! 🎬');
    state.activePage = prev;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === prev);
    });
  }
}

function goBack() {
  navigateTo('home');
}

// ===========================
//  TRENDING CREATORS
// ===========================
function buildTrendingCreators() {
  const container = dom.trendingCreators();
  if (!container) return;
  container.innerHTML = '';

  TRENDING_CREATORS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'creator-item';
    el.innerHTML = `
      <img class="creator-avatar" src="${c.avatar}" alt="${c.displayName}" loading="lazy">
      <div class="creator-info">
        <div class="creator-name">${c.displayName}</div>
        <div class="creator-handle">${c.username}</div>
        <div class="creator-followers">${c.followers} followers</div>
      </div>
      <button class="follow-creator-btn ${c.following ? 'following' : ''}"
        onclick="toggleCreatorFollow(this, '${c.username}')">
        ${c.following ? 'Following' : 'Follow'}
      </button>
    `;
    container.appendChild(el);
  });
}

window.toggleCreatorFollow = function(btn, username) {
  const isFollowing = btn.classList.contains('following');
  btn.classList.toggle('following', !isFollowing);
  btn.textContent = isFollowing ? 'Follow' : 'Following';
  showToast(isFollowing ? `Unfollowed ${username}` : `Following ${username} ✓`);
};

// ===========================
//  PROFILE GRID
// ===========================
function buildProfileGrid() {
  const grid = dom.profileGrid();
  if (!grid) return;
  grid.innerHTML = '';

  state.feedData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'profile-video-thumb';
    el.innerHTML = `
      <img src="${item.thumbnail}" alt="post ${i+1}" loading="lazy">
      <span class="profile-video-views">❤️ ${item.likes}</span>
    `;
    el.addEventListener('click', () => {
      goBack();
      setTimeout(() => {
        const target = document.querySelectorAll('.video-item')[i];
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });
    grid.appendChild(el);
  });
}

// ===========================
//  COPY LINK
// ===========================
window.copyLink = function() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link disalin! 🔗'));
  } else {
    showToast('Link disalin! 🔗');
  }
  closeDrawer();
};

// ===========================
//  TOAST
// ===========================
function showToast(msg) {
  const t = dom.toast();
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ===========================
//  HELPERS
// ===========================
function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

// ===========================
//  EVENT BINDING
// ===========================
function bindEvents() {
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(btn.dataset.tab === 'following' ? 'Feed Following' : 'Feed For You');
    });
  });

  document.getElementById('searchHeaderBtn').addEventListener('click', () => navigateTo('search'));

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Action sidebar delegation
  dom.feed().addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index);

    if (action === 'like') triggerLike(index);
    else if (action === 'comment') openComments(index);
    else if (action === 'share') openDrawer('share');
    else if (action === 'bookmark') showToast('Disimpan! 🔖');
    else if (action === 'avatar') showToast(state.feedData[index].user.username);

    e.stopPropagation();
  });

  // Follow buttons
  dom.feed().addEventListener('click', (e) => {
    const btn = e.target.closest('[data-follow]');
    if (!btn) return;
    triggerFollow(btn.dataset.follow);
    e.stopPropagation();
  });

  // Backdrop
  dom.backdrop().addEventListener('click', closeDrawer);

  // Close comment
  document.getElementById('closeCommentBtn').addEventListener('click', closeDrawer);

  // Send comment
  document.getElementById('commentSendBtn').addEventListener('click', () => {
    const input = dom.commentInput();
    addComment(input.value, state.currentIndex);
    input.value = '';
  });
  document.getElementById('commentInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const input = dom.commentInput();
      addComment(input.value, state.currentIndex);
      input.value = '';
    }
  });

  // Close share
  document.getElementById('closeShareBtn').addEventListener('click', closeDrawer);

  // Search back
  document.getElementById('searchBackBtn').addEventListener('click', goBack);

  // Search clear
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'block' : 'none';
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
  });

  // Profile back
  document.getElementById('profileBackBtn').addEventListener('click', goBack);

  // Profile tabs
  document.querySelectorAll('.profile-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (i === 1) showToast('Video yang disukai');
      if (i === 2) showToast('Video privat');
    });
  });

  // Keyboard shortcuts (desktop)
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (e.key === 'ArrowUp') scrollToPrev();
    if (e.key === 'ArrowDown') scrollToNext();
    if (e.key === ' ') { e.preventDefault(); pauseCurrentVideo(); }
    if (e.key === 'm') toggleMute();
    if (e.key === 'Escape') { if (state.activeDrawer) closeDrawer(); else goBack(); }
    if (e.key === 'l') triggerLike(state.currentIndex);
  });
}

function scrollToNext() {
  const items = document.querySelectorAll('.video-item');
  if (state.currentIndex < items.length - 1) {
    items[state.currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToPrev() {
  const items = document.querySelectorAll('.video-item');
  if (state.currentIndex > 0) {
    items[state.currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
  }
}

// ===========================
//  START
// ===========================
document.addEventListener('DOMContentLoaded', init);
