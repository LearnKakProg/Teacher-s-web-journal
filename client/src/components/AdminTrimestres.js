import { useState, useEffect } from "react";
import API from "../utils/api";

export default function AdminTrimestres() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", start: "", end: "" });
  const [editingId, setEditingId] = useState(null);

  const load = () => {
    API.get("/trimestres")
      .then(r => setList(r.data))
      .catch(console.error);
  };
  useEffect(load, []);

  const resetForm = () => {
    setForm({ name: "", start: "", end: "" });
    setEditingId(null);
  };

  const submit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/trimestres/${editingId}`, form);
        alert("Триместр изменён");
      } else {
        await API.post("/trimestres", form);
        alert("Триместр создан");
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Ошибка");
    }
  };

  const startEdit = tr => {
    setEditingId(tr._id);
    setForm({ name: tr.name, start: tr.start?.slice(0, 10), end: tr.end?.slice(0, 10) });
  };

  const deleteTr = async id => {
    if (!window.confirm("Точно удалить этот триместр?")) return;
    try {
      await API.delete(`/trimestres/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить");
    }
  };

  return (
    <div className="admin-container">
      <h2>Триместры</h2>

      <table className="trimestre-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {list.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{new Date(t.start).toLocaleDateString()}</td>
              <td>{new Date(t.end).toLocaleDateString()}</td>
              <td>
                <button onClick={() => startEdit(t)}>Изменить</button>
                <button
                  style={{ marginLeft: "0.5rem", backgroundColor: "#c62828", color: "#fff" }}
                  onClick={() => deleteTr(t._id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "2rem 0" }} />
      <h3>{editingId ? "Редактировать триместр" : "Создать новый триместр"}</h3>
      <form className="admin-form" onSubmit={submit}>
        <div className="form-group">
          <label>Название:</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Дата начала:</label>
          <input
            type="date"
            required
            value={form.start}
            onChange={e => setForm({ ...form, start: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Дата окончания:</label>
          <input
            type="date"
            required
            value={form.end}
            onChange={e => setForm({ ...form, end: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">
          {editingId ? "Сохранить изменения" : "Создать"}
        </button>
        {editingId && (
          <button type="button" className="submit-btn" onClick={resetForm} style={{ marginLeft: "0.5rem" }}>
            Отмена
          </button>
        )}
      </form>
    </div>
  );
}