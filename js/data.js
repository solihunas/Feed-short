// =============================================
//  FEED DATA — Video feed items & comments
// =============================================

const FEED_DATA = [
  {
    id: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/v1/400/711',
    user: {
      id: 'u1',
      username: '@andika_explorer',
      displayName: 'Andika Explorer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
      following: false
    },
    description: 'Pemandangan alam yang luar biasa indah! Ini tempat favorit saya setiap weekend 🌅✨',
    hashtags: ['#fyp', '#nature', '#viral', '#indonesia'],
    music: 'Acoustic Chill — Lo-fi Beats',
    likes: '234.5K',
    comments: '1.2K',
    shares: '8.9K',
    likeCount: 234500,
    commentCount: 1200,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@rina_santoso', avatar: 'https://i.pravatar.cc/150?img=5', text: 'Wah indah banget! Dimana nih lokasinya?', time: '2j', likes: 342 },
      { id: 'c2', user: '@budi_creator', avatar: 'https://i.pravatar.cc/150?img=7', text: 'Vibes-nya chill banget, auto healing 🙏', time: '3j', likes: 128 },
      { id: 'c3', user: '@sari_wanderer', avatar: 'https://i.pravatar.cc/150?img=9', text: 'Kontennya selalu aesthetic, love it! 😍', time: '5j', likes: 87 },
      { id: 'c4', user: '@dimas_foto', avatar: 'https://i.pravatar.cc/150?img=11', text: 'Kamera apa yang dipake bang?', time: '6j', likes: 65 },
      { id: 'c5', user: '@putri_travel', avatar: 'https://i.pravatar.cc/150?img=13', text: 'Masuk bucket list deh tempat ini! 🗺️', time: '8j', likes: 43 }
    ]
  },
  {
    id: 2,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://picsum.photos/seed/v2/400/711',
    user: {
      id: 'u2',
      username: '@sari_chef',
      displayName: 'Sari Kitchen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: false,
      following: true
    },
    description: 'Resep rahasia ayam geprek level dewa 🍗🔥 Coba deh, dijamin nagih!',
    hashtags: ['#kuliner', '#masakanrumah', '#foodtok', '#resep'],
    music: 'Cooking Vibes — Chill Kitchen',
    likes: '89.2K',
    comments: '3.4K',
    shares: '12.1K',
    likeCount: 89200,
    commentCount: 3400,
    isLiked: true,
    comments_data: [
      { id: 'c1', user: '@mama_masak', avatar: 'https://i.pravatar.cc/150?img=15', text: 'Udah dicoba tadi, enak banget! Thanks resepnya sis 🙏', time: '1j', likes: 521 },
      { id: 'c2', user: '@foody_jakarta', avatar: 'https://i.pravatar.cc/150?img=17', text: 'Sambelnya pake apa aja?', time: '2j', likes: 234 },
      { id: 'c3', user: '@chef_dadang', avatar: 'https://i.pravatar.cc/150?img=19', text: 'Teknik memasaknya bener banget! Pro banget ini 👨‍🍳', time: '4j', likes: 156 }
    ]
  },
  {
    id: 3,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://picsum.photos/seed/v3/400/711',
    user: {
      id: 'u3',
      username: '@rizky_otomotif',
      displayName: 'Rizky Otomotif',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: true,
      following: false
    },
    description: 'Road trip Jawa–Bali solo? Ini pengalaman lengkapnya guys! Episode 1 🚗💨',
    hashtags: ['#roadtrip', '#otomotif', '#traveling', '#viral'],
    music: 'Road Trip Anthem — Indie Rock',
    likes: '445.8K',
    comments: '6.7K',
    shares: '31.2K',
    likeCount: 445800,
    commentCount: 6700,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@traveler_indo', avatar: 'https://i.pravatar.cc/150?img=21', text: 'Solo trip kaya gini emang beda feelnya! 🔥', time: '30m', likes: 892 },
      { id: 'c2', user: '@mobil_tips', avatar: 'https://i.pravatar.cc/150?img=23', text: 'Budget totalnya berapa bang?', time: '1j', likes: 445 },
      { id: 'c3', user: '@biker_nusa', avatar: 'https://i.pravatar.cc/150?img=25', text: 'Nunggu episode 2 nih!!', time: '2j', likes: 267 },
      { id: 'c4', user: '@eko_jalan', avatar: 'https://i.pravatar.cc/150?img=27', text: 'Recommend banget buat yang mau solo trip perdana', time: '3j', likes: 189 }
    ]
  },
  {
    id: 4,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/v4/400/711',
    user: {
      id: 'u4',
      username: '@luna_dance',
      displayName: 'Luna Dance Studio',
      avatar: 'https://i.pravatar.cc/150?img=4',
      verified: true,
      following: false
    },
    description: 'Choreografi terbaru! Part ke-3 dari Dance Challenge bulan ini 💃🕺 Duet sama siapa?',
    hashtags: ['#dance', '#challenge', '#trending', '#fyp'],
    music: 'Blinding Lights — The Weeknd (Slowed)',
    likes: '1.2M',
    comments: '18.4K',
    shares: '89.3K',
    likeCount: 1200000,
    commentCount: 18400,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@dance_lover99', avatar: 'https://i.pravatar.cc/150?img=29', text: 'Gerakannya smooth banget, belajar dimana kak?? 😭', time: '15m', likes: 2341 },
      { id: 'c2', user: '@bella_moves', avatar: 'https://i.pravatar.cc/150?img=31', text: 'Udah duet sama aku! Cek di profile aku 💕', time: '45m', likes: 1203 },
      { id: 'c3', user: '@hiphop_id', avatar: 'https://i.pravatar.cc/150?img=33', text: 'Koreografinya 10/10 🔥🔥🔥', time: '1j', likes: 876 }
    ]
  },
  {
    id: 5,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://picsum.photos/seed/v5/400/711',
    user: {
      id: 'u5',
      username: '@tech_review_id',
      displayName: 'TechReview Indonesia',
      avatar: 'https://i.pravatar.cc/150?img=6',
      verified: true,
      following: false
    },
    description: 'Review iPhone 16 Pro setelah 30 hari pemakaian. Jujur banget review-nya! 📱',
    hashtags: ['#techreview', '#iphone', '#gadget', '#fyp'],
    music: 'Tech Beats — Electronic Future',
    likes: '567.3K',
    comments: '9.8K',
    shares: '42.1K',
    likeCount: 567300,
    commentCount: 9800,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@apple_fans_id', avatar: 'https://i.pravatar.cc/150?img=35', text: 'Udah punya dari day 1, setuju banget reviewnya!', time: '2j', likes: 1234 },
      { id: 'c2', user: '@android_camp', avatar: 'https://i.pravatar.cc/150?img=37', text: 'Harganya masih kemahalan sih 😅', time: '3j', likes: 567 },
      { id: 'c3', user: '@geek_nusantara', avatar: 'https://i.pravatar.cc/150?img=39', text: 'Baterainya gimana bang? Awet ga?', time: '4j', likes: 345 }
    ]
  },
  {
    id: 6,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://picsum.photos/seed/v6/400/711',
    user: {
      id: 'u6',
      username: '@yoga_lifestyle',
      displayName: 'Yoga with Dewi',
      avatar: 'https://i.pravatar.cc/150?img=8',
      verified: false,
      following: false
    },
    description: 'Morning yoga 10 menit untuk pemula! Mulai hari dengan energi positif ☀️🧘‍♀️',
    hashtags: ['#yoga', '#wellness', '#morningroutine', '#sehat'],
    music: 'Morning Zen — Meditation Sounds',
    likes: '312.6K',
    comments: '4.2K',
    shares: '25.8K',
    likeCount: 312600,
    commentCount: 4200,
    isLiked: true,
    comments_data: [
      { id: 'c1', user: '@health_hunter', avatar: 'https://i.pravatar.cc/150?img=41', text: 'Udah 2 minggu konsisten yoga pagi gara2 video ini, thanks kak! 🙏', time: '1j', likes: 789 },
      { id: 'c2', user: '@mom_of_three', avatar: 'https://i.pravatar.cc/150?img=43', text: 'Cocok banget buat ibu-ibu sibuk seperti aku', time: '2j', likes: 432 },
      { id: 'c3', user: '@fitnessbro_id', avatar: 'https://i.pravatar.cc/150?img=45', text: 'Combine sama cardio lebih efektif sis', time: '3j', likes: 298 }
    ]
  },
  {
    id: 7,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://picsum.photos/seed/v7/400/711',
    user: {
      id: 'u7',
      username: '@comedy_indo',
      displayName: 'Comedy Central ID',
      avatar: 'https://i.pravatar.cc/150?img=10',
      verified: true,
      following: true
    },
    description: 'Ketika bos minta lembur tapi udah ada rencana 😂💀 Relate banget ga? Tag teman kantor kamu!',
    hashtags: ['#comedy', '#lucu', '#relatable', '#kantoran'],
    music: 'Funny Background — Circus Beat',
    likes: '2.1M',
    comments: '34.2K',
    shares: '156.7K',
    likeCount: 2100000,
    commentCount: 34200,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@office_worker_id', avatar: 'https://i.pravatar.cc/150?img=47', text: 'RELATE BANGET ASTAGA 😭😭😭', time: '20m', likes: 5678 },
      { id: 'c2', user: '@hr_nusantara', avatar: 'https://i.pravatar.cc/150?img=49', text: 'Hahahaha ini real talk banget', time: '45m', likes: 3421 },
      { id: 'c3', user: '@startup_life', avatar: 'https://i.pravatar.cc/150?img=51', text: 'Tag si bos langsung ahh 😂', time: '1j', likes: 2109 }
    ]
  },
  {
    id: 8,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://picsum.photos/seed/v8/400/711',
    user: {
      id: 'u8',
      username: '@finance_tips_id',
      displayName: 'Finance Tips ID',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      following: false
    },
    description: 'Tips investasi untuk Gen Z mulai dari Rp 10.000! Yuk melek finansial dari sekarang 💰📈',
    hashtags: ['#investasi', '#finansial', '#genZ', '#tips'],
    music: 'Success Mindset — Motivational Beats',
    likes: '891.4K',
    comments: '15.6K',
    shares: '67.8K',
    likeCount: 891400,
    commentCount: 15600,
    isLiked: false,
    comments_data: [
      { id: 'c1', user: '@investor_muda', avatar: 'https://i.pravatar.cc/150?img=53', text: 'Udah mulai dari bulan kemarin, lumayan hasilnya! 📈', time: '1j', likes: 2345 },
      { id: 'c2', user: '@broke_student', avatar: 'https://i.pravatar.cc/150?img=55', text: 'Rp 10rb pun bisa invest? Serius?? 😱', time: '2j', likes: 1876 },
      { id: 'c3', user: '@finance_guru', avatar: 'https://i.pravatar.cc/150?img=57', text: 'Konten edukasinya bagus banget, keep it up! 👏', time: '3j', likes: 987 }
    ]
  }
];

// Trending creators data
const TRENDING_CREATORS = [
  { username: '@andika_explorer', displayName: 'Andika Explorer', avatar: 'https://i.pravatar.cc/150?img=1', followers: '2.4M', following: false },
  { username: '@luna_dance', displayName: 'Luna Dance Studio', avatar: 'https://i.pravatar.cc/150?img=4', followers: '8.1M', following: false },
  { username: '@comedy_indo', displayName: 'Comedy Central ID', avatar: 'https://i.pravatar.cc/150?img=10', followers: '12.3M', following: true },
  { username: '@sari_chef', displayName: 'Sari Kitchen', avatar: 'https://i.pravatar.cc/150?img=2', followers: '1.8M', following: true },
  { username: '@tech_review_id', displayName: 'TechReview Indonesia', avatar: 'https://i.pravatar.cc/150?img=6', followers: '5.6M', following: false }
];
