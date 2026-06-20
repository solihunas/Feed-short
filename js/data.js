// =============================================
//  FEED DATA — IPI Digital Trading Feed
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

const FEED_DATA = [
  {
    id: 1,
    type: 'image',                         // image | video
    imageUrl: './assets/thumb-01.png',
    thumbnail: './assets/thumb-01.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Konfirmasi SELL di area resistance 62,255 📉 Price menunjukkan penolakan kuat, waspada penurunan lanjutan!',
    hashtags: ['#btcusd', '#trading', '#analisa', '#crypto'],
    music: '🎵 IPI Digital — Market Update',
    likes: '12.4K',
    comments: '284',
    shares: '1.2K',
    likeCount: 12400,
    commentCount: 284,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@trader_andi', avatar: IPI_AVATAR, text: 'Akurasi sinyalnya mantap banget! Sudah profit 💰', time: '1j', likes: 87 },
      { id: 'c2', user: '@crypto_budi', avatar: IPI_AVATAR, text: 'Entry di mana min untuk SELL ini?', time: '2j', likes: 43 },
      { id: 'c3', user: '@fx_rina', avatar: IPI_AVATAR, text: 'Analisa selalu tepat, makasih IPI! 🙏', time: '3j', likes: 31 }
    ]
  },
  {
    id: 2,
    type: 'image',
    imageUrl: './assets/thumb-02.png',
    thumbnail: './assets/thumb-02.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — SELL signal terkonfirmasi! 🔴 Target area 61,912 — 61,826. Risk management tetap diperhatikan ya traders!',
    hashtags: ['#sell', '#btc', '#sinyal', '#profit'],
    music: '🎵 IPI Digital — Market Update',
    likes: '18.7K',
    comments: '412',
    shares: '2.1K',
    likeCount: 18700,
    commentCount: 412,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@signal_haris', avatar: IPI_AVATAR, text: 'Udah SELL dari tadi, floating profit nih 🔥', time: '45m', likes: 124 },
      { id: 'c2', user: '@newbie_trade', avatar: IPI_AVATAR, text: 'Cara baca chartnya gimana min?', time: '1j', likes: 56 },
      { id: 'c3', user: '@pro_trader_id', avatar: IPI_AVATAR, text: 'Zona supply-nya valid banget! Clean setup 👍', time: '2j', likes: 89 }
    ]
  },
  {
    id: 3,
    type: 'image',
    imageUrl: './assets/thumb-03.png',
    thumbnail: './assets/thumb-03.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Sinyal BUY masuk! 🟢 Area demand kuat di 61,285. Target take profit bertahap. TP1: 62,255 | TP2: 62,898',
    hashtags: ['#buy', '#btc', '#demand', '#ipidigital'],
    music: '🎵 IPI Digital — Market Update',
    likes: '24.1K',
    comments: '567',
    shares: '3.4K',
    likeCount: 24100,
    commentCount: 567,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@winner_trade', avatar: IPI_AVATAR, text: 'BUY dari 61,285 udah kena TP1! Alhamdulillah 🙌', time: '30m', likes: 213 },
      { id: 'c2', user: '@siska_fx', avatar: IPI_AVATAR, text: 'SL-nya di mana min?', time: '1j', likes: 78 },
      { id: 'c3', user: '@btc_lover', avatar: IPI_AVATAR, text: 'Demand zone-nya jelas banget, nice!', time: '2j', likes: 95 }
    ]
  },
  {
    id: 4,
    type: 'image',
    imageUrl: './assets/thumb-04.png',
    thumbnail: './assets/thumb-04.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Update chart! 📊 Price kembali ke area 63,074 setelah bounce dari demand. Momentum bullish masih terjaga!',
    hashtags: ['#btcanalysis', '#bullish', '#crypto', '#update'],
    music: '🎵 IPI Digital — Market Update',
    likes: '9.8K',
    comments: '198',
    shares: '876',
    likeCount: 9800,
    commentCount: 198,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@hold_team', avatar: IPI_AVATAR, text: 'Masih hold dari bawah, gas terus BTC! 🚀', time: '2j', likes: 67 },
      { id: 'c2', user: '@dika_chart', avatar: IPI_AVATAR, text: 'Resistance berikutnya di mana min?', time: '3j', likes: 45 }
    ]
  },
  {
    id: 5,
    type: 'image',
    imageUrl: './assets/thumb-05.png',
    thumbnail: './assets/thumb-05.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Price di 62,652 menguji level kritis! ⚡ Kalau gagal break, potensi reversal ke bawah. Stay focused traders!',
    hashtags: ['#breakout', '#btcusd', '#levelkritis', '#alert'],
    music: '🎵 IPI Digital — Market Update',
    likes: '15.3K',
    comments: '334',
    shares: '1.7K',
    likeCount: 15300,
    commentCount: 334,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@alert_trader', avatar: IPI_AVATAR, text: 'Mantau terus dari tadi nih, tegang 😅', time: '1j', likes: 112 },
      { id: 'c2', user: '@risk_manager', avatar: IPI_AVATAR, text: 'Good reminder soal risk management!', time: '2j', likes: 89 }
    ]
  },
  {
    id: 6,
    type: 'image',
    imageUrl: './assets/thumb-06.png',
    thumbnail: './assets/thumb-06.png',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — BUY setup di 63,568! 🟢 Area demand terkonfirmasi dengan volume. Entry, SL, TP sudah tersedia untuk member IPI!',
    hashtags: ['#buysetup', '#ipidigital', '#member', '#signalbuy'],
    music: '🎵 IPI Digital — Market Update',
    likes: '31.2K',
    comments: '891',
    shares: '4.5K',
    likeCount: 31200,
    commentCount: 891,
    isLiked: true,
    comments_data: [
      { id: 'c1', user: '@member_ipi', avatar: IPI_AVATAR, text: 'Sudah dapat full setup di grup member! Mantap 💎', time: '20m', likes: 345 },
      { id: 'c2', user: '@join_dong', avatar: IPI_AVATAR, text: 'Cara gabung member IPI gimana min?', time: '45m', likes: 156 },
      { id: 'c3', user: '@profit_hunter', avatar: IPI_AVATAR, text: 'Setup ini clean banget! 10/10 🔥', time: '1j', likes: 234 }
    ]
  },
  {
    id: 7,
    type: 'image',
    imageUrl: './assets/thumb-07.jpg',
    thumbnail: './assets/thumb-07.jpg',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Struktur market lengkap! 📈 BUY 10 lot di 61,345 masih aktif. Price sedang recovery, sabar tunggu TP! 💪',
    hashtags: ['#btcusd', '#patience', '#holdstrong', '#ipi'],
    music: '🎵 IPI Digital — Market Update',
    likes: '22.6K',
    comments: '445',
    shares: '2.8K',
    likeCount: 22600,
    commentCount: 445,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@sabar_profit', avatar: IPI_AVATAR, text: 'Sabar adalah kunci! Masih hold nih 💪', time: '1j', likes: 167 },
      { id: 'c2', user: '@newtrader22', avatar: IPI_AVATAR, text: 'Berapa lama biasanya nunggu TP min?', time: '2j', likes: 89 }
    ]
  },
  {
    id: 8,
    type: 'image',
    imageUrl: './assets/thumb-08.jpg',
    thumbnail: './assets/thumb-08.jpg',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — Multi-entry BUY! 🎯 Dua posisi aktif di 0000 & 61,345. Strategi averaging untuk maksimalkan profit saat BTC naik!',
    hashtags: ['#averaging', '#multientry', '#strategi', '#btc'],
    music: '🎵 IPI Digital — Market Update',
    likes: '19.4K',
    comments: '523',
    shares: '2.1K',
    likeCount: 19400,
    commentCount: 523,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@averaging_pro', avatar: IPI_AVATAR, text: 'Strategi averaging emang paling ampuh! 📈', time: '1j', likes: 198 },
      { id: 'c2', user: '@risk_off', avatar: IPI_AVATAR, text: 'Hati-hati juga dengan margin ya guys', time: '2j', likes: 134 }
    ]
  },
  {
    id: 9,
    type: 'image',
    imageUrl: './assets/thumb-09.jpg',
    thumbnail: './assets/thumb-09.jpg',
    user: { ...IPI_USER },
    description: 'BTC/USD H1 — UPDATE POSISI! 🔄 3 posisi BUY aktif sekarang. Price mulai bergerak naik. Target 63,686 dalam jangkauan! 🎯',
    hashtags: ['#update', '#3posisi', '#btcbull', '#ipidigital'],
    music: '🎵 IPI Digital — Market Update',
    likes: '28.9K',
    comments: '712',
    shares: '3.8K',
    likeCount: 28900,
    commentCount: 712,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@gas_terus', avatar: IPI_AVATAR, text: 'Price udah mulai naik! YESS 🚀🚀🚀', time: '30m', likes: 312 },
      { id: 'c2', user: '@pantau_24', avatar: IPI_AVATAR, text: 'Mantap IPI, analisa selalu on point!', time: '45m', likes: 234 },
      { id: 'c3', user: '@target_tp', avatar: IPI_AVATAR, text: 'Kapan kira-kira kena TP min? 😍', time: '1j', likes: 156 }
    ]
  },
  {
    id: 10,
    type: 'image',
    imageUrl: './assets/thumb-10.jpg',
    thumbnail: './assets/thumb-10.jpg',
    user: { ...IPI_USER },
    description: '🎉 PROFIT TERKONFIRMASI! BTC/USD sudah menyentuh 64,528! Semua posisi BUY sudah TP! Total floating profit member mencapai ratusan dollar! 💰🚀',
    hashtags: ['#profit', '#alhamdulillah', '#buktiprofit', '#ipidigital'],
    music: '🎵 IPI Digital — Profit Alert!',
    likes: '87.3K',
    comments: '2.4K',
    shares: '12.6K',
    likeCount: 87300,
    commentCount: 2400,
    isLiked: true,
    comments_data: [
      { id: 'c1', user: '@profit_member', avatar: IPI_AVATAR, text: 'ALHAMDULILLAH! +$347 dari 3 posisi! MAKASIH IPI! 🙌🙌', time: '15m', likes: 892 },
      { id: 'c2', user: '@baru_join', avatar: IPI_AVATAR, text: 'Wah gila! Gimana cara join member IPI?? 😱', time: '25m', likes: 567 },
      { id: 'c3', user: '@veteran_trade', avatar: IPI_AVATAR, text: 'Konsisten banget analisanya, respect! 👏', time: '40m', likes: 423 },
      { id: 'c4', user: '@gas_lagi', avatar: IPI_AVATAR, text: 'Next signal kapan min? Siap masuk lagi! 🔥', time: '1j', likes: 312 }
    ]
  }
];

// Trending creators
const TRENDING_CREATORS = [
  { username: '@ipi_digital', displayName: 'IPI Digital', avatar: IPI_AVATAR, followers: '128K', following: false },
  { username: '@crypto_indo', displayName: 'Crypto Indonesia', avatar: IPI_AVATAR, followers: '89K', following: false },
  { username: '@signal_pro', displayName: 'Signal Pro ID', avatar: IPI_AVATAR, followers: '67K', following: true },
  { username: '@btc_analysis', displayName: 'BTC Analysis', avatar: IPI_AVATAR, followers: '45K', following: false },
  { username: '@forex_master', displayName: 'Forex Master ID', avatar: IPI_AVATAR, followers: '34K', following: false }
];
