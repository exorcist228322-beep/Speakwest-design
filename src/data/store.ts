import { useSyncExternalStore } from 'react'

// Prototype state shared by every page. Lives in memory, resets on reload.
// In the real app this is the API; the shapes below are what the pages expect.

export type HomeworkStatus = 'assigned' | 'submitted' | 'checked'

export type Homework = {
  id: string
  studentId: string
  classId: string
  title: string
  lesson?: string
  status: HomeworkStatus
  due: string
  submittedAt?: string
  grade?: number
  comment?: string
}

export type Award = {
  id: string
  title: string
  hint: string
}

export type GivenAward = {
  id: string
  awardId: string
  studentId: string
  date: string
}

export const awards: Award[] = [
  { id: 'first-lesson', title: 'Первый урок', hint: 'Первый урок пройден' },
  { id: 'three-in-row', title: 'Три подряд', hint: 'Три домашки вовремя подряд' },
  { id: 'words-50', title: '50 слов', hint: '50 слов выучено в тренажёре' },
  { id: 'no-mistakes', title: 'Без ошибок', hint: 'Домашка без единой ошибки' },
  { id: 'month', title: 'Месяц с нами', hint: 'Четыре недели занятий подряд' },
]

type State = {
  homework: Homework[]
  given: GivenAward[]
}

let state: State = {
  homework: [
    { id: 'h1', studentId: '5', classId: 'c1', title: 'Feelings: упражнения 1–4', lesson: '1 Unit 4 Fantastic feelings', status: 'submitted', due: '23 ноября', submittedAt: 'вчера, 19:40' },
    { id: 'h2', studentId: '1', classId: 'c2', title: 'Intro: рассказ о себе', lesson: '1 Intro lesson', status: 'submitted', due: '24 ноября', submittedAt: 'сегодня, 09:15' },
    { id: 'h3', studentId: '3', classId: 'c3', title: 'Present Simple: 10 предложений', status: 'assigned', due: '25 ноября' },
    { id: 'h4', studentId: '2', classId: 'c4', title: 'Цифры 1–20', status: 'assigned', due: '28 ноября' },
    { id: 'h5', studentId: '4', classId: 'c4', title: 'Цифры 1–20', status: 'assigned', due: '28 ноября' },
    { id: 'h6', studentId: '6', classId: 'c4', title: 'Цифры 1–20', status: 'assigned', due: '28 ноября' },
    { id: 'h7', studentId: '5', classId: 'c1', title: 'Roblox: слова урока', lesson: '1 Unit 4 Fantastic feelings', status: 'checked', due: '18 ноября', submittedAt: '17 ноября', grade: 5, comment: 'Отлично, все слова верно' },
    { id: 'h8', studentId: '1', classId: 'c2', title: 'Hello: диалог', lesson: '1 Intro lesson', status: 'checked', due: '19 ноября', submittedAt: '19 ноября', grade: 4 },
  ],
  given: [
    { id: 'g1', awardId: 'first-lesson', studentId: '3', date: '15 ноября' },
    { id: 'g2', awardId: 'first-lesson', studentId: '5', date: '11 ноября' },
    { id: 'g3', awardId: 'no-mistakes', studentId: '5', date: '18 ноября' },
    { id: 'g4', awardId: 'first-lesson', studentId: '1', date: '12 ноября' },
  ],
}

const listeners = new Set<() => void>()

function set(next: Partial<State>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useHomework() {
  return useSyncExternalStore(subscribe, () => state.homework)
}

export function useGivenAwards() {
  return useSyncExternalStore(subscribe, () => state.given)
}

export function checkHomework(id: string, grade: number, comment: string) {
  set({
    homework: state.homework.map((h) =>
      h.id === id ? { ...h, status: 'checked', grade, comment: comment || undefined } : h,
    ),
  })
}

export function assignHomework(classId: string, studentIds: string[], title: string, due: string) {
  const stamp = Date.now()
  set({
    homework: [
      ...studentIds.map((studentId, i) => ({
        id: `h${stamp}-${i}`,
        studentId,
        classId,
        title,
        status: 'assigned' as const,
        due,
      })),
      ...state.homework,
    ],
  })
}

export function giveAward(awardId: string, studentId: string) {
  set({
    given: [{ id: `g${Date.now()}`, awardId, studentId, date: 'сегодня' }, ...state.given],
  })
}
