import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../index.css';
import { getCellClass } from '../utils/journalHelper';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [selectedTrimestre, setSelectedTrimestre] = useState('all');

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(res => setStudent(res.data))
      .catch(err => {
        console.error(err);
        alert('Ошибка загрузки профиля: ' + (err.response?.data?.msg || err.message));
      });
  }, [id]);

  useEffect(() => {
    API.get('/trimestres')
      .then(res => setTrimestres(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    API.get('/grades', { params: { student: id } })
      .then(res => setGrades(res.data))
      .catch(console.error);
  }, [id]);

  const filteredGrades = grades.filter(g => {
    if (selectedTrimestre === 'all') return true;
    
    const trimestre = trimestres.find(t => t._id === selectedTrimestre);
    if (!trimestre) return true;
    
    const gradeDate = new Date(g.date);
    const start = new Date(trimestre.start);
    const end = new Date(trimestre.end);
    
    return gradeDate >= start && gradeDate <= end;
  });

  const dates = [...new Set(filteredGrades.map(g => {
    const d = new Date(g.date);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth()+1).toString().padStart(2, '0')}`;
  }))].sort((a, b) => {
    const [dayA, monthA] = a.split('.').map(Number);
    const [dayB, monthB] = b.split('.').map(Number);
    if (monthA !== monthB) return monthA - monthB;
    return dayA - dayB;
  });

  const subjects = [...new Set(filteredGrades.map(g => g.subject))].sort();

  const findGrade = (dateStr, subjectName) => {
    return filteredGrades.find(g => {
      const gDate = new Date(g.date);
      const gDateStr = `${gDate.getDate().toString().padStart(2, '0')}.${(gDate.getMonth()+1).toString().padStart(2, '0')}`;
      return gDateStr === dateStr && g.subject === subjectName;
    });
  };

  const calculateAverage = (subjectName) => {
    const subjectGrades = filteredGrades.filter(g => {
      if (g.subject !== subjectName) return false;
      const score = g.score;
      return typeof score === 'number' || (!isNaN(Number(score)) && score !== 'Н' && score !== 'Б');
    });

    if (subjectGrades.length === 0) return '—';

    const sum = subjectGrades.reduce((acc, g) => {
      const score = typeof g.score === 'number' ? g.score : Number(g.score);
      return acc + score;
    }, 0);

    const avg = sum / subjectGrades.length;
    return avg.toFixed(2);
  };

  const getAverageClass = (avg) => {
    if (avg === '—') return '';
    const num = parseFloat(avg);
    if (num >= 4.5) return 'excellent-cell';
    if (num >= 3.5) return 'good-cell';
    if (num >= 2.5) return 'satisfactory-cell';
    return 'avg-poor';
  };

  if (!student) return <div>Загрузка профиля...</div>;

  return (
    <div className="app-container" style={{ marginTop: '30px' }}>
      
      <div className="profile-header">
        <div>
          <h2>{student.name}</h2>
          <p className="text-muted">
            Роль: {student.role} {student.groups ? `| Группа: ${Array.isArray(student.groups) ? student.groups.join(', ') : student.groups}` : ''}
          </p>
          <p className="text-muted">Email: {student.email}</p>
        </div>

        {role === 'admin' && (
          <div className="admin-actions" style={{ marginTop: '0.5rem' }}>
            <button
              className="edit-btn"
              style={{ marginRight: '0.5rem' }}
              onClick={() => navigate(`/admin/edit-user/${id}`)}
            >
              Редактировать
            </button>

            <button
              className="delete-btn"
              style={{ backgroundColor: '#c62828', color: '#fff' }}
              onClick={async () => {
                if (!window.confirm('Точно удалить этого ученика?')) return;
                try {
                  await API.delete(`/users/${id}`);
                  alert('Ученик удалён');
                  navigate('/');
                } catch (err) {
                  console.error(err);
                  alert('Не удалось удалить: ' + (err.response?.data?.msg || err.message));
                }
              }}
            >
              Удалить
            </button>
          </div>
        )}
      </div>

      <div className="trimestre-filter" style={{ margin: '20px 0' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Триместр:</label>
        <select 
          value={selectedTrimestre} 
          onChange={e => setSelectedTrimestre(e.target.value)}
          className="trimestre-select"
        >
          <option value="all">Все триместры</option>
          {trimestres.map(t => (
            <option key={t._id} value={t._id}>
              {t.name} ({new Date(t.start).toLocaleDateString()} – {new Date(t.end).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      <h3>Успеваемость</h3>
      
      {subjects.length === 0 ? (
        <p style={{ color: '#666' }}>Нет оценок за выбранный период</p>
      ) : (
        <div className="journal-table-container">
          <table className="journal-table">
            <thead>
              <tr>
                <th className="sticky-col subject-col">Предмет / Дата</th>
                {dates.map(d => <th key={d} style={{ minWidth: '45px' }}>{d}</th>)}
                <th className="sticky-col-right avg-col">Средний балл</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subj => {
                const avg = calculateAverage(subj);
                return (
                  <tr key={subj}>
                    <td className="sticky-col subject-col" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      {subj}
                    </td>
                    {dates.map(d => {
                      const record = findGrade(d, subj);
                      const value = record ? record.score : '';
                      return (
                        <td key={d} className={getCellClass(value)}>
                          {value}
                        </td>
                      );
                    })}
                    <td className={`sticky-col-right avg-col ${getAverageClass(avg)}`}>
                      {avg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <span style={{ color: '#c62828' }}>■</span> Пропуск (Н) 
        <span style={{ color: '#1565c0', marginLeft: '10px' }}>■</span> Болезнь (Б)
      </div>
    </div>
  );
}