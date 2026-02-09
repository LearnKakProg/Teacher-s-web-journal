import { useEffect, useState } from "react";
import API from "../utils/api";
import { getCellClass } from "../utils/journalHelper";

export default function GroupJournal({ groupName, subject, month, students }) {

  const [grades, setGrades] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!groupName || !month) {
      setGrades([]);
      return;
    }

    API.get("/grades")
      .then(r => {
        const filtered = r.data.filter(g => {

          if (g.groupName !== groupName) return false;
          if (subject && g.subject !== subject) return false;

          const gDate = new Date(g.date);
          const gMonth = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          return gMonth === month;
        });
        setGrades(filtered);
      })
      .catch(console.error);
  }, [groupName, subject, month]);

  useEffect(() => {
    if (!month) {
      setDays([]);
      return;
    }
    const [yr, mon] = month.split("-").map(Number);
    const daysInMonth = new Date(yr, mon, 0).getDate();
    const arr = [];
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(String(d).padStart(2, "0"));
    }
    setDays(arr);
  }, [month]);

  const studentsInGroup = students.filter(st => {

    if (!st.groups) return false;
    const studentGroups = Array.isArray(st.groups) ? st.groups : [st.groups];
    return studentGroups.includes(groupName);
  });

  const findGrade = (studentId, day) => {
    const target = new Date(`${month}-${day}`);
    return grades.find(g => {
      const sameStudent = String(g.student._id) === String(studentId);
      const sameDate = new Date(g.date).toDateString() === target.toDateString();
      return sameStudent && sameDate;
    });
  };
//____________
  const role = localStorage.getItem('role');
  const canEdit = role === 'teacher' || role === 'admin';

  const deleteGrade = async (gradeId) => {
    if (!window.confirm('Точно удалить эту оценку?')) return;

    try {
      await API.delete(`/grades/${gradeId}`);
      setGrades(prev => prev.filter(g => String(g._id) !== String(gradeId)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Не удалось удалить оценку');
    }
  };

  return (
    <div className="group-journal-wrapper" style={{ marginTop: "30px" }}>
      <h3>
        Журнал – {groupName}
        {subject && ` / ${subject}`} – {month}
      </h3>

      <table className="journal-table">
        <thead>
          <tr>
            <th style={{ width: "200px" }}>Ученик / Дата</th>
            {days.map(d => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsInGroup.map(st => (
            <tr key={st._id}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>{st.name}</td>
              {days.map(d => {
                const rec = findGrade(st._id, d);
                const val = rec ? rec.score : "";
                return (
                  <td key={d} className={getCellClass(val)}>
                    <div className="cell-content">
                      {val}
                      {canEdit && rec && (
                        <button
                          className="delete-grade-btn"
                          title="Удалить оценку"
                          onClick={() => deleteGrade(rec._id)}
                        >
                          ✖
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <span style={{ color: "#c62828" }}>■</span> Пропуск (Н)
        <span style={{ color: "#1565c0", marginLeft: "10px" }}>■</span> Болезнь (Б)
      </div>
    </div>
  );
}