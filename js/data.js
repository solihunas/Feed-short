// =============================================
//  FEED DATA — IPI Digital + Video Samples
//  Tahap 1: 5 video items (gtv CDN) + 10 IPI image items
// =============================================

const IPI_AVATAR = './assets/avatar-ipi.png';

const IPI_USER = {
  id: 'ipi_digital',
  username: '@ipi_digital',
  displayName: 'IPI Digital',
  avatar: IPI_AVATAR,
  verified: true,
  following: false
};

// Free sample videos from Google's public CDN
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

const FEED_DATA = [
  // ---- VIDEO ITEMS (1–5) ----
  {
    id: 1, type: 'video',
    videoUrl: SAMPLE_VIDEOS[0],
    thumbnail: './assets/thumb-01.png',
    user: { ...IPI_USER },
    description: '📊 BTC/USD H1 — Area resistance kuat! SELL dari 62,255. Target TP: 61,826 📉',
    hashtags: ['#btcusd', '#trading', '#sell', '#ipidigital'],
    music: '🎵 IPI Digital — Market Alert',
    likeCount: 12400, commentCount: 284, shareCount: 1200,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@trader_andi', avatar: IPI_AVATAR, text:'Akurasi sinyalnya mantap! Sudah profit 💰', time:'1j', likes:87 },
      { id:'c2', user:'@crypto_budi', avatar: IPI_AVATAR, text:'Entry di mana min untuk SELL ini?', time:'2j', likes:43 },
      { id:'c3', user:'@fx_rina',    avatar: IPI_AVATAR, text:'Analisa selalu tepat, makasih IPI! 🙏', time:'3j', likes:31 }
    ]
  },
  {
    id: 2, type: 'video',
    videoUrl: SAMPLE_VIDEOS[1],
    thumbnail: './assets/thumb-02.png',
    user: { ...IPI_USER },
    description: '🔴 SELL signal terkonfirmasi! Target 61,912–61,826. Risk management tetap diperhatikan traders!',
    hashtags: ['#sell', '#btc', '#sinyal', '#profit'],
    music: '🎵 IPI Digital — Market Update',
    likeCount: 18700, commentCount: 412, shareCount: 2100,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@signal_haris', avatar: IPI_AVATAR, text:'Udah SELL dari tadi, floating profit nih 🔥', time:'45m', likes:124 },
      { id:'c2', user:'@pro_trader_id', avatar: IPI_AVATAR, text:'Zona supply-nya valid banget! Clean setup 👍', time:'2j', likes:89 }
    ]
  },
  {
    id: 3, type: 'video',
    videoUrl: SAMPLE_VIDEOS[2],
    thumbnail: './assets/thumb-03.png',
    user: { ...IPI_USER },
    description: '🟢 BUY masuk! Area demand kuat di 61,285. TP1: 62,255 | TP2: 62,898. SL: 60,900 🎯',
    hashtags: ['#buy', '#btc', '#demand', '#ipidigital'],
    music: '🎵 IPI Digital — Signal Alert',
    likeCount: 24100, commentCount: 567, shareCount: 3400,
    isLiked: true, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@winner_trade', avatar: IPI_AVATAR, text:'BUY dari 61,285 udah kena TP1! Alhamdulillah 🙌', time:'30m', likes:213 },
      { id:'c2', user:'@btc_lover',   avatar: IPI_AVATAR, text:'Demand zone-nya jelas banget, nice!', time:'2j', likes:95 }
    ]
  },
  {
    id: 4, type: 'video',
    videoUrl: SAMPLE_VIDEOS[3],
    thumbnail: './assets/thumb-04.png',
    user: { ...IPI_USER },
    description: '📈 Update! Price kembali ke 63,074 setelah bounce dari demand. Momentum bullish masih terjaga!',
    hashtags: ['#btcanalysis', '#bullish', '#crypto', '#update'],
    music: '🎵 IPI Digital — Live Update',
    likeCount: 9800, commentCount: 198, shareCount: 876,
    isLiked: false, isBookmarked: true,
    comments_data: [
      { id:'c1', user:'@hold_team', avatar: IPI_AVATAR, text:'Masih hold dari bawah, gas terus BTC! 🚀', time:'2j', likes:67 }
    ]
  },
  {
    id: 5, type: 'video',
    videoUrl: SAMPLE_VIDEOS[4],
    thumbnail: './assets/thumb-05.png',
    user: { ...IPI_USER },
    description: '⚡ Price di 62,652 menguji level kritis! Kalau gagal break, potensi reversal ke bawah. Stay focused!',
    hashtags: ['#breakout', '#btcusd', '#levelkritis', '#alert'],
    music: '🎵 IPI Digital — Market Alert',
    likeCount: 15300, commentCount: 334, shareCount: 1700,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@alert_trader', avatar: IPI_AVATAR, text:'Mantau terus dari tadi nih, tegang 😅', time:'1j', likes:112 }
    ]
  },

  // ---- IMAGE ITEMS (6–15) — IPI Chart Screenshots ----
  {
    id: 6, type: 'image',
    imageUrl: './assets/thumb-06.png', thumbnail: './assets/thumb-06.png',
    user: { ...IPI_USER },
    description: '🟢 BUY setup di 63,568! Area demand terkonfirmasi dengan volume. Entry, SL, TP untuk member IPI!',
    hashtags: ['#buysetup', '#ipidigital', '#member', '#signalbuy'],
    music: '🎵 IPI Digital — Market Update',
    likeCount: 31200, commentCount: 891, shareCount: 4500,
    isLiked: true, isBookmarked: true,
    comments_data: [
      { id:'c1', user:'@member_ipi',   avatar: IPI_AVATAR, text:'Sudah dapat full setup di grup member! Mantap 💎', time:'20m', likes:345 },
      { id:'c2', user:'@profit_hunter', avatar: IPI_AVATAR, text:'Setup ini clean banget! 10/10 🔥', time:'1j', likes:234 }
    ]
  },
  {
    id: 7, type: 'image',
    imageUrl: './assets/thumb-07.jpg', thumbnail: './assets/thumb-07.jpg',
    user: { ...IPI_USER },
    description: '📊 Struktur market lengkap! BUY 10 lot di 61,345 masih aktif. Price sedang recovery, sabar tunggu TP! 💪',
    hashtags: ['#btcusd', '#patience', '#holdstrong', '#ipi'],
    music: '🎵 IPI Digital — Market Update',
    likeCount: 22600, commentCount: 445, shareCount: 2800,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@sabar_profit', avatar: IPI_AVATAR, text:'Sabar adalah kunci! Masih hold nih 💪', time:'1j', likes:167 }
    ]
  },
  {
    id: 8, type: 'image',
    imageUrl: './assets/thumb-08.jpg', thumbnail: './assets/thumb-08.jpg',
    user: { ...IPI_USER },
    description: '🎯 Multi-entry BUY! Dua posisi aktif di dua level. Strategi averaging untuk maksimalkan profit saat BTC naik!',
    hashtags: ['#averaging', '#multientry', '#strategi', '#btc'],
    music: '🎵 IPI Digital — Market Update',
    likeCount: 19400, commentCount: 523, shareCount: 2100,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@averaging_pro', avatar: IPI_AVATAR, text:'Strategi averaging emang paling ampuh! 📈', time:'1j', likes:198 }
    ]
  },
  {
    id: 9, type: 'image',
    imageUrl: './assets/thumb-09.jpg', thumbnail: './assets/thumb-09.jpg',
    user: { ...IPI_USER },
    description: '🔄 UPDATE POSISI! 3 posisi BUY aktif sekarang. Price mulai bergerak naik. Target 63,686 dalam jangkauan! 🎯',
    hashtags: ['#update', '#3posisi', '#btcbull', '#ipidigital'],
    music: '🎵 IPI Digital — Market Update',
    likeCount: 28900, commentCount: 712, shareCount: 3800,
    isLiked: false, isBookmarked: false,
    comments_data: [
      { id:'c1', user:'@gas_terus', avatar: IPI_AVATAR, text:'Price udah mulai naik! YESS 🚀🚀🚀', time:'30m', likes:312 },
      { id:'c2', user:'@target_tp', avatar: IPI_AVATAR, text:'Kapan kira-kira kena TP min? 😍', time:'1j', likes:156 }
    ]
  },
  {
    id: 10, type: 'image',
    imageUrl: './assets/thumb-10.jpg', thumbnail: './assets/thumb-10.jpg',
    user: { ...IPI_USER },
    description: '🎉 PROFIT TERKONFIRMASI! BTC menyentuh 64,528! Semua posisi BUY TP! Total profit member ratusan dollar! 💰🚀',
    hashtags: ['#profit', '#alhamdulillah', '#buktiprofit', '#ipidigital'],
    music: '🎵 IPI Digital — Profit Alert!',
    likeCount: 87300, commentCount: 2400, shareCount: 12600,
    isLiked: true, isBookmarked: true,
    comments_data: [
      { id:'c1', user:'@profit_member', avatar: IPI_AVATAR, text:'ALHAMDULILLAH! +$347 dari 3 posisi! MAKASIH IPI! 🙌🙌', time:'15m', likes:892 },
      { id:'c2', user:'@baru_join',     avatar: IPI_AVATAR, text:'Wah gila! Gimana cara join member IPI?? 😱', time:'25m', likes:567 },
      { id:'c3', user:'@gas_lagi',      avatar: IPI_AVATAR, text:'Next signal kapan min? Siap masuk lagi! 🔥', time:'1j', likes:312 }
    ]
  }
];

// Trending creators
const TRENDING_CREATORS = [
  { username: '@ipi_digital',  displayName: 'IPI Digital',        avatar: IPI_AVATAR, followers: '128K', following: false },
  { username: '@crypto_indo',  displayName: 'Crypto Indonesia',   avatar: IPI_AVATAR, followers: '89K',  following: false },
  { username: '@signal_pro',   displayName: 'Signal Pro ID',      avatar: IPI_AVATAR, followers: '67K',  following: true  },
  { username: '@btc_analysis', displayName: 'BTC Analysis Daily', avatar: IPI_AVATAR, followers: '45K',  following: false },
  { username: '@forex_master', displayName: 'Forex Master ID',    avatar: IPI_AVATAR, followers: '34K',  following: false }
];

// Batch size for infinite scroll
const BATCH_SIZE = 5;
