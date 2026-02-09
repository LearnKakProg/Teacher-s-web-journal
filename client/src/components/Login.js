import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Login() {
  const [email,setEmail]=useState('');
  const [pwd,setPwd]=useState('');
  const nav = useNavigate();
  
  const submit=async e=>{
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login',{ email, password: pwd });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.id);
      nav('/');
    } catch (e) { alert(e.response.data.msg); }
  };
  
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Вход в систему</h2>
        
        <form onSubmit={submit}>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={e=>setEmail(e.target.value)}
            value={email}
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            onChange={e=>setPwd(e.target.value)}
            value={pwd}
          />
          <button>Войти</button>
        </form>
      </div>
    </div>
  );
}