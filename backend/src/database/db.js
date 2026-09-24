import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + persistent disk synchronization
const memoryStore = {};

const COLLECTIONS = [
  'users',
  'galleries',
  'albums',
  'photos',
  'favorites',
  'selections',
  'selectionItems',
  'downloads',
  'comments',
  'notifications',
  'activities',
  'clients',
  'projects',
  'videos',
  'storageObjects',
  'watermarks'
];

// Initialize collections
COLLECTIONS.forEach(col => {
  const filePath = path.join(DATA_DIR, `${col}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      memoryStore[col] = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error(`Error reading ${col}.json:`, e);
      memoryStore[col] = [];
    }
  } else {
    memoryStore[col] = [];
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
});

function persist(col) {
  try {
    const filePath = path.join(DATA_DIR, `${col}.json`);
    fs.writeFileSync(filePath, JSON.stringify(memoryStore[col] || [], null, 2));
  } catch (err) {
    console.error(`Failed to persist collection ${col}:`, err);
  }
}

export const db = {
  collection(col) {
    if (!memoryStore[col]) {
      memoryStore[col] = [];
    }
    return {
      find(predicate = () => true) {
        if (typeof predicate === 'object') {
          const keys = Object.keys(predicate);
          return memoryStore[col].filter(item => keys.every(k => item[k] === predicate[k]));
        }
        return memoryStore[col].filter(predicate);
      },
      findOne(predicate) {
        if (typeof predicate === 'object') {
          const keys = Object.keys(predicate);
          return memoryStore[col].find(item => keys.every(k => item[k] === predicate[k])) || null;
        }
        return memoryStore[col].find(predicate) || null;
      },
      findById(id) {
        return memoryStore[col].find(item => item.id === id || item._id === id) || null;
      },
      insert(doc) {
        const newDoc = {
          id: doc.id || doc._id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...doc
        };
        memoryStore[col].push(newDoc);
        persist(col);
        return newDoc;
      },
      insertMany(docs) {
        const added = docs.map(doc => ({
          id: doc.id || doc._id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...doc
        }));
        memoryStore[col].push(...added);
        persist(col);
        return added;
      },
      update(id, updateData) {
        const index = memoryStore[col].findIndex(item => item.id === id || item._id === id);
        if (index === -1) return null;
        memoryStore[col][index] = {
          ...memoryStore[col][index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        persist(col);
        return memoryStore[col][index];
      },
      delete(id) {
        const index = memoryStore[col].findIndex(item => item.id === id || item._id === id);
        if (index === -1) return false;
        memoryStore[col].splice(index, 1);
        persist(col);
        return true;
      },
      deleteMany(predicate) {
        const initialLen = memoryStore[col].length;
        if (typeof predicate === 'object') {
          const keys = Object.keys(predicate);
          memoryStore[col] = memoryStore[col].filter(item => !keys.every(k => item[k] === predicate[k]));
        } else {
          memoryStore[col] = memoryStore[col].filter(item => !predicate(item));
        }
        const changed = memoryStore[col].length !== initialLen;
        if (changed) persist(col);
        return changed;
      },
      count(predicate = () => true) {
        return this.find(predicate).length;
      }
    };
  }
};

// Seed initial production-grade data if store is empty
export function seedInitialData() {
  const users = db.collection('users').find();
  if (users.length === 0) {
    console.log('🌱 Seeding Signature by Marvan platform with initial studio data...');

    // Master studio user
    db.collection('users').insert({
      id: 'usr_marvan_01',
      name: 'Marvan K.P.',
      email: 'marvankp847@gmail.com',
      passwordHash: 'signature2026', // Verified via mock/bcrypt comparator
      role: 'OWNER',
      bio: 'Principal Photographer & Visual Artist. Crafting emotional, cinematic wedding stories across Kerala and beyond.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+91 75919 42952'
    });

    db.collection('users').insert({
      id: 'usr_editor_01',
      name: 'Aiswarya Mohan',
      email: 'aiswarya@signaturebymarvan.com',
      passwordHash: 'editor2026',
      role: 'EDITOR',
      bio: 'Senior Colorist & Retoucher.',
      phone: '+91 98765 43211'
    });

    // Sample Clients
    const client1 = db.collection('clients').insert({
      id: 'client_arjun_anjali',
      name: 'Arjun & Anjali',
      brideName: 'Anjali Menon',
      groomName: 'Arjun Nambiar',
      email: 'arjun.anjali@wedding.com',
      phone: '+91 94471 23456',
      weddingDate: '2026-02-12',
      location: 'Kannur, Kerala',
      venue: 'The Grand Heritage Bay, Kannur',
      galleries: ['gal_arjun_anjali'],
      events: ['Haldi', 'Mehendi', 'Traditional Kerala Wedding', 'Reception'],
      notes: 'Loves candid and black & white editorial shots. Prefers gold-embossed heirloom album.',
      deliveryStatus: 'GALLERY_DELIVERED'
    });

    const client2 = db.collection('clients').insert({
      id: 'client_rahul_meera',
      name: 'Rahul & Meera',
      brideName: 'Meera Nair',
      groomName: 'Rahul Varma',
      email: 'rahul.meera@wedding.com',
      phone: '+91 98950 87654',
      weddingDate: '2026-01-20',
      location: 'Kochi, Kerala',
      venue: 'Bolgatty Palace, Kochi',
      galleries: ['gal_rahul_meera'],
      events: ['Sangeet', 'Wedding Ceremony', 'Grand Gala'],
      notes: 'Requested drone video highlights and fast-track album selection.',
      deliveryStatus: 'SELECTION_COMPLETED'
    });

    // Gallery 1: Arjun & Anjali (Kannur, Kerala)
    const gallery1 = db.collection('galleries').insert({
      id: 'gal_arjun_anjali',
      title: 'Arjun & Anjali',
      subtitle: 'A Wedding Story • Kannur, Kerala',
      slug: 'arjun-anjali-x82k',
      galleryCode: 'X82K9P',
      pin: '2026',
      clientId: client1.id,
      eventDate: '2026-02-12',
      location: 'Kannur, Kerala',
      venue: 'The Grand Heritage Bay, Kannur',
      status: 'ACTIVE',
      expiryDate: '2026-12-31',
      totalPhotos: 24,
      photoCountDisplay: 1248, // Platform display count
      favoritesCount: 14,
      downloadCount: 42,
      selectionLimit: 100,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
      heroTagline: 'Two souls, a coastal monsoon breeze, and vows sealed in eternal grace.',
      watermarkSettings: {
        enabled: true,
        type: 'text',
        text: 'SIGNATURE BY MARVAN',
        position: 'bottom-right',
        opacity: 0.22,
        size: 'medium'
      },
      storyChapters: [
        { title: 'THE BEGINNING', description: 'Quiet dawn preparations, soft jasmine garlands, and heirloom silks.' },
        { title: 'THE CEREMONY', description: 'Sacred thali tied amidst Vedic chants and temple bells echoing over the Arabian Sea.' },
        { title: 'THE MOMENTS', description: 'Stolen glances, joyous laughter, and tearful hugs from proud elders.' },
        { title: 'THE DETAILS', description: 'Handcrafted temple jewelry, Kasavu weaves, and crimson lotus blooms.' },
        { title: 'THE CELEBRATION', description: 'Sunset revelry, laughter under glowing bistro lights, and celebratory music.' },
        { title: 'FOREVER', description: 'A quiet embrace by the ocean tide as the first evening stars appear.' }
      ]
    });

    // Albums for Arjun & Anjali
    const albumsData = [
      { id: 'alb_ceremony', title: 'Ceremony', photoCount: 210, coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
      { id: 'alb_bride', title: 'Bride', photoCount: 165, coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80' },
      { id: 'alb_groom', title: 'Groom', photoCount: 130, coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      { id: 'alb_couple', title: 'Couple Portraits', photoCount: 245, coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
      { id: 'alb_reception', title: 'Reception', photoCount: 310, coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
      { id: 'alb_family', title: 'Family & Rituals', photoCount: 188, coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80' }
    ];

    albumsData.forEach(alb => {
      db.collection('albums').insert({
        id: alb.id,
        galleryId: gallery1.id,
        title: alb.title,
        photoCount: alb.photoCount,
        coverImage: alb.coverImage
      });
    });

    // High quality curated wedding photographs
    const samplePhotos = [
      {
        id: 'p_01',
        title: 'Coastal Twilight Portrait',
        aspectRatio: '3:2',
        albumId: 'alb_couple',
        category: 'Couples',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
        tags: ['Couple', 'Sunset', 'Beach', 'Ocean', 'Romantic', 'Cinematic'],
        dimensions: { width: 4000, height: 2667 },
        fileSize: 4892010,
        blurScore: 0.98,
        aiQualityScore: 9.8,
        favorited: true,
        selected: true
      },
      {
        id: 'p_02',
        title: 'Heirloom Gold & Jasmine',
        aspectRatio: '4:5',
        albumId: 'alb_bride',
        category: 'Bridal',
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=2000&q=85',
        tags: ['Bride', 'Jewelry', 'Details', 'Portrait', 'Kerala'],
        dimensions: { width: 3200, height: 4000 },
        fileSize: 5210400,
        blurScore: 0.99,
        aiQualityScore: 9.9,
        favorited: true,
        selected: true
      },
      {
        id: 'p_03',
        title: 'The Sacred Thali Moment',
        aspectRatio: '16:9',
        albumId: 'alb_ceremony',
        category: 'Ceremony',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85',
        tags: ['Ceremony', 'Ritual', 'Emotional', 'Couple', 'Tradition'],
        dimensions: { width: 3840, height: 2160 },
        fileSize: 6120400,
        blurScore: 0.97,
        aiQualityScore: 9.7,
        favorited: true,
        selected: true
      },
      {
        id: 'p_04',
        title: 'Groom Silk Angavastram',
        aspectRatio: '4:5',
        albumId: 'alb_groom',
        category: 'Groom',
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85',
        tags: ['Groom', 'Portrait', 'Luxury', 'Classic'],
        dimensions: { width: 3200, height: 4000 },
        fileSize: 4520300,
        blurScore: 0.95,
        aiQualityScore: 9.4,
        favorited: false,
        selected: true
      },
      {
        id: 'p_05',
        title: 'Midnight Lantern Celebration',
        aspectRatio: '3:2',
        albumId: 'alb_reception',
        category: 'Reception',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=85',
        tags: ['Reception', 'Dance', 'Celebration', 'Lights', 'Joy'],
        dimensions: { width: 4200, height: 2800 },
        fileSize: 5890200,
        blurScore: 0.94,
        aiQualityScore: 9.3,
        favorited: true,
        selected: false
      },
      {
        id: 'p_06',
        title: 'Tearful Blessing from Mother',
        aspectRatio: '3:2',
        albumId: 'alb_family',
        category: 'Candid',
        url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2000&q=85',
        tags: ['Family', 'Candid', 'Emotion', 'Mother', 'Blessing'],
        dimensions: { width: 3900, height: 2600 },
        fileSize: 4900100,
        blurScore: 0.96,
        aiQualityScore: 9.6,
        favorited: true,
        selected: true
      },
      {
        id: 'p_07',
        title: 'Handcrafted Lotus Mandap',
        aspectRatio: '16:9',
        albumId: 'alb_ceremony',
        category: 'Details',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2000&q=85',
        tags: ['Decor', 'Details', 'Flowers', 'Mandap', 'Architecture'],
        dimensions: { width: 3840, height: 2160 },
        fileSize: 5400200,
        blurScore: 0.98,
        aiQualityScore: 9.7,
        favorited: false,
        selected: false
      },
      {
        id: 'p_08',
        title: 'Sunset Whispers by Cliffside',
        aspectRatio: '3:2',
        albumId: 'alb_couple',
        category: 'Couples',
        url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=2000&q=85',
        tags: ['Couple', 'Sunset', 'Silhouette', 'Golden Hour'],
        dimensions: { width: 4000, height: 2667 },
        fileSize: 4720100,
        blurScore: 0.99,
        aiQualityScore: 9.8,
        favorited: true,
        selected: true
      },
      {
        id: 'p_09',
        title: 'Intricate Mehendi Flora',
        aspectRatio: '4:5',
        albumId: 'alb_bride',
        category: 'Details',
        url: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=2000&q=85',
        tags: ['Mehendi', 'Details', 'Bride', 'Hands', 'Art'],
        dimensions: { width: 3200, height: 4000 },
        fileSize: 4950000,
        blurScore: 0.97,
        aiQualityScore: 9.5,
        favorited: false,
        selected: true
      },
      {
        id: 'p_10',
        title: 'Grand Baraat Procession',
        aspectRatio: '16:9',
        albumId: 'alb_groom',
        category: 'Ceremony',
        url: 'https://images.unsplash.com/photo-1519225429402-b0544f801646?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519225429402-b0544f801646?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1519225429402-b0544f801646?auto=format&fit=crop&w=2000&q=85',
        tags: ['Groom', 'Procession', 'Joy', 'Celebration', 'Friends'],
        dimensions: { width: 3840, height: 2160 },
        fileSize: 5600300,
        blurScore: 0.93,
        aiQualityScore: 9.2,
        favorited: false,
        selected: false
      },
      {
        id: 'p_11',
        title: 'First Dance Under Chandeliers',
        aspectRatio: '3:2',
        albumId: 'alb_reception',
        category: 'Reception',
        url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2000&q=85',
        tags: ['First Dance', 'Couple', 'Chandelier', 'Ballroom', 'Reception'],
        dimensions: { width: 4000, height: 2667 },
        fileSize: 5120000,
        blurScore: 0.96,
        aiQualityScore: 9.5,
        favorited: true,
        selected: true
      },
      {
        id: 'p_12',
        title: 'Candid Joyful Laughter',
        aspectRatio: '4:5',
        albumId: 'alb_couple',
        category: 'Candid',
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=2400&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
        webUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=2000&q=85',
        tags: ['Candid', 'Couple', 'Laughter', 'Smile', 'Pure Moment'],
        dimensions: { width: 3200, height: 4000 },
        fileSize: 4780900,
        blurScore: 0.97,
        aiQualityScore: 9.7,
        favorited: true,
        selected: true
      }
    ];

    samplePhotos.forEach(p => {
      db.collection('photos').insert({
        ...p,
        galleryId: gallery1.id,
        isWatermarked: true,
        storageKey: `galleries/${gallery1.id}/${p.id}.webp`
      });

      // Insert into favorites
      if (p.favorited) {
        db.collection('favorites').insert({
          galleryId: gallery1.id,
          photoId: p.id,
          clientId: client1.id,
          clientName: 'Arjun & Anjali'
        });
      }
    });

    // Sample Selection for Arjun & Anjali (86 / 100 submitted)
    db.collection('selections').insert({
      id: 'sel_arjun_anjali',
      galleryId: gallery1.id,
      clientId: client1.id,
      clientName: 'Arjun & Anjali',
      totalCount: 86,
      maxLimit: 100,
      status: 'SUBMITTED',
      submittedAt: '2026-09-23T10:15:00.000Z',
      clientNotes: 'We absolutely adore the sunset coastal portraits! Please consider photo p_01 for the leather heirloom album cover spread.',
      photographerNotes: 'Gorgeous selections. Reviewed lighting and layout. Approved for luxury 12x18 spread.',
      selectedPhotoIds: ['p_01', 'p_02', 'p_03', 'p_04', 'p_06', 'p_08', 'p_09', 'p_11', 'p_12']
    });

    // Sample Comments on photos
    db.collection('comments').insert({
      id: 'cmt_01',
      galleryId: gallery1.id,
      photoId: 'p_01',
      userName: 'Anjali Menon',
      userRole: 'CLIENT',
      content: 'Can we use this photograph for the heirloom album cover?',
      status: 'OPEN',
      replies: [
        {
          id: 'rep_01',
          userName: 'Marvan K.P.',
          userRole: 'PHOTOGRAPHER',
          content: 'Absolutely Anjali! The lighting on the Arabian sea tide will look sublime embossed with gold lettering.',
          createdAt: '2026-09-23T11:30:00.000Z'
        }
      ]
    });

    // Sample Videos
    db.collection('videos').insert({
      id: 'vid_01',
      galleryId: gallery1.id,
      title: 'Arjun & Anjali • The Wedding Film (4K HDR)',
      type: 'WEDDING_FILM',
      duration: '14:28',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // sample streamable video
      resolution: '4K Cinema 24fps',
      aspectRatio: '2.39:1'
    });

    db.collection('videos').insert({
      id: 'vid_02',
      galleryId: gallery1.id,
      title: 'Teaser & Coastal Highlights',
      type: 'HIGHLIGHT',
      duration: '03:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      resolution: '1080p 60fps',
      aspectRatio: '16:9'
    });

    // Sample Wedding Projects Pipeline
    db.collection('projects').insert({
      id: 'proj_01',
      clientName: 'Arjun & Anjali',
      clientId: client1.id,
      eventDate: '2026-02-12',
      venue: 'Kannur, Kerala',
      stage: 'SELECTION', // BOOKED, SHOOT_COMPLETED, EDITING, UPLOAD, GALLERY_DELIVERED, SELECTION, ALBUM, FINAL_DELIVERY
      package: 'Royal Cinematic Heritage',
      assignedPhotographer: 'Marvan K.P.',
      dueDate: '2026-10-15',
      progressPercent: 75
    });

    db.collection('projects').insert({
      id: 'proj_02',
      clientName: 'Rahul & Meera',
      clientId: client2.id,
      eventDate: '2026-01-20',
      venue: 'Bolgatty Palace, Kochi',
      stage: 'ALBUM',
      package: 'Signature Destination Heirloom',
      assignedPhotographer: 'Marvan K.P.',
      dueDate: '2026-09-30',
      progressPercent: 90
    });

    db.collection('projects').insert({
      id: 'proj_03',
      clientName: 'Fahad & Farhana',
      eventDate: '2026-11-05',
      venue: 'Calicut Trade Centre, Kozhikode',
      stage: 'BOOKED',
      package: 'Elegance Full Story',
      assignedPhotographer: 'Marvan K.P.',
      dueDate: '2026-11-20',
      progressPercent: 15
    });

    // Sample Activities
    const initialActivities = [
      { text: 'Client Arjun & Anjali submitted album selection (86 photos)', time: 'Today at 10:15 AM', type: 'SELECTION' },
      { text: '14 photographs marked as favorites in Arjun & Anjali gallery', time: 'Yesterday at 08:30 PM', type: 'FAVORITE' },
      { text: 'Full gallery ZIP prepared and downloaded (Web Quality)', time: 'Yesterday at 04:12 PM', type: 'DOWNLOAD' },
      { text: 'AI quality scan completed: 0 duplicates, 12 high sharpness frames', time: '22 Sep 2026', type: 'AI' }
    ];
    initialActivities.forEach(act => db.collection('activities').insert(act));

    // Sample Storage Usage Stats
    // Free tier: 20 GB (21474836480 bytes)
    // Used: 7.4 GB (7945689497 bytes) -> 37% or 72% for testing
    const sampleStorageBytes = 15461882265; // ~14.4 GB (72% of 20GB)
    db.collection('storageObjects').insert({
      id: 'storage_summary_active',
      usedBytes: sampleStorageBytes,
      limitBytes: 21474836480, // 20 GB
      freeTierProvider: 'Cloudflare R2 / Local Hybrid',
      totalFiles: 18420,
      primaryStorageStatus: 'HEALTHY',
      backupStorageStatus: 'SYNCED (98.7%)',
      lastBackupDate: '2026-09-23T06:00:00.000Z'
    });

    console.log('✅ Signature by Marvan platform seed completed successfully.');
  }
}

export function clearSampleData() {
  console.log('🧹 Purging sample demo wedding collections for 100% real client data...');
  // Clear galleries, albums, photos, favorites, selections, comments, projects, activities
  const clearCols = ['galleries', 'albums', 'photos', 'favorites', 'selections', 'selectionItems', 'comments', 'projects', 'videos'];
  clearCols.forEach(col => {
    memoryStore[col] = [];
    persist(col);
  });

  // Keep admin user, reset clients to empty or clean
  memoryStore['clients'] = [];
  persist('clients');

  memoryStore['activities'] = [
    { text: 'Studio reset to Clean Live Production mode. Ready for real weddings and uploads.', time: 'Just now', type: 'SYSTEM' }
  ];
  persist('activities');

  // Reset storage stats to reflect actual zero / clean disk
  db.collection('storageObjects').update('storage_summary_active', {
    usedBytes: 0,
    totalFiles: 0
  });

  return { success: true, message: 'All demo sample data cleared. Ready for your real original wedding photos!' };
}

