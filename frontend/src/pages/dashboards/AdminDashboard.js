import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  console.log('AdminDashboard: Rendered, user:', user);

  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [settings, setSettings] = useState({});
  const [error, setError] = useState('');

  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    role: 'student',
    password: '',
  });
  const [classFormData, setClassFormData] = useState({
    name: '',
    teacher: '',
  });
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
  });
  const [settingsFormData, setSettingsFormData] = useState({
    schoolName: '',
    academicYear: '',
  });

  useEffect(() => {
    console.log('AdminDashboard: useEffect triggered');
    fetchUsers();
    fetchClasses();
    fetchSubjects();
    fetchSettings();
  }, []);

  const fetchUsers = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for fetchUsers:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Users fetched:', response.data);
      setUsers(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O wise one, an unforeseen error has clouded the retrieval of users. Seek guidance from the logs.';
      setError(errorMessage);
      console.error('Fetch users error:', err.response?.data || err.message);
    }
  };

  const fetchClasses = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for fetchClasses:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get('http://localhost:8000/api/classes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Classes fetched:', response.data);
      setClasses(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O seeker of knowledge, the classes you seek are lost in the ether. Consult the logs for enlightenment.';
      setError(errorMessage);
      console.error('Fetch classes error:', err.response?.data || err.message);
    }
  };

  const fetchSubjects = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for fetchSubjects:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get('http://localhost:8000/api/subjects/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Subjects fetched:', response.data);
      setSubjects(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O guardian of wisdom, the subjects remain shrouded in mystery. Seek the logs.';
      setError(errorMessage);
      console.error('Fetch subjects error:', err.response?.data || err.message);
    }
  };

  const fetchSettings = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for fetchSettings:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get('http://localhost:8000/api/school-settings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Settings fetched:', response.data);
      setSettings(response.data);
      setSettingsFormData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O wise one, the settings elude us. The logs hold the key to this enigma.';
      setError(errorMessage);
      console.error('Fetch settings error:', err.response?.data || err.message);
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'user') setUserFormData({ ...userFormData, [name]: value });
    if (formType === 'class') setClassFormData({ ...classFormData, [name]: value });
    if (formType === 'subject') setSubjectFormData({ ...subjectFormData, [name]: value });
    if (formType === 'settings') setSettingsFormData({ ...settingsFormData, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for createUser:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.post('http://localhost:8000/api/users/', userFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: User created:', response.data);
      fetchUsers();
      setUserFormData({ username: '', email: '', role: 'student', password: '' });
      alert('A new soul has been welcomed into the academy with ancient wisdom.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O guardian of the realm, the creation falters. Verify your offerings and seek the logs.';
      setError(errorMessage);
      console.error('Create user error:', err.response?.data || err.message);
      alert(errorMessage);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for createClass:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.post('http://localhost:8000/api/classes/', classFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Class created:', response.data);
      fetchClasses();
      setClassFormData({ name: '', teacher: '' });
      alert('A new class has been forged in the crucible of knowledge.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O seeker, the class creation is thwarted. The logs reveal the path.';
      setError(errorMessage);
      console.error('Create class error:', err.response?.data || err.message);
      alert(errorMessage);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for createSubject:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.post('http://localhost:8000/api/subjects/', subjectFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Subject created:', response.data);
      fetchSubjects();
      setSubjectFormData({ name: '', code: '' });
      alert('A new subject has been inscribed in the annals of wisdom.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'O wise one, the subject eludes creation. Consult the logs.';
      setError(errorMessage);
      console.error('Create subject error:', err.response?.data || err.message);
      alert(errorMessage);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Token for updateSettings:', token);
      if (!token) throw new Error('No authentication token found');
      const response = await axios.put('http://localhost:8000/api/school-settings/', settingsFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AdminDashboard: Settings updated:', response.data);
      fetchSettings();
      alert('The settings have been imbued with the wisdom of the ages. May your institution prosper.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'A shadow falls upon the update. The logs hold the answer.';
      setError(errorMessage);
      console.error('Update settings error:', err.response?.data || err.message);
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('O wise administrator, are you certain you wish to remove this user from the realm?')) {
      try {
        setError('');
        const token = localStorage.getItem('token');
        console.log('AdminDashboard: Token for deleteUser:', token);
        if (!token) throw new Error('No authentication token found');
        await axios.delete(`http://localhost:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        alert('The user has been released from this domain with the blessing of wisdom.');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'O guardian, the deletion has faltered. Seek the logs for clarity.';
        setError(errorMessage);
        console.error('Delete user error:', err.response?.data || err.message);
        alert(errorMessage);
      }
    }
  };

  if (!user) {
    console.error('AdminDashboard: No user object from AuthContext');
    return <div className="alert alert-danger m-3">Error: User not authenticated</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Welcome, {user?.username || 'Admin'}!</h3>
          <p>Manage users, classes, subjects, and settings from this dashboard.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger m-3">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Users</h3>
          <form onSubmit={handleCreateUser}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={userFormData.username}
                onChange={(e) => handleInputChange(e, 'user')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={userFormData.email}
                onChange={(e) => handleInputChange(e, 'user')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={userFormData.role}
                onChange={(e) => handleInputChange(e, 'user')}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={userFormData.password}
                onChange={(e) => handleInputChange(e, 'user')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
          {users.length === 0 ? (
            <p className="text-muted mt-3">No users found.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Classes</h3>
          <form onSubmit={handleCreateClass}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Class Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={classFormData.name}
                onChange={(e) => handleInputChange(e, 'class')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="teacher" className="form-label">Teacher</label>
              <input
                type="text"
                className="form-control"
                id="teacher"
                name="teacher"
                value={classFormData.teacher}
                onChange={(e) => handleInputChange(e, 'class')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Class</button>
          </form>
          {classes.length === 0 ? (
            <p className="text-muted mt-3">No classes found.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.name}</td>
                    <td>{cls.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Subjects</h3>
          <form onSubmit={handleCreateSubject}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Subject Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={subjectFormData.name}
                onChange={(e) => handleInputChange(e, 'subject')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="code" className="form-label">Subject Code</label>
              <input
                type="text"
                className="form-control"
                id="code"
                name="code"
                value={subjectFormData.code}
                onChange={(e) => handleInputChange(e, 'subject')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Subject</button>
          </form>
          {subjects.length === 0 ? (
            <p className="text-muted mt-3">No subjects found.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>{subject.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage School Settings</h3>
          <form onSubmit={handleUpdateSettings}>
            <div className="mb-3">
              <label htmlFor="schoolName" className="form-label">School Name</label>
              <input
                type="text"
                className="form-control"
                id="schoolName"
                name="schoolName"
                value={settingsFormData.schoolName}
                onChange={(e) => handleInputChange(e, 'settings')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="academicYear" className="form-label">Academic Year</label>
              <input
                type="text"
                className="form-control"
                id="academicYear"
                name="academicYear"
                value={settingsFormData.academicYear}
                onChange={(e) => handleInputChange(e, 'settings')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Settings</button>
          </form>
          {Object.keys(settings).length === 0 ? (
            <p className="text-muted mt-3">No settings found.</p>
          ) : (
            <div className="mt-3">
              <p><strong>School Name:</strong> {settings.schoolName}</p>
              <p><strong>Academic Year:</strong> {settings.academicYear}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
