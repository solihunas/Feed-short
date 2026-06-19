// =============================================
//  FEEDSHORT — Main Application
// =============================================

'use strict';

// ---- State ----
const state = {
  currentIndex: 0,
  isMuted: false,
  isPlaying: true,
  activeDrawer: null,     // 'comment' | 'share' | null
  activePage: 'home',     // 'home' | 'search' | 'profile' | 'inbox'
  currentVideoId: null,
  feedData: JSON.parse(JSON.stringify(FEED_DATA)), // mutable copy
  tapCount: 0,
  tapTimer: null
};

// ---- DOM refs ----
const dom = {
  loading: () => document.getElementById('loadingScreen'),
  feed: () => document.getElementById('feedContainer'),
  topHeader: () => document.getElementById('topHeader'),
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

  // Hide loading after feed is ready
  setTimeout(() => {
    dom.loading().classList.add('hidden');
    autoPlayCurrent();
  }, 1000);
}

// ===========================
//  BUILD FEED
// ===========================
function buildFeed() {
  const container = dom.feed();
  container.innerHTML = '';

  state.feedData.forEach((item, index) => {
    const el = createVideoItem(item, index);
    container.appendChild(el);
  });

  // Observe scroll for auto-play
  setupScrollObserver();
}

function createVideoItem(item, index) {
  const div = document.createElement('div');
  div.className = 'video-item';
  div.dataset.index = index;
  div.dataset.id = item.id;

  const hashtagsHtml = item.hashtags.map(h =>
    `<span class="hashtag-tag">${h}</span> `
  ).join('');

  const musicText = item.music + ' · ' + item.music + ' · ' + item.music;

  div.innerHTML = `
    <!-- Thumbnail (shown before video loads) -->
    <img class="video-thumb" src="${item.thumbnail}" alt="" loading="lazy">

    <!-- Video element -->
    <video
      class="video-el"
      src="${item.videoUrl}"
      loop
      muted
      playsinline
      preload="${index < 2 ? 'metadata' : 'none'}"
      poster="${item.thumbnail}"
      data-index="${index}"
    ></video>

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
        <div class="action-icon-wrap">
          ${item.isLiked ? '❤️' : '🤍'}
        </div>
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

      <div class="action-btn" data-action="sound" data-index="${index}">
        <div class="music-disc ${index === 0 ? 'playing' : ''}" data-disc="${index}">
          <img src="${item.user.avatar}" alt="music">
          <div class="music-disc-center"></div>
        </div>
      </div>
    </div>

    <!-- Bottom video info -->
    <div class="video-info">
      <div class="video-username">
        @${item.user.username.replace('@','')}
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

    <!-- Progress bar -->
    <div class="video-progress" data-index="${index}">
      <div class="video-progress-fill" id="progress-${index}"></div>
    </div>
  `;

  // Video event bindings
  const video = div.querySelector('.video-el');
  bindVideoEvents(video, div, index);

  return div;
}

// ===========================
//  VIDEO EVENTS
// ===========================
function bindVideoEvents(video, container, index) {
  // Single tap = pause/play; double tap = like
  let tapCount = 0;
  let tapTimer = null;

  container.addEventListener('click', (e) => {
    // Ignore clicks on action buttons
    if (e.target.closest('.action-sidebar') || e.target.closest('.video-progress')) return;

    tapCount++;
    if (tapCount === 1) {
      tapTimer = setTimeout(() => {
        tapCount = 0;
        togglePlayPause(video);
      }, 250);
    } else if (tapCount === 2) {
      clearTimeout(tapTimer);
      tapCount = 0;
      doubleTapLike(index);
    }
  });

  // Progress tracking
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    const fill = document.getElementById(`progress-${index}`);
    if (fill) fill.style.width = pct + '%';
  });

  // Seek on progress bar click
  const progressBar = container.querySelector('.video-progress');
  progressBar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  // When video ends, reset progress
  video.addEventListener('ended', () => {
    const fill = document.getElementById(`progress-${index}`);
    if (fill) fill.style.width = '0%';
  });
}

function togglePlayPause(video) {
  if (!video) return;
  if (video.paused) {
    video.play().catch(() => {});
    showMuteToast(false, false); // show play indicator
  } else {
    video.pause();
    showPauseToast();
  }
}

function doubleTapLike(index) {
  // Trigger heart animation
  const heart = dom.heartPop();
  heart.classList.remove('animate');
  void heart.offsetWidth; // reflow
  heart.classList.add('animate');
  setTimeout(() => heart.classList.remove('animate'), 800);

  // Also trigger the like button
  if (!state.feedData[index].isLiked) {
    triggerLike(index);
  }
}

// ===========================
//  INTERSECTION OBSERVER (auto-play)
// ===========================
function setupScrollObserver() {
  const options = { threshold: 0.65 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = parseInt(entry.target.dataset.index);
      const video = entry.target.querySelector('.video-el');
      const disc = entry.target.querySelector('.music-disc');

      if (entry.isIntersecting) {
        state.currentIndex = idx;
        state.currentVideoId = state.feedData[idx].id;

        // Pause all others
        pauseAllExcept(idx);

        // Play current
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
  }, options);

  document.querySelectorAll('.video-item').forEach(el => observer.observe(el));
}

function pauseAllExcept(currentIdx) {
  document.querySelectorAll('.video-el').forEach((v, i) => {
    if (i !== currentIdx) {
      v.pause();
      const disc = document.querySelectorAll('.music-disc')[i];
      if (disc) disc.classList.remove('playing');
    }
  });
}

function autoPlayCurrent() {
  const video = document.querySelectorAll('.video-el')[0];
  if (video) {
    video.muted = false;
    video.play().catch(() => {
      // Autoplay blocked, play muted
      video.muted = true;
      video.play().catch(() => {});
    });
    const disc = document.querySelectorAll('.music-disc')[0];
    if (disc) disc.classList.add('playing');
  }
}

// ===========================
//  MUTE TOGGLE
// ===========================
function toggleMute() {
  state.isMuted = !state.isMuted;
  document.querySelectorAll('.video-el').forEach(v => {
    v.muted = state.isMuted;
  });
  showMuteToast(true, state.isMuted);
}

function showMuteToast(show, isMuted) {
  if (!show) return;
  const toast = dom.muteToast();
  dom.muteIcon().textContent = isMuted ? '🔇' : '🔊';
  dom.muteText().textContent = isMuted ? 'Muted' : 'Unmuted';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1200);
}

function showPauseToast() {
  const toast = dom.muteToast();
  dom.muteIcon().textContent = '⏸';
  dom.muteText().textContent = 'Paused';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 800);
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

  const followBtns = document.querySelectorAll(`[data-follow="${videoId}"]`);
  followBtns.forEach(btn => {
    btn.classList.toggle('following', item.user.following);
    btn.textContent = item.user.following ? '✓' : '+';
  });

  showToast(item.user.following ? `Following @${item.user.username}` : `Unfollowed @${item.user.username}`);
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
          <button class="comment-reply-btn">Reply</button>
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

  const newComment = {
    id: 'c_new_' + Date.now(),
    user: '@myusername',
    avatar: 'https://i.pravatar.cc/100?img=20',
    text: text,
    time: 'Baru saja',
    likes: 0
  };

  item.comments_data.unshift(newComment);
  item.commentCount = (item.commentCount || 0) + 1;

  // Refresh comment list
  openComments(index);
  showToast('Komentar dikirim! 💬');
}

// ===========================
//  DRAWERS & MODALS
// ===========================
function openDrawer(type) {
  state.activeDrawer = type;
  dom.backdrop().classList.add('show');

  if (type === 'comment') {
    dom.commentDrawer().classList.add('open');
  } else if (type === 'share') {
    dom.shareModal().classList.add('open');
  }

  // Pause current video when drawer opens
  pauseCurrentVideo();
}

function closeDrawer() {
  dom.backdrop().classList.remove('show');
  dom.commentDrawer().classList.remove('open');
  dom.shareModal().classList.remove('open');
  state.activeDrawer = null;

  // Resume video
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

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Handle page opens
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
    showToast('Inbox — Coming soon! 📬');
    // Revert nav selection back to home
    state.activePage = prev;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === prev);
    });
  } else if (page === 'create') {
    showToast('Upload Video — Coming soon! 🎬');
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

  const thumbs = [
    { img: 'https://picsum.photos/seed/p1/200/350', views: '1.2M' },
    { img: 'https://picsum.photos/seed/p2/200/350', views: '456K' },
    { img: 'https://picsum.photos/seed/p3/200/350', views: '89K' },
    { img: 'https://picsum.photos/seed/p4/200/350', views: '2.1M' },
    { img: 'https://picsum.photos/seed/p5/200/350', views: '334K' },
    { img: 'https://picsum.photos/seed/p6/200/350', views: '12K' },
    { img: 'https://picsum.photos/seed/p7/200/350', views: '780K' },
    { img: 'https://picsum.photos/seed/p8/200/350', views: '23K' },
    { img: 'https://picsum.photos/seed/p9/200/350', views: '5.6M' }
  ];

  thumbs.forEach(t => {
    const el = document.createElement('div');
    el.className = 'profile-video-thumb';
    el.innerHTML = `
      <img src="${t.img}" alt="video" loading="lazy">
      <span class="profile-video-views">▶ ${t.views}</span>
    `;
    grid.appendChild(el);
  });
}

// ===========================
//  COPY LINK
// ===========================
window.copyLink = function() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied! 🔗'));
  } else {
    showToast('Link copied! 🔗');
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
  // Tab buttons (Following / For You)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(btn.dataset.tab === 'following' ? 'Following feed' : 'For You feed');
    });
  });

  // Search header button
  document.getElementById('searchHeaderBtn').addEventListener('click', () => navigateTo('search'));

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Action sidebar (delegation on feed container)
  dom.feed().addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index);

    if (action === 'like') {
      triggerLike(index);
    } else if (action === 'comment') {
      openComments(index);
    } else if (action === 'share') {
      openDrawer('share');
    } else if (action === 'sound') {
      toggleMute();
    } else if (action === 'avatar') {
      // Could open user profile
      showToast(`@${state.feedData[index].user.username}`);
    }

    e.stopPropagation();
  });

  // Follow buttons in sidebar
  dom.feed().addEventListener('click', (e) => {
    const btn = e.target.closest('[data-follow]');
    if (!btn) return;
    triggerFollow(btn.dataset.follow);
    e.stopPropagation();
  });

  // Close drawers via backdrop
  dom.backdrop().addEventListener('click', closeDrawer);

  // Close comment drawer
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

  // Close share modal
  document.getElementById('closeShareBtn').addEventListener('click', closeDrawer);

  // Search page back
  document.getElementById('searchBackBtn').addEventListener('click', goBack);

  // Search input clear
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

  // Profile page back
  document.getElementById('profileBackBtn').addEventListener('click', goBack);

  // Profile tabs
  document.querySelectorAll('.profile-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (i === 1) showToast('Liked videos');
      if (i === 2) showToast('Private videos');
    });
  });

  // Header search btn
  document.getElementById('searchHeaderBtn').addEventListener('click', () => navigateTo('search'));

  // Keyboard shortcuts (desktop)
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (e.key === 'ArrowUp') scrollToPrev();
    if (e.key === 'ArrowDown') scrollToNext();
    if (e.key === ' ') {
      e.preventDefault();
      const video = document.querySelectorAll('.video-el')[state.currentIndex];
      togglePlayPause(video);
    }
    if (e.key === 'm') toggleMute();
    if (e.key === 'Escape') {
      if (state.activeDrawer) closeDrawer();
      else goBack();
    }
    if (e.key === 'l') triggerLike(state.currentIndex);
  });

  // Swipe gesture support (mobile)
  let touchStartY = 0;
  dom.feed().addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
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
