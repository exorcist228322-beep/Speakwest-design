// Mock data for layout 5.1. Same shapes the live app shows, no real people or keys.

export type Tone = 'accent' | 'grape' | 'mint' | 'sun' | 'sky' | 'flame'

export type Lesson = { id: string; title: string }

export type Course = {
  id: string
  title: string
  description: string
  color: Tone
  lessons: Lesson[]
  studentIds: string[]
}

export type Student = {
  id: string
  name: string
  age: number
  level: number
  access: { text: string; tone: 'neutral' | 'amber' | 'emerald' }
  hasLink: boolean
}

export type HomeworkStatus = 'assigned' | 'submitted' | 'checked'

export type Homework = {
  id: string
  studentId: string
  courseId: string
  lessonId: string
  status: HomeworkStatus
  /** Ready-made line for the list: "Сдано вчера", "Сдать до 28 ноя". */
  when: string
  overdue: boolean
  stars: number | null
}

export type Activity = {
  id: string
  kind: 'submitted' | 'checked' | 'assigned'
  studentId: string
  lessonTitle: string
  ago: string
  stars?: number
}

export const teacher = { name: 'Владислав', email: 'teacher@example.com' }

export const students: Student[] = [
  { id: 's1', name: 'Ксения', age: 10, level: 3, access: { text: 'Последний вход вчера', tone: 'emerald' }, hasLink: true },
  { id: 's2', name: 'Александрина', age: 11, level: 2, access: { text: 'Ссылка готова, входа ещё не было', tone: 'amber' }, hasLink: true },
  { id: 's3', name: 'Артём', age: 12, level: 4, access: { text: 'Последний вход 3 дня назад', tone: 'emerald' }, hasLink: true },
  { id: 's4', name: 'Арина', age: 10, level: 1, access: { text: 'Ещё не приглашён', tone: 'neutral' }, hasLink: false },
  { id: 's5', name: 'Максим', age: 9, level: 1, access: { text: 'Ещё не приглашён', tone: 'neutral' }, hasLink: false },
]

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Starter A1',
    description: 'Первый год английского: семья, цвета, школа.',
    color: 'sun',
    studentIds: ['s1', 's2', 's4'],
    lessons: [
      { id: 'l1', title: 'Hello! Greetings' },
      { id: 'l2', title: 'My family' },
      { id: 'l3', title: 'Colours and numbers' },
      { id: 'l4', title: 'Unit 4. Feelings' },
    ],
  },
  {
    id: 'c2',
    title: 'Kids Box 2',
    description: 'Уроки по учебнику Kids Box 2.',
    color: 'grape',
    studentIds: ['s1', 's3'],
    lessons: [
      { id: 'l5', title: 'Unit 1. My school' },
      { id: 'l6', title: 'Unit 2. Food' },
    ],
  },
  {
    id: 'c3',
    title: 'Grammar Friends 3',
    description: 'Грамматика для третьего класса.',
    color: 'mint',
    studentIds: ['s3'],
    lessons: [{ id: 'l7', title: 'Present Simple' }],
  },
  {
    id: 'c4',
    title: 'Speaking club',
    description: 'Разговорные встречи для подростков.',
    color: 'flame',
    studentIds: [],
    lessons: [],
  },
]

export const homework: Homework[] = [
  { id: 'h1', studentId: 's1', courseId: 'c1', lessonId: 'l4', status: 'submitted', when: 'Сдано вчера', overdue: false, stars: null },
  { id: 'h2', studentId: 's2', courseId: 'c1', lessonId: 'l1', status: 'submitted', when: 'Сдано сегодня', overdue: false, stars: null },
  { id: 'h3', studentId: 's1', courseId: 'c2', lessonId: 'l6', status: 'assigned', when: 'Просрочено: срок до 20 ноя', overdue: true, stars: null },
  { id: 'h4', studentId: 's3', courseId: 'c3', lessonId: 'l7', status: 'assigned', when: 'Сдать до 28 ноя', overdue: false, stars: null },
  { id: 'h5', studentId: 's1', courseId: 'c1', lessonId: 'l2', status: 'checked', when: 'Проверено 3 дня назад', overdue: false, stars: 3 },
  { id: 'h6', studentId: 's3', courseId: 'c2', lessonId: 'l5', status: 'checked', when: 'Проверено на прошлой неделе', overdue: false, stars: 2 },
]

export const activity: Activity[] = [
  { id: 'a1', kind: 'submitted', studentId: 's2', lessonTitle: 'Hello! Greetings', ago: '2 часа назад' },
  { id: 'a2', kind: 'submitted', studentId: 's1', lessonTitle: 'Unit 4. Feelings', ago: 'вчера' },
  { id: 'a3', kind: 'checked', studentId: 's1', lessonTitle: 'My family', ago: '3 дня назад', stars: 3 },
  { id: 'a4', kind: 'assigned', studentId: 's3', lessonTitle: 'Present Simple', ago: '4 дня назад' },
  { id: 'a5', kind: 'checked', studentId: 's3', lessonTitle: 'Unit 1. My school', ago: 'на прошлой неделе', stars: 2 },
]

/** The student who is signed in on the student side of the mock. */
export const me = {
  studentId: 's1',
  level: 3,
  xp: 300,
  nextLevelXp: 600,
  streakWeeks: 2,
}

export const achievements = [
  { id: 'first-homework', title: 'Первая домашка', description: 'Сдай первую домашку', current: 1, target: 1 },
  { id: 'homework-10', title: 'Десять из десяти', description: 'Сдай 10 домашек', current: 4, target: 10 },
  { id: 'on-time-5', title: 'Без опозданий', description: 'Сдай 5 домашек вовремя', current: 3, target: 5 },
  { id: 'three-stars', title: 'Три звезды', description: 'Получи 3 звезды за домашку', current: 1, target: 1 },
  { id: 'stars-30', title: 'Звездопад', description: 'Собери 30 звёзд', current: 11, target: 30 },
  { id: 'streak-3', title: 'Серия', description: '3 недели подряд без долгов', current: 2, target: 3 },
  { id: 'sharp-20', title: 'Снайпер', description: 'Сделай без ошибок 20 заданий', current: 9, target: 20 },
  { id: 'writer-5', title: 'Писатель', description: 'Напиши 5 эссе', current: 1, target: 5 },
  { id: 'artist-5', title: 'Художник', description: 'Выполни 5 заданий с рисованием', current: 2, target: 5 },
  { id: 'live-5', title: 'На связи', description: 'Побывай на 5 живых уроках', current: 5, target: 5 },
  { id: 'level-5', title: 'Пятый уровень', description: 'Дойди до 5 уровня', current: 3, target: 5 },
]

export const xpRules = [
  { label: 'Задание выполнено', value: '+10' },
  { label: 'Задание без ошибок', value: '+5' },
  { label: 'Домашка сдана', value: '+30' },
  { label: 'Сдана вовремя', value: '+20' },
  { label: 'Звезда от учителя', value: '+10' },
  { label: 'Живой урок', value: '+20' },
]

export function studentById(id: string) {
  return students.find((s) => s.id === id)!
}

export function courseById(id: string) {
  return courses.find((c) => c.id === id)
}

export function lessonById(id: string) {
  for (const c of courses) {
    const l = c.lessons.find((x) => x.id === id)
    if (l) return { course: c, lesson: l }
  }
  return undefined
}

export function plural(n: number, [one, few, many]: [string, string, string]) {
  const form = new Intl.PluralRules('ru').select(n)
  return `${n} ${form === 'one' ? one : form === 'few' ? few : many}`
}

export const LESSONS: [string, string, string] = ['урок', 'урока', 'уроков']
export const STUDENTS: [string, string, string] = ['ученик', 'ученика', 'учеников']
export const WEEKS: [string, string, string] = ['неделя', 'недели', 'недель']
