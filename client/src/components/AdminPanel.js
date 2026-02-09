import { useState } from 'react';
import API from '../utils/api';
import AdminTrimestres from "./AdminTrimestres";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  const [form, setForm] = useState({
    name:'',
    email:'',
    password:'',
    role:'teacher',
    groups: '',
    childEmail: ''});
  const submit = async e => {
    e.preventDefault();
    try{
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role !== 'parent') {
        payload.groups = form.groups;
      }

      if (form.role === 'parent') {
        payload.childEmail = form.childEmail;
      }

      await API.post('/auth/register', form);
      alert('Пользователь создан');

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'teacher',
        groups: '',
        childEmail: ''});
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.msg || 'Ошибка при создании пользователя';
        alert(errorMsg);
    }};

  return (
    <div className="admin-container">
      <div className="admin-tab-bar">
        <button
          className={activeTab === "users" ? "active-tab" : ""}
          onClick={() => setActiveTab("users")}
        >
          Пользователи
        </button>
        <button
          className={activeTab === "trimestres" ? "active-tab" : ""}
          onClick={() => setActiveTab("trimestres")}
        >
          Триместры
        </button>
      </div>

      {activeTab === "users" && (
        <>
        <h2>Создание пользователя</h2>
        <form className="admin-form" onSubmit={submit}>

          <div className="form-group">
            <label>Имя:</label>
            <input 
              type="text" 
              placeholder="Иван Иванов" 
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Пароль:</label>
            <input 
              type="password" 
              placeholder="Минимум 8 символов" 
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Роль:</label>
            <select 
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
            >
              <option value="teacher">Учитель</option>
              <option value="student">Ученик</option>
              <option value="parent">Родитель</option>
              <option value="admin">Администратор</option>
            </select>
          </div>

          {form.role === 'teacher' || form.role === 'student' ? (
            <div className="form-group">
              <label>{form.role === 'teacher' ? 'Ведет классы (через запятую)' : 'Класс ученика'}:</label>
              <input 
                type="text" 
                placeholder={form.role === 'teacher' ? '1 класс, 2 класс' : '1 класс'}
                value={form.groups}
                onChange={e => setForm({...form, groups: e.target.value})}
                required
              />
            </div>
          ) : null}

          {form.role === 'parent' && (
            <div className="form-group">
              <label>Email ученика (для привязки):</label>
              <input 
                type="email" 
                placeholder="student@school.ru"
                value={form.childEmail}
                onChange={e => setForm({...form, childEmail: e.target.value})}
              />
              <small style={{color: '#666'}}>Укажите email уже существующего ученика</small>
            </div>
          )}

          <button type="submit" className="submit-btn">Создать пользователя</button>
        </form>
      </>
    )}
    {activeTab === "trimestres" && <AdminTrimestres />}
    </div>
  );
}