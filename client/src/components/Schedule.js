import { useState, useEffect } from 'react';
import API from '../utils/api';
import '../index.css';


const DAYS_ORDER = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота','Воскресенье'];

export default function Schedule() {
  const [rawSchedule, setRawSchedule] = useState([]);
  const [role, setRole] = useState('');

  const [selectedGroup, setSelectedGroup] = useState('all');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLesson, setNewLesson] = useState({ subject: 'Математика', time: '', dayOfWeek: 'Понедельник', groupName: '1 класс' })

  useEffect(() => {
    API.get('/schedule')
      .then(r => {
        setRawSchedule(r.data);
        const currentUserRole = localStorage.getItem('role');
        setRole(currentUserRole);
      })
      .catch(console.error);
  }, []);

  const uniqueGroups = [...new Set(rawSchedule.map(l => l.groupName))].sort();


  const filteredSchedule = rawSchedule.filter(lesson => {

    if (role !== '') {
      if (selectedGroup === 'all') {
        return true;
      }
      return lesson.groupName === selectedGroup;
    }
  

    const childGroups = getChildGroupsForParent
    return childGroups.includes(lesson.groupName)
  });


  const scheduleByDay = {};

  filteredSchedule.forEach(lesson => {
    if (!scheduleByDay[lesson.dayOfWeek]) {
      scheduleByDay[lesson.dayOfWeek] = [];
    }
    scheduleByDay[lesson.dayOfWeek].push(lesson);
  });

  Object.keys(scheduleByDay).forEach(day => {
    scheduleByDay[day].forEach(item => {
      if (/^\d:/.test(item.time)) {
        item.time = item.time.replace(/^(\d):/, '0$1:');
      }
    });
    scheduleByDay[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await API.post('/schedule', newLesson);
      alert('Урок добавлен');
      setShowCreateForm(false);
      API.get('/schedule').then(r => setRawSchedule(r.data));
      setNewLesson({ subject: '', time: '', dayOfWeek: 'Понедельник', groupName: '' });
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      return;
    }

    try {
      await API.delete(`/schedule/${id}`);
      setRawSchedule(rawSchedule.filter(lesson => lesson._id !== id));
    } catch (err) {
      console.error(err);
      alert('Не удалось удалить урок');
    }
  };

  return (
    <div className="app-container" style={{ marginTop: '30px' }}>

      <div className="schedule-header-row">
        <h2>Расписание занятий</h2>
        {role === 'admin' && (
          <button 
            className="create-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Отмена' : '+ Добавить урок'}
          </button>
        )}
      {role !== '' && (
        <div className="controls-panel">
          <label>Фильтр по классу: </label>
          <select 
            value={selectedGroup} 
            onChange={e => setSelectedGroup(e.target.value)}
          >
            <option value="all">Все классы</option>
            {uniqueGroups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      )}

      {showCreateForm && (
        <form className="create-lesson-form" onSubmit={handleCreateLesson}>
          <h3>Новый урок</h3>
          <input 
            placeholder="Предмет" 
            value={newLesson.subject}
            onChange={e => setNewLesson({...newLesson, subject: e.target.value})}
            required
          />
          <input 
            type="time"
            value={newLesson.time}
            onChange={e => setNewLesson({...newLesson, time: e.target.value})}
            required
          />
          <select 
            value={newLesson.dayOfWeek}
            onChange={e => setNewLesson({...newLesson, dayOfWeek: e.target.value})}
          >
            {DAYS_ORDER.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input 
            placeholder="1 класс"
            value={newLesson.groupName}
            onChange={e => setNewLesson({...newLesson, groupName: e.target.value})}
            required
          />
          <button type="submit">Сохранить</button>
        </form>
      )}
      </div>
      <div className="schedule-grid">
        {DAYS_ORDER.map(day => {
          if (!scheduleByDay[day]) return null; 
          return (
            <div key={day} className="schedule-day-card">
              <div className="schedule-day-header">{day}</div>
              {scheduleByDay[day] && scheduleByDay[day].map((lesson, idx) => (
                <div key={idx} className="schedule-lesson-row">
                  <div className="lesson-time">{lesson.time}</div>
                  <div className="lesson-info">
                    <div className="lesson-subject">{lesson.subject}</div>
                    <div className="lesson-group">{lesson.groupName}</div>
                  </div>
                  {(role === 'admin' || role === 'teacher') && (
                        <button 
                          className="delete-lesson-btn"
                          onClick={() => handleDelete(lesson._id)}
                          title="Удалить урок"
                        >
                          ×
                        </button>
                      )}
                </div>
              ))}
              {!scheduleByDay[day] && (
                <div className="no-lessons">Выходной</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}