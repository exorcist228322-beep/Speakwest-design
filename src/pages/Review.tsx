import { IconClipboard } from '../components/Icons'

export function Review() {
  return (
    <>
      <div className="page-top">
        <div>
          <h1 className="page-title">Проверка</h1>
          <p className="page-sub">Сданные домашки ваших учеников</p>
        </div>
      </div>

      <div className="empty-page">
        <div className="empty-icon">
          <IconClipboard size={24} />
        </div>
        <h2>Домашек пока нет</h2>
        <p>
          Задайте домашку на странице урока, во вкладке «Домашнее задание».
        </p>
      </div>
    </>
  )
}
