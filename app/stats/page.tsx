"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // 修正後的引用

export default function StatsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getStats() {
      const { data } = await supabase.from('records').select('*');
      setRecords(data || []);
    }
    getStats();
  }, []);

  const totalMinutes = records.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const totalHours = totalMinutes / 60;
  const goal = 70;
  const progress = Math.min((totalHours / goal) * 100, 100);
  
  const personalTotals = records.reduce((acc: any, curr: any) => {
    acc[curr.user_name] = (acc[curr.user_name] || 0) + Number(curr.duration);
    return acc;
  }, {});

  const downloadCSV = () => {
    const csvContent = ["ID,姓名,分鐘,日期", ...records.map(r => `${r.id},${r.user_name},${r.duration},${r.chanting_date}`)].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "唱題統計表.csv"; link.click();
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"rounded-mplus-1c", sans-serif', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("/背景.png")', backgroundSize: 'cover', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(253, 251, 247, 0.9)', padding: '40px', borderRadius: '40px', border: '5px solid #a3d977' }}>
        <h1 style={{ color: '#5e9438' }}>🏆 團隊總目標 (70小時)</h1>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#5e9438' }}>{totalHours.toFixed(1)} / 70 小時</div>
        
        <div style={{ width: '100%', height: '30px', backgroundColor: '#eee', margin: '60px auto 20px', borderRadius: '15px', position: 'relative', border: '2px solid #a3d977', overflow: 'visible' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#a3d977', transition: 'width 2s ease-out', borderRadius: '13px' }}></div>
          <img 
            src="/pikmin-pikmin-4.gif" 
            alt="Running Pikmin" 
            style={{ 
              position: 'absolute', left: `${progress}%`, top: '-25px', marginLeft: '-20px', width: '40px',
              transform: 'scaleX(-1)', 
              filter: 'brightness(2.2) contrast(1.2) drop-shadow(0 0 12px rgba(255,255,255,1))', 
              transition: 'left 2s ease-out', zIndex: 999 
            }} 
          />
        </div>

        <div style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold', color: progress >= 100 ? '#e67e22' : '#5e9438' }}>
          {progress >= 100 ? "🎉 目標達成！皮克敏們為你歡呼！" : `距離目標還有 ${(goal - totalHours).toFixed(1)} 小時，加油！`}
        </div>

        <div style={{ marginTop: '30px', textAlign: 'left', backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
          <h3 style={{ color: '#5e9438' }}>👤 個人成就結算:</h3>
          {Object.entries(personalTotals).map(([name, mins]: any) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', color: '#5e9438', padding: '5px 0' }}>
              <span>{name}</span><span>{(mins / 60).toFixed(1)} 小時</span>
            </div>
          ))}
        </div>
        
        <button onClick={downloadCSV} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '50px', border: '2px solid #5e9438', backgroundColor: 'transparent', color: '#5e9438', cursor: 'pointer', fontWeight: 'bold' }}>📥 下載統計報表</button>
        <button onClick={() => router.push('/')} style={{ display: 'block', width: '100%', marginTop: '20px', padding: '15px', borderRadius: '50px', backgroundColor: '#5e9438', color: '#fff', cursor: 'pointer' }}>回到日記本</button>
      </div>
    </div>
  );
}