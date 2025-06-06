import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'chart.js/auto';
import {
  Tabs, Tab, Card, Button, Form, Table, Spinner, Modal,
} from 'react-bootstrap';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', data: {} });

  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [homework, setHomework] = useState([]);
  const [libraryItems, setLibraryItems] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [leaveApps, setLeaveApps] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  const [parentFeedback, setParentFeedback] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({});

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const tabDataMap = useMemo(() => ({
    users: { data: users, setter: setUsers },
    classes: { data: classes, setter: setClasses },
    subjects: { data: subjects, setter: setSubjects },
    exams: { data: exams, setter: setExams },
    grades: { data: grades, setter: setGrades },
    attendance: { data: attendance, setter: setAttendance },
    fees: { data: fees, setter: setFees },
    announcements: { data: announcements, setter: setAnnouncements },
    messages: { data: messages, setter: setMessages },
    timetables: { data: timetables, setter: setTimetables },
    homework: { data: homework, setter: setHomework },
    libraryItems: { data: libraryItems, setter: setLibraryItems },
    borrowings: { data: borrowings, setter: setBorrowings },
    leaveApps: { data: leaveApps, setter: setLeaveApps },
    reportCards: { data: reportCards, setter: setReportCards },
    parentFeedback: { data: parentFeedback, setter: setParentFeedback },
    auditLogs: { data: auditLogs, setter: setAuditLogs },
    settings: { data: settings, setter: setSettings },
  }), [users, classes, subjects, exams, grades, attendance, fees, announcements, messages, timetables, homework, libraryItems, borrowings, leaveApps, reportCards, parentFeedback, auditLogs, settings]);

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get(`http://localhost:8000/api/${endpoint}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setter(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || errorMsg;
      setError(errorMessage);
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData('users', setUsers, 'Failed to fetch users.');
    fetchData('classes', setClasses, 'Failed to fetch classes.');
    fetchData('subjects', setSubjects, 'Failed to fetch subjects.');
    fetchData('exams', setExams, 'Failed to fetch exams.');
    fetchData('grades', setGrades, 'Failed to fetch grades.');
    fetchData('attendance', setAttendance, 'Failed to fetch attendance.');
    fetchData('fees', setFees, 'Failed to fetch fees.');
    fetchData('announcements', setAnnouncements, 'Failed to fetch announcements.');
    fetchData('messages', setMessages, 'Failed to fetch messages.');
    fetchData('timetables', setTimetables, 'Failed to fetch timetables.');
    fetchData('homework', setHomework, 'Failed to fetch homework.');
    fetchData('library-items', setLibraryItems, 'Failed to fetch library items.');
    fetchData('library-borrowings', setBorrowings, 'Failed to fetch borrowings.');
    fetchData('leave-applications', setLeaveApps, 'Failed to fetch leave applications.');
    fetchData('report-cards', setReportCards, 'Failed to fetch report cards.');
    fetchData('parent-feedback', setParentFeedback, 'Failed to fetch parent feedback.');
    fetchData('audit-logs', setAuditLogs, 'Failed to fetch audit logs.');
    fetchData('school-settings', setSettings, 'Failed to fetch settings.');
  }, [fetchData]);

  useEffect(() => {
    const handler = debounce((query) => setDebouncedSearch(query), 500);
    handler(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch && activeTab !== 'analytics') {
      const { setter } = tabDataMap[activeTab];
      fetchData(`${activeTab}?search=${debouncedSearch}`, setter, `Failed to search ${activeTab}.`);
    }
  }, [debouncedSearch, activeTab, fetchData, tabDataMap]);

  useEffect(() => {
    if (activeTab === 'analytics' && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: classes.map(c => c.name),
          datasets: [{
            label: 'Students per Class',
            data: classes.map(c => c.students?.length || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: { scales: { y: { beginAtZero: true } } },
      });
    }
    return () => chartInstance.current?.destroy();
  }, [activeTab, classes]);

  const handleCreate = async (data, endpoint, successMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      await axios.post(`http://localhost:8000/api/${endpoint}/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { setter } = tabDataMap[endpoint];
      fetchData(endpoint, setter, `Failed to refresh ${endpoint}.`);
      showToast(successMsg, 'success');
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || `Failed to create ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data, endpoint, successMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      await axios.put(`http://localhost:8000/api/${endpoint}/${data.id}/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { setter } = tabDataMap[endpoint];
      fetchData(endpoint, setter, `Failed to refresh ${endpoint}.`);
      showToast(successMsg, 'success');
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || `Failed to update ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, endpoint, successMsg) => {
    if (window.confirm(`Are you sure you want to delete this ${endpoint.slice(0, -1)}?`)) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        await axios.delete(`http://localhost:8000/api/${endpoint}/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { setter } = tabDataMap[endpoint];
        fetchData(endpoint, setter, `Failed to refresh ${endpoint}.`);
        showToast(successMsg, 'success');
      } catch (err) {
        showToast(err.response?.data?.message || err.message || `Failed to delete ${endpoint}.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSettingsUpdate = async (data, successMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      await axios.put(`http://localhost:8000/api/school-settings/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData('school-settings', setSettings, 'Failed to refresh settings.');
      showToast(successMsg, 'success');
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    const { data } = tabDataMap[activeTab]; // Removed unused 'setter'
    const formData = {
      users: { username: '', email: '', role: 'student', password: '' },
      classes: { name: '', teacher: '' },
      subjects: { name: '', code: '' },
      exams: { name: '', term: '', year: '', maxMarks: 100 },
      grades: { student: '', subject: '', exam: '', marks: 0, remarks: '' },
      attendance: { student: '', classInstance: '', date: '', present: false, remarks: '' },
      fees: { student: '', amount: 0, balance: 0, date: '', paymentMethod: '' },
      announcements: { title: '', content: '', targetRoles: '' },
      messages: { receiver: '', content: '' },
      timetables: { classInstance: '', subject: '', day: '', startTime: '', endTime: '', room: '' },
      homework: { classInstance: '', subject: '', description: '', dueDate: '', completed: false },
      libraryItems: { title: '', itemType: '', isbn: '', status: 'available' },
      borrowings: { libraryItem: '', student: '', borrowDate: '', returnDate: '', returned: false },
      leaveApps: { user: '', startDate: '', endDate: '', reason: '', status: 'pending' },
      reportCards: { student: '', term: '', year: '', overallGrade: '', remarks: '' },
      parentFeedback: { parent: '', content: '' },
      auditLogs: { user: '', action: '', modelName: '', objectId: '', details: '' },
      settings: { schoolName: '', academicYear: '', motto: '', currentTerm: '', logo: '' },
    }[activeTab];

    if (activeTab === 'analytics') {
      return (
        <div className="p-3">
          <h3>School Analytics</h3>
          <canvas ref={chartRef} style={{ maxHeight: '300px' }} />
        </div>
      );
    }

    if (activeTab === 'settings' && !data) {
      return <p>No settings available.</p>;
    }

    const isArrayData = Array.isArray(data);
    const displayData = isArrayData ? data : [data];

    return (
      <div className="p-3">
        {activeTab !== 'settings' && activeTab !== 'analytics' && (
          <Button
            variant="primary"
            onClick={() => {
              setModalData({ type: 'create', data: { ...formData } });
              setShowModal(true);
            }}
            className="mb-3"
          >
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </Button>
        )}
        {activeTab === 'settings' && (
          <Button
            variant="primary"
            onClick={() => {
              setModalData({ type: 'edit', data: { ...data } });
              setShowModal(true);
            }}
            className="mb-3"
          >
            Edit Settings
          </Button>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalData.type === 'create' ? 'Create' : 'Edit'}{' '}
              {activeTab === 'settings' ? 'Settings' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (activeTab === 'settings') {
                  handleSettingsUpdate(modalData.data, 'Settings updated successfully.');
                } else if (modalData.type === 'create') {
                  handleCreate(modalData.data, activeTab, 'Created successfully.');
                } else {
                  handleUpdate(modalData.data, activeTab, 'Updated successfully.');
                }
              }}
            >
              {Object.keys(formData).map((key) => (
                <Form.Group key={key} className="mb-3">
                  <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                  <Form.Control
                    type={
                      key.includes('password')
                        ? 'password'
                        : key.includes('date')
                        ? 'date'
                        : key.includes('present') || key.includes('completed') || key.includes('returned')
                        ? 'checkbox'
                        : 'text'
                    }
                    value={modalData.data[key] || ''}
                    checked={modalData.data[key] || false}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        data: {
                          ...modalData.data,
                          [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              ))}
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : modalData.type === 'create' ? (
                  'Create'
                ) : (
                  'Save'
                )}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                {Object.keys(displayData[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                {isArrayData && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr key={item.id || Math.random()}>
                  {Object.values(item).map((val, i) => (
                    <td key={i}>{String(val)}</td>
                  ))}
                  {isArrayData && (
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setModalData({ type: 'edit', data: item });
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>{' '}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(item.id, activeTab, 'Deleted successfully.')
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <ToastContainer />
      <Card className="shadow mb-4">
        <Card.Body>
          <h2 className="mb-3">Admin Dashboard - Welcome, {user?.username || 'Admin'}!</h2>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                const { setter } = tabDataMap[activeTab];
                fetchData(activeTab, setter, 'Failed to refresh.');
              }}
            >
              Refresh
            </Button>
          </div>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="users" title="Users">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="classes" title="Classes">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="subjects" title="Subjects">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="exams" title="Exams">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="grades" title="Grades">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="attendance" title="Attendance">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="fees" title="Fees">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="announcements" title="Announcements">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="messages" title="Messages">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="timetables" title="Timetables">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="homework" title="Homework">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="libraryItems" title="Library Items">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="borrowings" title="Borrowings">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="leaveApps" title="Leave Applications">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="reportCards" title="Report Cards">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="parentFeedback" title="Parent Feedback">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="auditLogs" title="Audit Logs">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="settings" title="Settings">
              {renderTabContent()}
            </Tab>
            <Tab eventKey="analytics" title="Analytics">
              {renderTabContent()}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminDashboard;
