import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import AdminPanel from './components/AdminPanel.js';
import TeacherDashboard from './components/TeacherDashboard.js';
import Schedule from './components/Schedule';
import Header from './components/Header.js'
import StudentProfile from './components/StudentProfile.js';
import AdminUserEdit from './components/AdminUserEdit.js';

function App(){
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={
          <ProtectedRoute>
            <Schedule/>
          </ProtectedRoute>
        }/>
        <Route path="/admin" element={
          <ProtectedRoute rolesAllowed={['admin']}>
            <AdminPanel/>
          </ProtectedRoute>
        }/>
        <Route path="/teacher" element={
          <ProtectedRoute rolesAllowed={['teacher', 'admin']}>
            <TeacherDashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <StudentProfile/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/edit-user/:id" element={
          <ProtectedRoute rolesAllowed={['admin']}>
            <AdminUserEdit/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;