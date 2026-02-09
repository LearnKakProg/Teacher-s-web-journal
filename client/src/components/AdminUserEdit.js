import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    groups: "",
    childIds: "",
    password: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(r => {
        const u = r.data;
        setForm({
          name: u.name || "",
          email: u.email || "",
          role: u.role,
          groups: Array.isArray(u.groups) ? u.groups.join(", ") : u.groups || "",
          childIds: u.childIds?.map(c => c._id).join(", ") || "",
          password: ""
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Не удалось загрузить пользователя");
        navigate(-1);
      });
  }, [id, navigate]);

  const submit = async e => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        groups: form.groups ? form.groups.split(",").map(g => g.trim()): [],
        childIds: form.childIds ? form.childIds.split(",").map(c => c.trim()) : []
        };
      if (form.password) payload.password = form.password;

      await API.put(`/users/${id}`, payload);
      alert("Пользователь обновлён");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Ошибка обновления");
    }
  };

  if (loading) return <div>Загрузка данных…</div>;

  return (
    <div className="admin-container">
      <h2>Редактировать пользователя</h2>
      <form className="admin-form" onSubmit={submit}>
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Роль:</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="teacher">Учитель</option>
            <option value="student">Ученик</option>
            <option value="parent">Родитель</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        {(form.role === "teacher" || form.role === "student") && (
          <div className="form-group">
            <label>Группы (через запятую):</label>
            <input
              type="text"
              placeholder="1 класс, 2 класс"
              value={form.groups}
              onChange={e => setForm({ ...form, groups: e.target.value })}
            />
          </div>
        )}

        {form.role === "parent" && (
          <div className="form-group">
            <label>IDs учеников (через запятую):</label>
            <input
              type="text"
              placeholder="6982bca6dae847b3acca177b, ..."
              value={form.childIds}
              onChange={e => setForm({ ...form, childIds: e.target.value })}
            />
          </div>
        )}

        <div className="form-group">
          <label>Новый пароль (оставьте пустым → не менять):</label>
          <input
            type="password"
            placeholder="********"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}