// =============================================
//  FIREBASE APP — Auth, Firestore, Storage
// =============================================

let firebaseApp = null;
let fbAuth = null;
let fbDb = null;
let fbStorage = null;
let currentUser = null;

// =============================================
//  INIT FIREBASE
// =============================================
async function initFirebase() {
  if (DEMO_MODE) {
    console.log('[FeedShort] Demo mode aktif — menggunakan data lokal');
    renderAuthUI(null);
    return;
  }

  try {
    // Import Firebase SDK (ESM CDN)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
            signInWithEmailAndPassword, signOut, updateProfile,
            GoogleAuthProvider, signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc,
            updateDoc, deleteDoc, query, orderBy, limit, onSnapshot,
            serverTimestamp, increment, where } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');

    firebaseApp = initializeApp(FIREBASE_CONFIG);
    fbAuth    = getAuth(firebaseApp);
    fbDb      = getFirestore(firebaseApp);
    fbStorage = getStorage(firebaseApp);

    // Simpan fungsi Firebase ke window agar bisa diakses modul lain
    window.FB = {
      auth: fbAuth, db: fbDb, storage: fbStorage,
      onAuthStateChanged, createUserWithEmailAndPassword,
      signInWithEmailAndPassword, signOut, updateProfile,
      GoogleAuthProvider, signInWithPopup,
      collection, doc, getDoc, getDocs, addDoc, setDoc,
      updateDoc, deleteDoc, query, orderBy, limit, onSnapshot,
      serverTimestamp, increment, where,
      ref, uploadBytesResumable, getDownloadURL, deleteObject
    };

    // Listen auth state
    onAuthStateChanged(fbAuth, (user) => {
      currentUser = user;
      window.currentUser = user;
      renderAuthUI(user);
      if (user) {
        loadFeedFromFirestore();
      }
    });

    console.log('[FeedShort] Firebase berhasil diinisialisasi');
  } catch (err) {
    console.error('[FeedShort] Firebase error:', err);
    showToast('Mode offline — menggunakan data demo');
  }
}

// =============================================
//  AUTH — REGISTER
// =============================================
async function registerUser(email, password, username, displayName) {
  if (DEMO_MODE) { showToast('Demo mode: Firebase belum dikonfigurasi'); return; }
  try {
    showAuthLoading(true);
    const { user } = await FB.createUserWithEmailAndPassword(FB.auth, email, password);

    await FB.updateProfile(user, {
      displayName: displayName,
      photoURL: './assets/avatar-ipi.png'
    });

    // Simpan profil ke Firestore
    await FB.setDoc(FB.doc(FB.db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      username: '@' + username.toLowerCase().replace(/\s/g, ''),
      displayName: displayName,
      avatar: './assets/avatar-ipi.png',
      bio: '',
      followers: 0,
      following: 0,
      totalLikes: 0,
      role: 'creator',
      createdAt: FB.serverTimestamp()
    });

    closeAuthModal();
    showToast(`Selamat datang, ${displayName}! 🎉`);
  } catch (err) {
    showAuthError(getAuthErrorMsg(err.code));
  } finally {
    showAuthLoading(false);
  }
}

// =============================================
//  AUTH — LOGIN
// =============================================
async function loginUser(email, password) {
  if (DEMO_MODE) { showToast('Demo mode: Firebase belum dikonfigurasi'); return; }
  try {
    showAuthLoading(true);
    await FB.signInWithEmailAndPassword(FB.auth, email, password);
    closeAuthModal();
    showToast('Selamat datang kembali! 👋');
  } catch (err) {
    showAuthError(getAuthErrorMsg(err.code));
  } finally {
    showAuthLoading(false);
  }
}

// =============================================
//  AUTH — GOOGLE LOGIN
// =============================================
async function loginWithGoogle() {
  if (DEMO_MODE) { showToast('Demo mode: Firebase belum dikonfigurasi'); return; }
  try {
    const provider = new FB.GoogleAuthProvider();
    const result = await FB.signInWithPopup(FB.auth, provider);
    const user = result.user;

    // Cek apakah user sudah ada di Firestore
    const userDoc = await FB.getDoc(FB.doc(FB.db, 'users', user.uid));
    if (!userDoc.exists()) {
      await FB.setDoc(FB.doc(FB.db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: '@' + user.displayName.toLowerCase().replace(/\s/g, ''),
        displayName: user.displayName,
        avatar: user.photoURL || './assets/avatar-ipi.png',
        bio: '',
        followers: 0,
        following: 0,
        totalLikes: 0,
        role: 'creator',
        createdAt: FB.serverTimestamp()
      });
    }

    closeAuthModal();
    showToast(`Login berhasil! 🚀`);
  } catch (err) {
    showAuthError('Login Google gagal. Coba lagi.');
  }
}

// =============================================
//  AUTH — LOGOUT
// =============================================
async function logoutUser() {
  if (DEMO_MODE) { showToast('Demo mode aktif'); return; }
  await FB.signOut(FB.auth);
  currentUser = null;
  showToast('Berhasil logout');
}

// =============================================
//  FIRESTORE — LOAD FEED
// =============================================
async function loadFeedFromFirestore() {
  if (DEMO_MODE || !FB) return;
  try {
    const q = FB.query(
      FB.collection(FB.db, 'posts'),
      FB.orderBy('createdAt', 'desc'),
      FB.limit(20)
    );

    // Real-time listener
    FB.onSnapshot(q, (snapshot) => {
      const posts = [];
      snapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      if (posts.length > 0) {
        state.feedData = posts.map(mapFirestorePost);
        buildFeed();
      }
    });
  } catch (err) {
    console.error('Load feed error:', err);
  }
}

function mapFirestorePost(post) {
  return {
    id: post.id,
    type: post.mediaUrls.length > 1 ? 'carousel' : (post.type || 'image'),
    imageUrl: post.mediaUrls[0],
    mediaUrls: post.mediaUrls,
    thumbnail: post.mediaUrls[0],
    user: {
      id: post.userId,
      username: post.userUsername || '@user',
      displayName: post.userDisplayName || 'User',
      avatar: post.userAvatar || './assets/avatar-ipi.png',
      verified: post.userVerified || false,
      following: false
    },
    description: post.caption || '',
    hashtags: post.hashtags || [],
    music: post.music || '🎵 Original Sound',
    likes: formatNum(post.likes || 0),
    comments: String(post.comments || 0),
    shares: formatNum(post.shares || 0),
    likeCount: post.likes || 0,
    commentCount: post.comments || 0,
    isLiked: false,
    comments_data: []
  };
}

// =============================================
//  FIRESTORE — CREATE POST
// =============================================
async function createPost(mediaFiles, caption, hashtags, music, onProgress) {
  if (DEMO_MODE) { showToast('Demo mode: Firebase belum dikonfigurasi'); return; }
  if (!currentUser) { showToast('Login dulu untuk upload!'); openAuthModal('login'); return; }

  try {
    const mediaUrls = [];
    const postId = Date.now().toString();
    let firstType = 'image';

    // Upload semua file ke Storage
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const ext = file.name.split('.').pop();
      const path = `posts/${currentUser.uid}/${postId}/media-${i}.${ext}`;
      const storageRef = FB.ref(FB.storage, path);

      if (file.type.startsWith('video')) firstType = 'video';

      const url = await uploadWithProgress(storageRef, file, (pct) => {
        const overall = Math.round((i / mediaFiles.length) * 100 + pct / mediaFiles.length);
        if (onProgress) onProgress(overall);
      });
      mediaUrls.push(url);
    }

    // Ambil data user
    const userDoc = await FB.getDoc(FB.doc(FB.db, 'users', currentUser.uid));
    const userData = userDoc.data();

    // Simpan post ke Firestore
    await FB.addDoc(FB.collection(FB.db, 'posts'), {
      userId: currentUser.uid,
      userUsername: userData.username,
      userDisplayName: userData.displayName,
      userAvatar: userData.avatar,
      userVerified: userData.verified || false,
      type: mediaFiles.length > 1 ? 'carousel' : firstType,
      mediaUrls: mediaUrls,
      caption: caption,
      hashtags: hashtags.match(/#\w+/g) || [],
      music: music || '🎵 Original Sound',
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: FB.serverTimestamp()
    });

    if (onProgress) onProgress(100);
    showToast('Konten berhasil diupload! 🎉');
    closeUploadModal();
  } catch (err) {
    console.error('Upload error:', err);
    showToast('Upload gagal: ' + err.message);
  }
}

function uploadWithProgress(storageRef, file, onProgress) {
  return new Promise((resolve, reject) => {
    const task = FB.uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => resolve(await FB.getDownloadURL(task.snapshot.ref))
    );
  });
}

// =============================================
//  FIRESTORE — LIKE POST
// =============================================
async function likePostFirestore(postId, isLiked) {
  if (DEMO_MODE || !currentUser) return;
  const likeRef = FB.doc(FB.db, 'likes', `${postId}_${currentUser.uid}`);
  const postRef = FB.doc(FB.db, 'posts', postId);

  if (isLiked) {
    await FB.setDoc(likeRef, { postId, userId: currentUser.uid, createdAt: FB.serverTimestamp() });
    await FB.updateDoc(postRef, { likes: FB.increment(1) });
  } else {
    await FB.deleteDoc(likeRef);
    await FB.updateDoc(postRef, { likes: FB.increment(-1) });
  }
}

// =============================================
//  FIRESTORE — ADD COMMENT
// =============================================
async function addCommentFirestore(postId, text) {
  if (DEMO_MODE || !currentUser) return;
  const userDoc = await FB.getDoc(FB.doc(FB.db, 'users', currentUser.uid));
  const userData = userDoc.data();

  await FB.addDoc(FB.collection(FB.db, 'comments'), {
    postId,
    userId: currentUser.uid,
    userUsername: userData.username,
    userAvatar: userData.avatar,
    text,
    likes: 0,
    createdAt: FB.serverTimestamp()
  });

  await FB.updateDoc(FB.doc(FB.db, 'posts', postId), {
    comments: FB.increment(1)
  });
}

// =============================================
//  FIRESTORE — FOLLOW
// =============================================
async function followUserFirestore(targetUserId, isFollowing) {
  if (DEMO_MODE || !currentUser) return;
  const followRef = FB.doc(FB.db, 'follows', `${currentUser.uid}_${targetUserId}`);

  if (isFollowing) {
    await FB.setDoc(followRef, {
      followerId: currentUser.uid,
      followedId: targetUserId,
      createdAt: FB.serverTimestamp()
    });
    await FB.updateDoc(FB.doc(FB.db, 'users', targetUserId), { followers: FB.increment(1) });
    await FB.updateDoc(FB.doc(FB.db, 'users', currentUser.uid), { following: FB.increment(1) });
  } else {
    await FB.deleteDoc(followRef);
    await FB.updateDoc(FB.doc(FB.db, 'users', targetUserId), { followers: FB.increment(-1) });
    await FB.updateDoc(FB.doc(FB.db, 'users', currentUser.uid), { following: FB.increment(-1) });
  }
}

// =============================================
//  AUTH ERROR MESSAGES (Indonesian)
// =============================================
function getAuthErrorMsg(code) {
  const msgs = {
    'auth/email-already-in-use':  'Email sudah digunakan akun lain',
    'auth/weak-password':          'Password minimal 6 karakter',
    'auth/invalid-email':          'Format email tidak valid',
    'auth/user-not-found':         'Akun tidak ditemukan',
    'auth/wrong-password':         'Password salah',
    'auth/too-many-requests':      'Terlalu banyak percobaan. Coba lagi nanti',
    'auth/network-request-failed': 'Koneksi gagal. Periksa internet Anda'
  };
  return msgs[code] || 'Terjadi kesalahan. Coba lagi.';
}

// =============================================
//  UI HELPERS
// =============================================
function renderAuthUI(user) {
  const authBtn = document.getElementById('authHeaderBtn');
  if (!authBtn) return;
  if (user) {
    authBtn.innerHTML = `<img src="${user.photoURL || './assets/avatar-ipi.png'}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid #fff">`;
    authBtn.onclick = () => navigateTo('profile');
  } else {
    authBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    authBtn.onclick = () => openAuthModal('login');
  }
}

function showAuthLoading(show) {
  const btn = document.getElementById('authSubmitBtn');
  if (btn) btn.disabled = show;
  const spinner = document.getElementById('authSpinner');
  if (spinner) spinner.style.display = show ? 'block' : 'none';
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function openAuthModal(mode) {
  document.getElementById('authModal').classList.add('open');
  document.getElementById('backdropEl').classList.add('show');
  switchAuthMode(mode || 'login');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.getElementById('backdropEl').classList.remove('show');
  document.getElementById('authError').style.display = 'none';
}

function switchAuthMode(mode) {
  const isLogin = mode === 'login';
  document.getElementById('authTitle').textContent = isLogin ? 'Login' : 'Daftar Akun';
  document.getElementById('authSubmitBtn').textContent = isLogin ? 'Login' : 'Daftar';
  document.getElementById('authToggleText').innerHTML = isLogin
    ? 'Belum punya akun? <button onclick="switchAuthMode(\'register\')" class="auth-link">Daftar</button>'
    : 'Sudah punya akun? <button onclick="switchAuthMode(\'login\')" class="auth-link">Login</button>';

  document.getElementById('authUsernameGroup').style.display  = isLogin ? 'none' : 'flex';
  document.getElementById('authNameGroup').style.display      = isLogin ? 'none' : 'flex';
  document.getElementById('authModal').dataset.mode = mode;
}

function openUploadModal() {
  if (!currentUser && !DEMO_MODE) {
    openAuthModal('login');
    showToast('Login dulu untuk upload konten!');
    return;
  }
  document.getElementById('uploadModal').classList.add('open');
  document.getElementById('backdropEl').classList.add('show');
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.remove('open');
  document.getElementById('backdropEl').classList.remove('show');
  // Reset form
  document.getElementById('uploadForm').reset();
  document.getElementById('mediaPreviewGrid').innerHTML = '';
  document.getElementById('uploadDropzone').style.display = 'flex';
  document.getElementById('uploadProgress').style.display = 'none';
  window._uploadFiles = [];
}

window.switchAuthMode = switchAuthMode;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;
