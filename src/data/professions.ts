export interface ProfessionItem {
  id: 'builder' | 'waiter' | 'vet' | 'pupil' | 'teacher';
  word: string;
  phonetic: string;
  vietnamese: string;
  image: string;
  imageAlt: string;
}

export const KUROMI_COVER_IMAGE =
  '/src/assets/images/kuromi_cover_mascot_1795444405324.jpg';

export const PROFESSIONS: ProfessionItem[] = [
  {
    id: 'builder',
    word: 'Builder',
    phonetic: '/ˈbɪldər/',
    vietnamese: 'Thợ xây',
    image: '/assets/aistudio/image_d330fdcd.png',
    imageAlt: 'Hình minh họa thợ xây đang xây tường gạch với bay và xô vữa',
  },
  {
    id: 'waiter',
    word: 'Waiter',
    phonetic: '/ˈweɪtər/',
    vietnamese: 'Nhân viên phục vụ',
    image: '/assets/aistudio/image_9245284b.png',
    imageAlt: 'Hình minh họa nhân viên phục vụ bưng khay thức ăn',
  },
  {
    id: 'vet',
    word: 'Vet',
    phonetic: '/vet/',
    vietnamese: 'Bác sĩ thú y',
    image: '/assets/aistudio/image_d78a7eec.png',
    imageAlt: 'Hình bác sĩ thú y đang khám cho một chú mèo',
  },
  {
    id: 'pupil',
    word: 'Pupil',
    phonetic: '/ˈpjuːpl/',
    vietnamese: 'Học sinh',
    image: '/assets/aistudio/image_d1e735ad.png',
    imageAlt: 'Hình cậu bé học sinh đang mỉm cười ngồi viết bài trong lớp học',
  },
  {
    id: 'teacher',
    word: 'Teacher',
    phonetic: '/ˈtiːtʃər/',
    vietnamese: 'Giáo viên',
    image: '/assets/aistudio/image_07b899c8.png',
    imageAlt: 'Hình minh họa cô giáo đeo kính chỉ lên bảng chữ cái ABC 123',
  },
];

export interface ListeningQuestion {
  id: string;
  targetId: ProfessionItem['id'];
  choiceIds: [
    ProfessionItem['id'],
    ProfessionItem['id'],
    ProfessionItem['id'],
  ];
}

export const LISTENING_QUESTIONS: ListeningQuestion[] = [
  {
    id: 'listen-1',
    targetId: 'builder',
    choiceIds: ['waiter', 'builder', 'teacher'],
  },
  {
    id: 'listen-2',
    targetId: 'waiter',
    choiceIds: ['vet', 'pupil', 'waiter'],
  },
  {
    id: 'listen-3',
    targetId: 'vet',
    choiceIds: ['vet', 'builder', 'pupil'],
  },
  {
    id: 'listen-4',
    targetId: 'pupil',
    choiceIds: ['teacher', 'pupil', 'waiter'],
  },
  {
    id: 'listen-5',
    targetId: 'teacher',
    choiceIds: ['builder', 'teacher', 'vet'],
  },
];

// Thứ tự file nghe ở Cột 1
export const AUDIO_COLUMN_ORDER: ProfessionItem['id'][] = [
  'builder',
  'waiter',
  'vet',
  'pupil',
  'teacher',
];

// Thứ tự hình ảnh ở Cột 2: sắp xếp lộn xộn, không trùng vị trí hàng nào với Cột 1
export const IMAGE_COLUMN_ORDER: ProfessionItem['id'][] = [
  'vet',
  'teacher',
  'builder',
  'waiter',
  'pupil',
];
