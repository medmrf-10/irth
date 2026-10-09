// أنواع TypeScript مطابقة لـ docs/data.md حرفياً (إصدار 1).

/** شكل الجدول العام: {v, rows[]} وكل صف في سطر مستقل مرتب حسب id. */
export interface Table<Row> {
  v: number;
  rows: Row[];
}

/* العلوم — data/sciences.json */
export interface Science {
  id: string;
  name: string;
}

/* الأشخاص — data/persons.json */
export interface Person {
  id: string;
  name: string;
  short?: string;
  aliases?: string[];
  photo?: string;
  links?: string[];
}

/* الكتب — data/works.json */
export type WorkKind = 'matn' | 'sharh' | 'hashiya' | 'nazm' | 'kitab';
export interface Work {
  id: string;
  title: string;
  aliases?: string[];
  author?: string;
  science?: string;
  kind?: WorkKind;
  base?: string;
}

/* الفيديوهات — data/tube/videos.json */
export type ContentFile = 'transcript' | 'align' | 'summary' | 'questions' | 'highlights';
export interface Video {
  id: string; // رمز يوتيوب 11 حرفاً
  title: string;
  ytTitle?: string;
  speakers?: string[];
  work?: string;
  duration: number; // ثوانٍ
  lang?: string;
  has?: ContentFile[];
  status?: 'rejected';
  note?: string;
}

/* السلاسل — data/tube/series.json */
export interface Series {
  id: string;
  title: string;
  items: string[]; // رموز الفيديوهات بالترتيب؛ رقم الدرس = مكانه + 1
  sources?: string[];
  complete?: boolean;
  note?: string;
}

/* المحتوى — content/tube/<videoId>/ */
export interface Align {
  v: number;
  words: string; // كلمات مفصولة بمسافة واحدة
  start: number[]; // بأجزاء المئة من الثانية
  dur: number[]; // بأجزاء المئة من الثانية
  cov?: number;
}

export interface Summary {
  v: number;
  summary: string;
  points: string[]; // 4 إلى 7
}

export type QuestionType = 'choice';
export interface Question {
  id: string;
  at: number; // الثانية التي يتوقف عندها الفيديو
  priority: 1 | 2 | 3;
  type: QuestionType;
  q: string;
  options: string[];
  answer: number; // رقم الخيار الصحيح، الأول 0
  explain?: string;
}
export interface Questions {
  v: number;
  items: Question[];
}

export interface Highlights {
  v: number;
  key: number[]; // أرقام الكلمات داخل words، الأولى 0
}

/* المستخدم — users/<id>.json */
export type QuestionDensity = 'off' | 'low' | 'mid' | 'high';
export type ThemeId = 'paper' | 'night';

export interface UserSettings {
  questions?: QuestionDensity;
  theme?: ThemeId;
  editKey?: string;
}

export interface VideoProgress {
  pos: number; // آخر موضع بالثواني
  heard: number; // مجموع ثواني السماع الفعلية
  done: number; // عدد مرات الإكمال عند 95%
  last: string; // تاريخ آخر سماع YYYY-MM-DD
}

export interface UserData {
  v: number;
  user: string;
  favorites?: string[]; // رموز السلاسل
  settings?: UserSettings;
  progress?: Record<string, VideoProgress>;
  days?: Record<string, number>; // تاريخ → ثواني سماع
  answers?: Record<string, Record<string, boolean>>;
}
