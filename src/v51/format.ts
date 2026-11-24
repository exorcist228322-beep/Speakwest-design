export function greeting(hour: number) {
  if (hour < 5) return 'Доброй ночи'
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}

export function today(date: Date) {
  return new Intl.DateTimeFormat('ru', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}
