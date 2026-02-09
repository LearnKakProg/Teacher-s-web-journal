import { useState, useEffect } from 'react';
import API from '../utils/api';
import GroupJournal from './GroupJournal';

const CURRICULUM = {
  '1 класс': [
    'Русский язык', 'Литературное чтение', 'Математика', 'Окружающий мир', 'Музыка', 'Изобразительное искусство', 'Технология', 'Физическая культура'],
  '2 класс': [ 'Русский язык', 'Литературное чтение', 'Математика', 'Окружающий мир', 'Иностранный язык', 'Музыка', 'Изобразительное искусство', 'Технология', 'Физическая культура'],
  '3 класс': [ 'Русский язык', 'Литературное чтение', 'Математика', 'Окружающий мир', 'Иностранный язык', 'Музыка', 'Изобразительное искусство', 'Технология', 'Физическая культура'],
  '4 класс': [ 'Русский язык', 'Литературное чтение', 'Математика', 'Окружающий мир', 'Иностранный язык', 'Музыка', 'Изобразительное искусство', 'Технология', 'Физическая культура'],
  '5 класс': [ 'Русский язык', 'Литературное чтение', 'Математика', 'История', 'Биология', 'География', 'Иностранный язык', 'Музыка', 'Изобразительное искусство', 'Технология', 'Физическая культура', 'ОБЗР'],
  'Кружки': [
    'Робототехника', 'Шахматы', 'Программирование (Scratch)', 'Английский язык'],
  'Репетитор': [
    'Русский язык', 'Литературное чтение', 'Математика', 'Английский язык']
};

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student:'', subject:'', score:'', groupName: '', date: ""});

  useEffect(()=>{
    API.get('/users/students').then(r=>setStudents(r.data)).catch(console.error);;
  },[]);

  const addGrade=async e=>{
    e.preventDefault();
    try {
      await API.post('/grades', form);
      alert('Оценка добавлена');
      setForm({ student: '', subject: '', score: 'н', groupName: '', date: "" });
    } catch (err) {
      console.error(err);
      alert('Ошибка: ' + (err.response?.data?.msg || err.message));
    }
  };

//так, ниже будет журнал класса
  const [journalGroup, setJournalGroup] = useState('');
  const [journalSubject, setJournalSubject] = useState('');
  const [journalMonth, setJournalMonth] = useState(
    new Date().toISOString().slice(0, 7));
    
  const availableSubjects = form.groupName
    ? CURRICULUM[form.groupName] || []
    : [];
  const useSubjectSelect = availableSubjects.length > 0;

  return (
    <div className="teacher-dashboard-wrapper">
      <div className="grade-form-wrapper">
        <h2>Добавить оценку / статус посещаемости</h2>

        <form className="teacher-form" onSubmit={addGrade}>

          <div className="form-group">
            <label>Ученик:</label>
            <select 
              required
              value={form.student} 
              onChange={e => setForm({...form, student: e.target.value})}
            >
              <option value=""> Выберите ученика </option>
              {students.map(s => 
                <option key={s._id} value={s._id}>
                  {s.name} {s.groups ? Array.isArray(s.groups) ? `(${s.groups.join(', ')})` : `(${s.groups})`: ''}
                </option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Группа / Класс:</label>
            <select 
              required
              value={form.groupName} 
              onChange={e => {
                setForm({...form, groupName: e.target.value, subject: ''}); // Сбрасываем предмет при смене группы
              }}
            >
              <option value="">-- Выберите группу --</option>
              {Object.keys(CURRICULUM).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Предмет:</label>
            {useSubjectSelect ? (

              <select 
                required
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
              >
                <option value=""> Выберите предмет </option>
                {availableSubjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            ) : (

              <input 
                required
                placeholder="Введите предмет" 
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
              />
            )}
          </div>

          <div className="form-group">
            <label>Оценка (1‑5) или статус:</label>
            <select
              required
              value={form.score}
              onChange={e => {
                const raw = e.target.value;
                const num = Number(raw);
                setForm({ ...form, score: Number.isNaN(num) ? raw : num });
              }}
            >
              <option value="">Выберите значение</option>
              <>
                {[1, 2, 3, 4, 5].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </>
              <option value="Н">Н – отсутствие</option>
              <option value="Б">Б – болезнь</option>
            </select>
          </div>

          <div className="form-group">
            <label>Дата:</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-btn">Сохранить</button>
        </form>
      </div>


      <div className="journal-scroll-wrapper">
        <hr style={{ margin: "2rem 0" }} />
          <h2>Журнал группы</h2>

          <div className="journal-filters">
            <select
              value={journalGroup}
              onChange={e => {
                setJournalGroup(e.target.value);
                setJournalSubject("");
              }}
            >
              <option value="">-- Выберите группу --</option>
              {Object.keys(CURRICULUM).map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
              
            <select
              disabled={!journalGroup}
              value={journalSubject}
              onChange={e => setJournalSubject(e.target.value)}
            >
              <option value="">Все предметы</option>
              {journalGroup &&
                (CURRICULUM[journalGroup] || []).map(subj => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
            </select>
                
            <input
              type="month"
              value={journalMonth}
              onChange={e => setJournalMonth(e.target.value)}
            />
          </div>
                
          {journalGroup && journalMonth && (
            <GroupJournal
              groupName={journalGroup}
              subject={journalSubject}
              month={journalMonth}
              students={students}
            />
          )}
        </div>
    </div>
  );
}