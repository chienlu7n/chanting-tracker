"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const TEAM_MEMBERS = [
  "紹瑋", "乙惠", "騰崴", "綺恩", "旻亮", 
  "小丸子", "宏睿", "姵螢", "齡萱", "羽柔", 
  "靚婕", "睿哲", "守仁", "紜榕"
];

export default function ChantingTracker() {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'working' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const fetchRecent = async () => {
    const { data } = await supabase.from('records').select('*').order('id', { ascending: false }).limit(5);
    setRecentRecords(data || []);
  };

  useEffect(() => { fetchRecent(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { setMessage("請選擇姓名！"); setStatus('error'); return; }
    setStatus('working');
    const { error } = await supabase.from('records').insert([{ 
      user_name: name, duration: parseInt(duration), chanting_date: date 
    }]);
    if (error) { setStatus('error'); setMessage(`故障: ${error.message}`); }
    else { setStatus('success'); setMessage(`🎉 ${name} 剛剛唱題 ${duration} 分鐘！`); setName(''); setDuration(''); fetchRecent(); }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div style={{ fontFamily: "'Huninn', sans-serif", backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("/背景.png")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', padding: '40px 20px', color: '#4a4a4a' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'rgba(253, 251, 247, 0.9)', borderRadius: '30px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '6px solid #a3d977' }}>
        <h1 style={{ textAlign: 'center', color: '#5e9438', fontSize: '32px', fontWeight: 'bold', marginBottom: '25px' }}>🌸皮克敏の唱題日記🌿</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>日期:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '3px solid #a3d977', backgroundColor: '#f9fff5', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>選擇探險隊員:</label>
            <select value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '3px solid #a3d977', backgroundColor: '#f9fff5', boxSizing: 'border-box' }}>
              <option value="">-- 請選擇名字 --</option>
              {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '25px', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>時間 (分鐘):</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '3px solid #a3d977', backgroundColor: '#f9fff5', boxSizing: 'border-box' }} />
          </div>
          
          <button type="submit" disabled={status === 'working'} style={{ width: '100%', padding: '18px', backgroundColor: '#669933', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', transform: status === 'working' ? 'scale(1)' : 'scale(1.03)', boxSizing: 'border-box' }}>
            {status === 'working' ? '🍃 搬運中...' : '📣 紀錄日記！'}
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '2px dashed #a3d977', paddingTop: '20px' }}>
          <h4 style={{ color: '#5e9438' }}>🕒 最新 5 筆紀錄:</h4>
          {recentRecords.map((r, index) => (
            <div key={r.id} style={{ fontSize: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ['#ff4d4d', '#ffdb4d', '#4d94ff', '#9b59b6', '#bdc3c7'][index % 5], marginRight: '10px' }}></span>
              {r.user_name} 唱題 {r.duration} 分鐘
            </div>
          ))}
        </div>

        <button onClick={() => router.push('/stats')} style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#ffd54f', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          📊 查看團隊目標
        </button>
        
        {status !== 'idle' && (<div style={{ marginTop: '25px', padding: '15px', borderRadius: '15px', backgroundColor: status === 'success' ? '#e8f5e9' : '#ffebee', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>)}
      </div>
    </div>
  );
}