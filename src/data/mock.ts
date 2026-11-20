export type Student = {
  id: string
  name: string
  age?: number
  level: number
  status: 'link_ready' | 'not_invited' | 'last_login'
  statusText: string
}

export type Course = {
  id: string
  name: string
  lessons: number
  students: number
  description: string
  gradient: string
  lessonsList: { id: string; title: string }[]
  accessStudentIds: string[]
}

export const TEACHER_NAME = 'Владислав'

export const students: Student[] = [
  {
    id: '1',
    name: 'Александрина',
    age: 11,
    level: 1,
    status: 'link_ready',
    statusText: 'Ссылка готова, входа ещё не было',
  },
  {
    id: '2',
    name: 'Арина',
    age: 10,
    level: 1,
    status: 'not_invited',
    statusText: 'Ещё не приглашён',
  },
  {
    id: '3',
    name: 'Артем',
    age: 12,
    level: 1,
    status: 'last_login',
    statusText: 'Последний вход 6 дней назад',
  },
  {
    id: '4',
    name: 'Кирил',
    age: 11,
    level: 1,
    status: 'not_invited',
    statusText: 'Ещё не приглашён',
  },
  {
    id: '5',
    name: 'Ксения',
    age: 10,
    level: 1,
    status: 'link_ready',
    statusText: 'Ссылка готова, входа ещё не было',
  },
  {
    id: '6',
    name: 'Максим',
    age: 9,
    level: 1,
    status: 'not_invited',
    statusText: 'Ещё не приглашён',
  },
]

export const courses: Course[] = [
  {
    id: 'd597fffe-e178-47ee-9e0b-ece9739f4da7',
    name: 'Roblox a1',
    lessons: 1,
    students: 1,
    description:
      'Интересные и классные уроки для детей в роблокс и теоретическая часть',
    gradient: 'linear-gradient(160deg, #5b7de8 0%, #3d5fc4 100%)',
    lessonsList: [{ id: 'l1', title: '1 Unit 4 Fantastic feelings' }],
    accessStudentIds: ['5'],
  },
  {
    id: 'language-hub',
    name: 'Language Hub',
    lessons: 1,
    students: 1,
    description: 'Коммуникативный курс для подростков',
    gradient: 'linear-gradient(160deg, #3d529e 0%, #2a3a72 100%)',
    lessonsList: [{ id: 'l1', title: '1 Intro lesson' }],
    accessStudentIds: ['1'],
  },
  {
    id: 'starter-a1',
    name: 'starter a1',
    lessons: 4,
    students: 0,
    description: 'Стартовый курс A1',
    gradient: 'linear-gradient(160deg, #7c6bc4 0%, #5a4a9e 100%)',
    lessonsList: [
      { id: 'l1', title: '1 Hello' },
      { id: 'l2', title: '2 My family' },
      { id: 'l3', title: '3 School' },
      { id: 'l4', title: '4 Free time' },
    ],
    accessStudentIds: [],
  },
]

export function todayLabel(date = new Date()) {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function initial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}

export function pluralLessons(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} урок`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} урока`
  return `${n} уроков`
}

export function pluralStudents(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} ученик`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ученика`
  return `${n} учеников`
}
