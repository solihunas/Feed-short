// =============================================
//  FEEDSHORT — Main Application v2.0
// =============================================

'use strict';

const state = {
  currentIndex: 0,
  isMuted: true,
  activeDrawer: null,
  activePage: 'home',
  feedData: JSON.parse(JSON.stringify(FEED_DATA)),
  loadedCount: BATCH_SIZE,
  isLoadingMore: false,
};

let scrollObserver = null;
let infiniteObserver = null;

const $ = id => document.getElementById(id);

const dom = {
  feed:             () => $('feedContainer'),
  toast:            () => $('toastEl'),
  muteToast:        () => $('muteToast'),
  muteIcon:         () => $('muteIcon'),
  muteText:         () => $('muteText'),
  backdrop:         () => $('backdropEl'),
  commentDrawer:    () => $('commentDrawer'),
  commentList:      () => $('commentList'),
  commentCount:     () => $('commentCountLabel'),
  commentInput:     () => $('commentInput'),
  shareModal:       () => $('shareModal'),
  searchPage:       () => $('searchPage'),
  profilePage:      () => $('profilePage'),
  profileGrid:      () => $('profileVideosGrid'),
  trendingCreators: () => $('trendingCreators'),
};

// ===========================
//  INIT
// ===========================
function init() {
  buildFeed();
  buildTrendingCreators();
  buildProfileGrid();
  bindEvents();
  bindUploadEvents();
  bindAuthEvents();
  setupPullToRefresh();
  if (typeof initFirebase === 'function') initFirebase();
  setTimeout(() => $('loadingScreen').classList.add('hidden'), 900);
}

// ===========================
//  BUILD FEED
// ===========================
function buildFeed() {
  const container = dom.feed();
  container.innerHTML = '';

  if (scrollObserver)  scrollObserver.disconnect();
  if (infiniteObserver) infiniteObserver.disconnect();

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el  = entry.target;
      const idx = parseInt(el.dataset.index);
      const video = el.querySelector('.video-el');
      const disc  = el.querySelector('.music-disc');

      if (entry.isIntersecting) {
        state.currentIndex = idx;
        pauseAllExcept(idx);
        if (video) { video.muted = state.isMuted; video.play().catch(() => {}); }
        if (disc)  disc.classList.add('playing');
      } else {
        if (video) video.pause();
        if (disc)  disc.classList.remove('playing');
      }
    });
  }, { threshold: 0.8 });

  state.feedData.slice(0, state.loadedCount).forEach((item, index) => {
    const el = createFeedItem(item, index);
    container.appendChild(el);
    scrollObserver.observe(el);
  });

  setupInfiniteScroll();
}

// ===========================
//  CREATE FEED ITEM
// ===========================
function createFeedItem(item, index) {
  const div = document.createElement('div');
  div.className = 'video-item';
  div.dataset.index = index;
  div.dataset.id = item.id;

  const hashtagsHtml = item.hashtags.map(h => `<span class="hashtag-tag">${h}</span>`).join(' ');
  const musicText    = item.music + ' · ' + item.music + ' · ';

  let mediaHtml = '';
  if (item.type === 'carousel' && item.mediaUrls?.length > 1) {
    const slides = item.mediaUrls.map((url, i) =>
      `<div class="carousel-slide"><img src="${url}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}"></div>`
    ).join('');
    const dots = item.mediaUrls.map((_, i) =>
      `<div class="carousel-dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');
    mediaHtml = `
      <div class="carousel-wrap">
        <div class="carousel-track" id="carousel-track-${index}">${slides}</div>
      </div>
      <div class="carousel-dots" id="carousel-dots-${index}">${dots}</div>
      <div class="carousel-count" id="carousel-count-${index}">1 / ${item.mediaUrls.length}</div>`;
  } else if (item.type === 'image') {
    mediaHtml = `<img class="feed-image" src="${item.imageUrl || item.thumbnail}" alt="" loading="${index < 3 ? 'eager' : 'lazy'}">`;
  } else {
    mediaHtml = `
      <img class="video-thumb" src="${item.thumbnail}" alt="" loading="lazy">
      <video class="video-el" src="${item.videoUrl}"
        loop muted playsinline preload="${index < 2 ? 'metadata' : 'none'}"
        poster="${item.thumbnail}" data-index="${index}"></video>`;
  }

  div.innerHTML = `
    ${mediaHtml}
    <div class="video-gradient-top"></div>
    <div class="video-gradient-bottom"></div>

    <div class="action-sidebar">
      <div class="sidebar-avatar-wrap action-btn" data-action="avatar" data-index="${index}">
        <img class="sidebar-avatar" src="${item.user.avatar}" alt="" loading="lazy">
        <div class="sidebar-follow${item.user.following ? ' following' : ''}" data-follow="${item.id}">
          ${item.user.following ? '✓' : '+'}
        </div>
      </div>
      <div class="action-btn like-btn${item.isLiked ? ' liked' : ''}" data-action="like" data-index="${index}">
        <div class="action-icon-wrap">${item.isLiked ? '❤️' : '🤍'}</div>
        <span class="action-count like-count">${formatNum(item.likeCount)}</span>
      </div>
      <div class="action-btn" data-action="comment" data-index="${index}">
        <div class="action-icon-wrap">💬</div>
        <span class="action-count">${formatNum(item.commentCount)}</span>
      </div>
      <div class="action-btn" data-action="share" data-index="${index}">
        <div class="action-icon-wrap">↗️</div>
        <span class="action-count">${formatNum(item.shareCount)}</span>
      </div>
      <div class="action-btn${item.isBookmarked ? ' bookmarked' : ''}" data-action="bookmark" data-index="${index}">
        <div class="action-icon-wrap">${item.isBookmarked ? '🔖' : '📎'}</div>
        <span class="action-count">Simpan</span>
      </div>
      <div class="music-disc" data-disc="${index}">
        <img src="${item.user.avatar}" alt="music">
        <div class="music-disc-center"></div>
      </div>
    </div>

    <div class="video-info">
      <div class="video-username">
        ${item.user.username}
        ${item.user.verified ? '<span class="verified-badge">✓</span>' : ''}
      </div>
      <div class="video-description">${item.description}</div>
      <div class="video-hashtags">${hashtagsHtml}</div>
      <div class="video-music">
        <span class="music-note-icon">🎵</span>
        <div class="music-marquee-wrap"><span class="music-marquee">${musicText}</span></div>
      </div>
    </div>

    <div class="video-progress" data-index="${index}">
      <div class="video-progress-fill" id="progress-${index}"
        style="${item.type !== 'video' ? 'width:100%' : ''}"></div>
    </div>`;

  if (item.type === 'carousel') {
    bindCarouselEvents(div, index);
  } else if (item.type === 'video') {
    bindVideoEvents(div.querySelector('.video-el'), div, index);
  }
  bindTapEvents(div, index, item.type);
  return div;
}

// ===========================
//  CAROUSEL EVENTS
// ===========================
function bindCarouselEvents(container, index) {
  const track = container.querySelector(`#carousel-track-${index}`);
  if (!track) return;
  const total = state.feedData[index].mediaUrls.length;
  let cur = 0, startX = 0;

  const goTo = n => {
    cur = Math.max(0, Math.min(n, total - 1));
    track.style.transform = `translateX(-${cur * 100}%)`;
    container.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    const el = container.querySelector(`#carousel-count-${index}`);
    if (el) el.textContent = `${cur + 1} / ${total}`;
  };

  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const d = startX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) goTo(cur + (d > 0 ? 1 : -1));
  });
  track.addEventListener('mousedown', e => { startX = e.clientX; });
  track.addEventListener('mouseup',   e => {
    const d = startX - e.clientX;
    if (Math.abs(d) > 40) goTo(cur + (d > 0 ? 1 : -1));
  });
}

// ===========================
//  TAP EVENTS
// ===========================
function bindTapEvents(container, index, type) {
  let tapCount = 0, tapTimer = null, tapX = 0, tapY = 0;

  container.addEventListener('click', e => {
    if (e.target.closest('.action-sidebar') || e.target.closest('.video-progress')) return;
    tapX = e.clientX; tapY = e.clientY;
    tapCount++;

    if (tapCount === 1) {
      tapTimer = setTimeout(() => {
        tapCount = 0;
        if (type === 'video') togglePlayPause(container.querySelector('.video-el'));
      }, 280);
    } else if (tapCount >= 2) {
      clearTimeout(tapTimer);
      tapCount = 0;
      doubleTapLike(index, tapX, tapY);
    }
  });
}

// ===========================
//  VIDEO EVENTS
// ===========================
function bindVideoEvents(video, container, index) {
  if (!video) return;

  video.addEventListener('loadeddata', () => {
    const thumb = container.querySelector('.video-thumb');
    if (thumb) thumb.style.opacity = '0';
  });

  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const fill = $(`progress-${index}`);
    if (fill) fill.style.width = (video.currentTime / video.duration * 100) + '%';
  });

  const bar = container.querySelector('.video-progress');
  if (bar) {
    bar.addEventListener('click', e => {
      e.stopPropagation();
      if (!video.duration) return;
      const rect = bar.getBoundingClientRect();
      video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
    });
  }
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

// ===========================
//  DOUBLE TAP LIKE (at position)
// ===========================
function doubleTapLike(index, x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = '❤️';
  heart.style.left = x + 'px';
  heart.style.top  = y + 'px';
  document.body.appendChild(heart);

  // Double-rAF to ensure class applies after paint
  requestAnimationFrame(() => requestAnimationFrame(() => heart.classList.add('animate')));
  setTimeout(() => heart.remove(), 900);

  if (!state.feedData[index]?.isLiked) triggerLike(index);
}

// ===========================
//  SCROLL — pause all except current
// ===========================
function pauseAllExcept(currentIdx) {
  document.querySelectorAll('.video-item').forEach(item => {
    const idx   = parseInt(item.dataset.index);
    const video = item.querySelector('.video-el');
    const disc  = item.querySelector('.music-disc');
    if (idx !== currentIdx) {
      if (video) video.pause();
      if (disc)  disc.classList.remove('playing');
    }
  });
}

// ===========================
//  INFINITE SCROLL
// ===========================
function setupInfiniteScroll() {
  if (infiniteObserver) infiniteObserver.disconnect();
  if (state.loadedCount >= state.feedData.length) return;

  const items = document.querySelectorAll('.video-item');
  if (!items.length) return;
  const lastItem = items[items.length - 1];

  infiniteObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !state.isLoadingMore) loadMoreItems();
  }, { threshold: 0.5 });

  infiniteObserver.observe(lastItem);
}

function loadMoreItems() {
  if (state.isLoadingMore || state.loadedCount >= state.feedData.length) return;
  state.isLoadingMore = true;

  const container = dom.feed();
  const newCount  = Math.min(state.loadedCount + BATCH_SIZE, state.feedData.length);

  for (let i = state.loadedCount; i < newCount; i++) {
    const el = createFeedItem(state.feedData[i], i);
    container.appendChild(el);
    if (scrollObserver) scrollObserver.observe(el);
  }

  state.loadedCount  = newCount;
  state.isLoadingMore = false;
  setupInfiniteScroll();
}

// ===========================
//  PULL TO REFRESH
// ===========================
function setupPullToRefresh() {
  const ptr = document.createElement('div');
  ptr.className = 'ptr-wrap';
  ptr.innerHTML = '<div class="ptr-spinner"></div>';
  document.body.appendChild(ptr);

  const feed = dom.feed();
  let startY = 0, pulling = false, refreshing = false;

  feed.addEventListener('touchstart', e => {
    if (feed.scrollTop === 0 && !refreshing) { startY = e.touches[0].clientY; pulling = true; }
  }, { passive: true });

  feed.addEventListener('touchmove', e => {
    if (!pulling) return;
    if (e.touches[0].clientY - startY > 60) ptr.classList.add('show');
  }, { passive: true });

  feed.addEventListener('touchend', e => {
    if (!pulling) return;
    pulling = false;
    const delta = e.changedTouches[0].clientY - startY;
    if (delta > 90 && !refreshing) {
      refreshing = true;
      setTimeout(() => {
        ptr.classList.remove('show');
        state.loadedCount = BATCH_SIZE;
        state.feedData = JSON.parse(JSON.stringify(FEED_DATA));
        buildFeed();
        showToast('Feed diperbarui ✨');
        refreshing = false;
      }, 700);
    } else {
      ptr.classList.remove('show');
    }
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
  const icon  = dom.muteIcon();
  const text  = dom.muteText();
  if (icon)  icon.textContent  = iconOverride  || (isMuted ? '🔇' : '🔊');
  if (text)  text.textContent  = textOverride  || (isMuted ? 'Muted' : 'Unmuted');
  if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1200); }
}

// ===========================
//  LIKE
// ===========================
function triggerLike(index) {
  const item = state.feedData[index];
  if (!item) return;
  item.isLiked   = !item.isLiked;
  item.likeCount += item.isLiked ? 1 : -1;

  const likeBtn = document.querySelector(`.video-item[data-index="${index}"] .like-btn`);
  if (!likeBtn) return;
  likeBtn.classList.toggle('liked', item.isLiked);
  likeBtn.querySelector('.action-icon-wrap').textContent = item.isLiked ? '❤️' : '🤍';
  likeBtn.querySelector('.like-count').textContent = formatNum(item.likeCount);

  // Trigger pop animation re-run
  const wrap = likeBtn.querySelector('.action-icon-wrap');
  wrap.style.animation = 'none';
  void wrap.offsetWidth;
  wrap.style.animation = '';
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
  showToast(item.user.following ? `Following ${item.user.username} ✓` : `Unfollowed ${item.user.username}`);
}

// ===========================
//  COMMENTS
// ===========================
function openComments(index) {
  const item = state.feedData[index];
  if (!item) return;
  const countEl = dom.commentCount();
  if (countEl) countEl.textContent = item.commentCount;

  const list = dom.commentList();
  if (!list) return;
  list.innerHTML = '';

  (item.comments_data || []).forEach(c => {
    const el = document.createElement('div');
    el.className = 'comment-item';
    el.innerHTML = `
      <img class="comment-avatar" src="${c.avatar}" alt="" loading="lazy">
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
      </div>`;
    list.appendChild(el);
  });
  openDrawer('comment');
}

function addComment(text, index) {
  if (!text.trim()) return;
  const item = state.feedData[index];
  if (!item) return;
  if (!item.comments_data) item.comments_data = [];
  item.comments_data.unshift({ id: 'c_' + Date.now(), user: '@saya', avatar: './assets/avatar-ipi.png', text, time: 'baru saja', likes: 0 });
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
  const item = document.querySelector(`.video-item[data-index="${state.currentIndex}"]`);
  const v = item?.querySelector('.video-el');
  if (v) v.pause();
}

function resumeCurrentVideo() {
  const item = document.querySelector(`.video-item[data-index="${state.currentIndex}"]`);
  const v = item?.querySelector('.video-el');
  if (v) v.play().catch(() => {});
}

// ===========================
//  PAGE NAVIGATION
// ===========================
function navigateTo(page) {
  if (page === 'create') { openUploadModal(); return; }
  if (page === 'inbox')  { showToast('Inbox — Segera hadir! 📬'); return; }
  if (page === state.activePage) return;

  state.activePage = page;
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page)
  );

  if (page === 'search') {
    dom.searchPage().classList.add('open');
    pauseCurrentVideo();
    setTimeout(() => $('searchInput')?.focus(), 400);
  } else if (page === 'profile') {
    dom.profilePage().classList.add('open');
    pauseCurrentVideo();
  } else if (page === 'home') {
    dom.searchPage().classList.remove('open');
    dom.profilePage().classList.remove('open');
    resumeCurrentVideo();
    document.querySelectorAll('.nav-item').forEach(el =>
      el.classList.toggle('active', el.dataset.page === 'home')
    );
  }
}

function goBack() { navigateTo('home'); }

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
      <img class="creator-avatar" src="${c.avatar}" alt="" loading="lazy">
      <div class="creator-info">
        <div class="creator-name">${c.displayName}</div>
        <div class="creator-handle">${c.username}</div>
        <div class="creator-followers">${c.followers} followers</div>
      </div>
      <button class="follow-creator-btn${c.following ? ' following' : ''}"
        onclick="toggleCreatorFollow(this,'${c.username}')">
        ${c.following ? 'Following' : 'Follow'}
      </button>`;
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
      <img src="${item.thumbnail}" alt="" loading="lazy">
      <span class="profile-video-views">❤️ ${formatNum(item.likeCount)}</span>`;
    el.addEventListener('click', () => {
      goBack();
      setTimeout(() => {
        document.querySelectorAll('.video-item')[i]?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });
    grid.appendChild(el);
  });
}

// ===========================
//  SHARE (Web Share API)
// ===========================
async function triggerShare(index) {
  const item = state.feedData[index];
  const data = {
    title: item ? `${item.user.displayName} on FeedShort` : 'FeedShort',
    text:  item?.description || '',
    url:   window.location.href,
  };
  if (navigator.share) {
    try { await navigator.share(data); return; } catch (_) {}
  }
  openDrawer('share');
}

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
//  TOAST & HELPERS
// ===========================
function showToast(msg) {
  const t = dom.toast();
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function formatNum(n) {
  n = Number(n) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function showAuthError(msg) {
  const el = $('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ===========================
//  EVENT BINDING
// ===========================
function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(btn.dataset.tab === 'following' ? 'Feed Following' : 'Feed For You');
    });
  });

  $('searchHeaderBtn')?.addEventListener('click', () => navigateTo('search'));

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Feed action delegation
  dom.feed().addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;
    const index  = parseInt(btn.dataset.index);

    if (action === 'like')     triggerLike(index);
    else if (action === 'comment') openComments(index);
    else if (action === 'share')   triggerShare(index);
    else if (action === 'bookmark') {
      const item = state.feedData[index];
      if (item) {
        item.isBookmarked = !item.isBookmarked;
        btn.querySelector('.action-icon-wrap').textContent = item.isBookmarked ? '🔖' : '📎';
        btn.classList.toggle('bookmarked', item.isBookmarked);
        showToast(item.isBookmarked ? 'Disimpan! 🔖' : 'Dihapus dari simpanan');
      }
    }
    else if (action === 'avatar') showToast(state.feedData[index]?.user.username || '');
  });

  // Follow buttons
  dom.feed().addEventListener('click', e => {
    const btn = e.target.closest('[data-follow]');
    if (!btn) return;
    triggerFollow(btn.dataset.follow);
    e.stopPropagation();
  });

  dom.backdrop()?.addEventListener('click', closeDrawer);
  $('closeCommentBtn')?.addEventListener('click', closeDrawer);
  $('commentSendBtn')?.addEventListener('click', () => {
    const input = dom.commentInput();
    if (input) { addComment(input.value, state.currentIndex); input.value = ''; }
  });
  $('commentInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const input = dom.commentInput();
      if (input) { addComment(input.value, state.currentIndex); input.value = ''; }
    }
  });

  $('closeShareBtn')?.addEventListener('click', closeDrawer);
  $('searchBackBtn')?.addEventListener('click', goBack);

  const searchInput = $('searchInput');
  const clearBtn    = $('searchClearBtn');
  if (searchInput && clearBtn) {
    searchInput.addEventListener('input', () => {
      clearBtn.style.display = searchInput.value ? 'block' : 'none';
    });
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
    });
  }

  $('profileBackBtn')?.addEventListener('click', goBack);
  document.querySelectorAll('.profile-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (i === 1) showToast('Video yang disukai');
      if (i === 2) showToast('Video privat');
    });
  });

  // Keyboard shortcuts (desktop)
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    const items = document.querySelectorAll('.video-item');
    if (e.key === 'ArrowUp')   items[state.currentIndex - 1]?.scrollIntoView({ behavior: 'smooth' });
    if (e.key === 'ArrowDown') items[state.currentIndex + 1]?.scrollIntoView({ behavior: 'smooth' });
    if (e.key === ' ') { e.preventDefault(); pauseCurrentVideo(); }
    if (e.key === 'm') toggleMute();
    if (e.key === 'Escape') { if (state.activeDrawer) closeDrawer(); else goBack(); }
    if (e.key === 'l') triggerLike(state.currentIndex);
  });
}

// ===========================
//  UPLOAD EVENTS
// ===========================
function bindUploadEvents() {
  const fileInput = $('mediaFileInput');
  if (!fileInput) return;
  window._uploadFiles = [];

  fileInput.addEventListener('change', e => {
    addFilesToUpload(Array.from(e.target.files));
    e.target.value = '';
  });

  $('uploadCaption')?.addEventListener('input', function() {
    const el = $('captionLen');
    if (el) el.textContent = this.value.length;
  });

  const dropzone = $('uploadDropzone');
  dropzone?.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone?.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    addFilesToUpload(Array.from(e.dataTransfer.files));
  });
}

function addFilesToUpload(files) {
  files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).forEach(file => {
    if (file.type.startsWith('video/')) {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.src = URL.createObjectURL(file);
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(vid.src);
        if (vid.duration > 60) { showToast('Video terlalu panjang (maks 60 detik) ⚠️'); return; }
        window._uploadFiles.push(file);
        renderUploadPreviews();
      };
    } else {
      window._uploadFiles.push(file);
      renderUploadPreviews();
    }
  });
}

function renderUploadPreviews() {
  const grid    = $('mediaPreviewGrid');
  const dropzone = $('uploadDropzone');
  if (!grid) return;
  grid.innerHTML = '';
  if (!window._uploadFiles.length) { if (dropzone) dropzone.style.display = 'flex'; return; }
  if (dropzone) dropzone.style.display = 'none';

  window._uploadFiles.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    item.innerHTML = isVideo
      ? `<video src="${url}" muted playsinline></video><span class="preview-type-badge">VIDEO</span>`
      : `<img src="${url}" alt="">`;
    const rm = document.createElement('span');
    rm.className = 'preview-remove';
    rm.textContent = '✕';
    rm.onclick = e => { e.stopPropagation(); window._uploadFiles.splice(i, 1); renderUploadPreviews(); };
    item.appendChild(rm);
    grid.appendChild(item);
  });

  if (window._uploadFiles.length < 10) {
    const addMore = document.createElement('div');
    addMore.className = 'preview-add-more';
    addMore.textContent = '+';
    addMore.onclick = () => $('mediaFileInput')?.click();
    grid.appendChild(addMore);
  }
}

async function handleUploadSubmit() {
  const files = window._uploadFiles || [];
  if (!files.length) { showToast('Pilih foto atau video dulu!'); return; }

  const caption  = $('uploadCaption')?.value || '';
  const hashtags = $('uploadHashtags')?.value || '';
  const music    = $('uploadMusic')?.value || '';

  if ($('uploadProgress')) $('uploadProgress').style.display = 'block';
  if ($('uploadPostBtn'))  $('uploadPostBtn').disabled = true;

  if (DEMO_MODE) {
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(pct + 10, 100);
      updateUploadProgress(pct);
      if (pct >= 100) { clearInterval(iv); showToast('Demo: Konten "diupload" berhasil! 🎉'); closeUploadModal(); }
    }, 150);
    return;
  }

  await createPost(files, caption, hashtags, music, updateUploadProgress);
  if ($('uploadPostBtn')) $('uploadPostBtn').disabled = false;
}

function updateUploadProgress(pct) {
  const el   = $('uploadPct');
  const fill = $('uploadProgressFill');
  if (el)   el.textContent = pct;
  if (fill) fill.style.width = pct + '%';
}

window.handleUploadSubmit = handleUploadSubmit;

// ===========================
//  AUTH EVENTS
// ===========================
function bindAuthEvents() {
  $('authSubmitBtn')?.addEventListener('click', handleAuthSubmit);
  $('authPassword')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleAuthSubmit(); });
}

function handleAuthSubmit() {
  const modal    = $('authModal');
  const mode     = modal?.dataset.mode || 'login';
  const email    = $('authEmail')?.value.trim() || '';
  const password = $('authPassword')?.value || '';
  const errEl    = $('authError');
  if (errEl) errEl.style.display = 'none';

  if (!email || !password) { showAuthError('Email dan password harus diisi'); return; }

  if (mode === 'register') {
    const username = $('authUsername')?.value.trim() || '';
    const name     = $('authDisplayName')?.value.trim() || '';
    if (!username || !name) { showAuthError('Username dan nama harus diisi'); return; }
    registerUser(email, password, username, name);
  } else {
    loginUser(email, password);
  }
}

window.handleAuthSubmit = handleAuthSubmit;

// ===========================
//  START
// ===========================
document.addEventListener('DOMContentLoaded', init);
