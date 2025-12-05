import React from 'react';

export default function HabitCard({ habit, onCheckin }) {
  // normalize color fallbacks
  const bg = habit.color || '#FFD570';
  const textColor = '#071133';

  // check if already checked in today
  const hasCheckedToday = (habit.checkins || []).some(c => {
    try {
      const d = new Date(c.date);
      const t = new Date();
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    } catch { return false; }
  });

  return (
    <div className="habit-card" style={{ backgroundColor: bg }}>
      <div className="habit-top">
        <strong style={{ color: textColor }}>{habit.title}</strong>
        <div className="muted small">Best {habit.bestStreak}</div>
      </div>

      <div className="muted small">{habit.description}</div>

      <div className="habit-bottom">
        <div style={{ fontWeight: 700 }}>{habit.streak} 🔥</div>
        <button className="btn-outline" onClick={onCheckin} disabled={hasCheckedToday}>
          {hasCheckedToday ? 'Checked' : '+ Check-in'}
        </button>
      </div>
    </div>
  );
}
