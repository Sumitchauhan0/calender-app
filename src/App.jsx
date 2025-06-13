import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns'
import './app.css'

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Team Meeting',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      duration: 60,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Lunch with Client',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '12:30',
      duration: 90,
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Project Deadline',
      date: format(addMonths(new Date(), 1), 'yyyy-MM-15'),
      time: '17:00',
      duration: 0,
      color: 'bg-red-500'
    }
  ])

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '09:00',
    duration: 60,
    color: 'bg-blue-500'
  })

  // Update form when selectedDate changes
  React.useEffect(() => {
    setFormData((fd) => ({ ...fd, date: format(selectedDate, 'yyyy-MM-dd') }))
  }, [selectedDate])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date) =>
    events.filter((event) => isSameDay(parseISO(event.date), date))

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Add event handler
  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return alert('Please enter a title.')

    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      duration: Number(formData.duration),
      color: formData.color
    }
    setEvents((prev) => [...prev, newEvent])
    setFormData({
      title: '',
      date: formData.date,
      time: '09:00',
      duration: 60,
      color: 'bg-blue-500'
    })
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="header">
        <button onClick={prevMonth} className="button" aria-label="Previous Month">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="button" aria-label="Next Month">
          <ChevronRight />
        </button>
      </div>

      {/* Days of week */}
      <div className="days-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates grid */}
      <div className="dates-grid">
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="empty-cell" />
        ))}

        {monthDays.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isOtherMonth = !isSameMonth(day, currentDate)

          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`
                day-cell
                ${isToday ? 'day-today' : ''}
                ${isSelected ? 'day-selected' : ''}
                ${isOtherMonth ? 'day-other-month' : ''}
              `}
            >
              <div className="day-number">{format(day, 'd')}</div>
              <div className="events-container">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`event-item ${event.color}`}
                    title={`${event.time} - ${event.title}`}
                  >
                    {event.time} {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="selected-date-details">
          <h3 className="text-lg font-semibold mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          {getEventsForDate(selectedDate).length > 0 ? (
            <ul className="event-list">
              {getEventsForDate(selectedDate).map((event) => (
                <li key={event.id} className="event-list-item">
                  <div className={`event-color-dot ${event.color}`}></div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {event.time} ({event.duration} mins)
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">No events scheduled</p>
          )}
        </div>
      )}

      {/* Add event form */}
      <form onSubmit={handleAddEvent} className="mt-6 p-4 border rounded-md bg-white shadow max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">Add Event</h3>

        <label className="block mb-2 font-medium">
          Title
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="block mb-2 font-medium">
          Date
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="block w-full border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="block mb-2 font-medium">
          Time
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="block w-full border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="block mb-2 font-medium">
          Duration (minutes)
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="block w-full border rounded p-2 mt-1"
            min="0"
            required
          />
        </label>

        <label className="block mb-4 font-medium">
          Color
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="block w-full border rounded p-2 mt-1"
          >
            <option value="bg-blue-500">Blue</option>
            <option value="bg-green-500">Green</option>
            <option value="bg-red-500">Red</option>
            <option value="bg-yellow-500">Yellow</option>
            <option value="bg-purple-500">Purple</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-red  p-2 rounded hover:bg-blue-700 transition"
        >
          Add Event
        </button>
      </form>
    </div>
  )
}
