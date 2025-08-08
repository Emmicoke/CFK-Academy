import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Exams from './components/Exams';
import TestsPage from './components/TestsPage';
import ProfilePage from './components/ProfilePage';
import StatisticPage from "./components/StatisticPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mevcut kullanıcıyı kontrol et
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" 
           style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
           }}>
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 floating-animation" 
                 style={{width: '100px', height: '100px'}}>
              <i className="bi bi-lightning-charge text-primary display-3"></i>
            </div>
          </div>
          <div className="spinner-border text-white mb-3" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <h3 className="fw-bold mb-2 text-white">CFK Academy</h3>
          <p className="text-white-50 mb-0">Yapay zeka destekli öğrenme platformu yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <main style={{paddingTop: '80px'}}>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route 
              path="/chat" 
              element={user ? <Chat user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/exams" 
              element={user ? <Exams user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="/tests" element={user ? <TestsPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/statistics" element={user ? <StatisticPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
