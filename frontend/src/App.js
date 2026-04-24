import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AddCourse from './pages/AddCourse';
import ShowMapping from './pages/ShowMapping';
import MappingPopup from './components/MappingPopup';
import { C, FSANS } from './styles';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'add', label: 'Add Course' },
  { id: 'view', label: 'Show Mapping' },
];

function normalizeCourseOutcomes(data) {
  const rawOutcomes = data?.courseOutcomesList || data?.cos || [];
  const seen = new Set();

  return rawOutcomes
    .map(item => {
      if (typeof item === 'string') {
        return { CO: item, keywords: [] };
      }

      return {
        ...item,
        CO: item?.CO || '',
        keywords: Array.isArray(item?.keywords) ? item.keywords : [],
      };
    })
    .filter(item => item.CO.trim())
    .filter(item => {
      const key = item.CO.trim().toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [cos, setCos] = useState(['', '']);
  const [tableData, setTableData] = useState(null);
  const [fetchCode, setFetchCode] = useState('');
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(0);

  const addCO = () => setCos(prev => [...prev, '']);

  const updateCO = (value, index) => {
    const next = [...cos];
    next[index] = value;
    setCos(next);
  };

  const saveCourse = async () => {
    const filteredCos = cos.map(co => co.trim()).filter(Boolean);

    if (!courseCode.trim() || !courseName.trim() || filteredCos.length === 0) {
      alert('Fill in course code, course name, and at least one CO.');
      return;
    }

    try {
      setLoading(true);

      await fetch('http://localhost:8081/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseCode: courseCode.trim(), courseName: courseName.trim() }),
      });

      await fetch('http://localhost:8081/add-cos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: courseCode.trim(), cos: filteredCos }),
      });

      setSaved(prev => prev + 1);
      setCourseCode('');
      setCourseName('');
      setCos(['', '']);
      alert('Saved successfully!');
    } catch {
      alert('Save failed. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async () => {
    if (!fetchCode.trim()) {
      alert('Enter a course code first.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8081/course?courseCode=${encodeURIComponent(fetchCode.trim())}`);
      const data = await res.json();

      setTableData({
        ...data,
        courseOutcomesList: normalizeCourseOutcomes(data),
      });
      setPage('view');
    } catch {
      alert('Fetch failed. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: FSANS }}>
      <div
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: 52,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>
          <span style={{ color: C.blueLt }}>CO</span>
          <span style={{ color: C.textDim }}>–</span>
          <span style={{ color: C.indigo }}>PO</span>
          <span style={{ color: C.textDim, fontWeight: 400, fontSize: 11, marginLeft: 8 }}>Mapper</span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                background: page === item.id ? 'rgba(240,180,41,0.18)' : 'transparent',
                border: page === item.id ? '1px solid rgba(212,160,23,0.45)' : '1px solid transparent',
                color: page === item.id ? C.blueLt : C.textSec,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(255,244,208,0.98), rgba(255,236,181,0.95))',
          borderBottom: `1px solid ${C.border}`,
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>
            <span style={{ color: C.blue }}>CO–PO</span> Mapping System
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>
            Keyword-based correlation · Score = Σ(aᵢ/bᵢ) × 3 · PO1–PO12 matrix
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['12', 'POs', C.indigo],
            [cos.filter(Boolean).length, 'COs', C.teal],
            [saved, 'Saved', C.blueLt],
          ].map(([value, label, color]) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,250,232,0.92)',
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '7px 14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.textDim }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', minHeight: 'calc(100vh - 104px)' }}>
        <div style={{ background: C.surface, borderRight: `1px solid ${C.border}`, padding: '1.1rem .875rem' }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                background: page === item.id ? 'rgba(240,180,41,0.18)' : 'transparent',
                padding: '8px 10px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
                color: page === item.id ? C.blueLt : C.textSec,
                marginBottom: 6,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div>
          {page === 'dashboard' && <Dashboard setPage={setPage} />}

          {page === 'add' && (
            <AddCourse
              courseCode={courseCode}
              setCourseCode={setCourseCode}
              courseName={courseName}
              setCourseName={setCourseName}
              cos={cos}
              updateCO={updateCO}
              addCO={addCO}
              saveCourse={saveCourse}
              loading={loading}
            />
          )}

          {page === 'view' && (
            <ShowMapping
              tableData={tableData}
              fetchCode={fetchCode}
              setFetchCode={setFetchCode}
              fetchCourse={fetchCourse}
              loading={loading}
              onOpenPopup={setPopup}
            />
          )}
        </div>
      </div>

      <MappingPopup popup={popup} onClose={() => setPopup(null)} />
    </div>
  );
}
