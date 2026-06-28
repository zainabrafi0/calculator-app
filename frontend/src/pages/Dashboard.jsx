import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  
  // Digital Calculator State
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');

  // History & Pagination State
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/calculations', {
        params: { page, limit: 5, search, sort }
      });
      const safeHistory = Array.isArray(data) ? data : (data.history || []);
      setHistory(safeHistory);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  useEffect(() => { fetchHistory(); }, [page, search, sort]);

  // Handle calculator button presses
  const handlePress = (val) => {
    setError('');
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setError('');
  };

  const handleDeleteChar = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = async () => {
    if (!expression) return;
    try {
      const { data } = await api.post('/calculations', { expression });
      setExpression(String(data.result)); // Show result in display
      setError('');
      setPage(1);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Expression');
    }
  };

  const handleDeleteRecord = async (id) => {
    await api.delete(`/calculations/${id}`);
    fetchHistory();
  };

  const handleClearHistory = async () => {
    await api.delete('/calculations');
    setPage(1);
    fetchHistory();
  };

  const calcButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '+', 
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 p-6 md:p-12 font-sans text-gray-800">
      
      {/* Top Navbar */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-white/60 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-black tracking-wider text-xl text-gray-900">AGENCY</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">Welcome, <strong className="text-pink-500">{user?.name}</strong></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/profile" className="text-sm font-bold text-gray-700 hover:text-pink-500 transition-colors">Profile</Link>
          <button onClick={logout} className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-200">
            Logout
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
        
        {/* Digital Calculator Card */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(236,72,153,0.1)] border border-white/80">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 tracking-tight">Digital Calculator</h2>
          
          {/* Display Screen */}
          <div className="bg-pink-50/60 border border-pink-100 p-6 rounded-2xl mb-6 text-right flex flex-col justify-end h-28 shadow-inner">
            <span className="text-xs text-pink-400 font-medium tracking-widest uppercase mb-1">Expression</span>
            <div className="text-3xl font-black text-gray-900 overflow-x-auto tracking-tight">
              {expression || '0'}
            </div>
            {error && <span className="text-xs text-red-500 font-bold mt-1">{error}</span>}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-3">
            <button onClick={handleClear} className="col-span-2 bg-pink-100 hover:bg-pink-200 text-pink-600 font-extrabold py-4 rounded-2xl transition-all active:scale-95">C</button>
            <button onClick={handleDeleteChar} className="col-span-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-extrabold py-4 rounded-2xl transition-all active:scale-95">DEL</button>
            
            {calcButtons.map((btn) => (
              <button 
                key={btn} 
                onClick={() => handlePress(btn)}
                className={`py-4 rounded-2xl font-bold text-lg shadow-sm transition-all active:scale-95 ${
                  ['/', '*', '-', '+'].includes(btn) 
                    ? 'bg-pink-500 text-white shadow-pink-500/20 hover:bg-pink-600' 
                    : 'bg-white hover:bg-pink-50 text-gray-800 border border-pink-100/60'
                }`}
              >
                {btn}
              </button>
            ))}

            <button onClick={handleCalculate} className="col-span-4 bg-gray-900 hover:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-xl tracking-widest text-lg transition-all active:scale-[0.99] mt-2">
              = CALCULATE
            </button>
          </div>
        </div>

        {/* Calculation History Card */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(236,72,153,0.1)] border border-white/80 flex flex-col h-[38rem]">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">History</h2>
            <button onClick={handleClearHistory} className="text-xs font-bold text-pink-500 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors">
              Clear All
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Search history..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              className="w-full bg-pink-50/50 border border-pink-100 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
            />
            <select 
              value={sort} 
              onChange={(e) => { setSort(e.target.value); setPage(1); }} 
              className="bg-pink-50/50 border border-pink-100 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          {/* History List */}
          <ul className="space-y-3 overflow-y-auto flex-1 pr-1">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <span>No calculations recorded yet</span>
              </div>
            ) : (
              history.map((item) => (
                <li key={item._id} className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-pink-100/50 hover:border-pink-200 transition-all shadow-sm">
                  <span className="font-medium text-gray-600 font-mono text-sm">
                    {item.expression} = <strong className="text-gray-900 font-sans font-black text-base">{item.result}</strong>
                  </span>
                  <button onClick={() => handleDeleteRecord(item._id)} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-pink-100/60">
            <button 
              disabled={page === 1} 
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold rounded-xl text-xs disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-gray-400">Page {page} of {totalPages === 0 ? 1 : totalPages}</span>
            <button 
              disabled={page === totalPages || totalPages === 0} 
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold rounded-xl text-xs disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}