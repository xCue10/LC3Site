import { useState } from 'react';

interface SparkNotesProps {
  onClose: () => void;
}

export default function SparkNotes({ onClose }: SparkNotesProps) {
  const [tab, setTab] = useState<'summary'|'characters'|'themes'|'quotes'|'quiz'>('summary');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const TABS = ['summary','characters','themes','quotes','quiz'] as const;
  const QUIZ = [
    { q: 'How long do Romeo & Juliet know each other before marrying?', opts: ['One year','Three months','About 24 hours','Two weeks'], correct: 'About 24 hours' },
    { q: '"Wherefore art thou Romeo" — what does "wherefore" mean?', opts: ['Where','Who','How','Why'], correct: 'Why' },
    { q: 'Whose idea was the fake-death potion plan?', opts: ['Romeo','Juliet','The Nurse','Friar Lawrence'], correct: 'Friar Lawrence' },
    { q: 'Who kills Mercutio?', opts: ['Romeo','Paris','Capulet','Tybalt'], correct: 'Tybalt' },
    { q: 'When is your essay due?', opts: ['Next week','I already did it','What essay','Tomorrow'], correct: 'Tomorrow' },
  ];

  return (
    <div className="sn-wrap">
      <div className="rd-alert-titlebar sn-titlebar">
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span className="sn-logo-bolt">⚡</span>
          <span className="rd-alert-title" style={{ color:'#fff' }}>SparkNotes — Romeo and Juliet</span>
        </div>
        <div className="aim-winbtns">
          <button className="aim-wbtn aim-wbtn-min">_</button>
          <button className="aim-wbtn">□</button>
          <button className="aim-wbtn aim-wbtn-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="sn-header">
        <div className="sn-brand">⚡ <strong>SparkNotes</strong> <span className="sn-tagline">Today&apos;s Most Popular Study Guides</span></div>
        <div className="sn-book-title">Romeo and Juliet — by William Shakespeare</div>
      </div>

      <div className="sn-tabs">
        {TABS.map(t => (
          <button key={t} className={`sn-tab${tab === t ? ' sn-tab-active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="sn-body">
        {tab === 'summary' && (
          <div className="sn-content">
            <p className="sn-section-title">Plot Overview</p>
            <p>Romeo and Juliet is a play about two teenagers who meet at a party, fall in love, get secretly married, and are both dead within <strong>five days</strong>.</p>
            <p className="sn-act"><strong>Act 1:</strong> Romeo sees Juliet, immediately forgets Rosaline, and they kiss within 5 minutes. Juliet is 13. Romeo is 16.</p>
            <p className="sn-act"><strong>Act 5:</strong> Romeo hears Juliet is dead. Drinks poison. Juliet wakes up. Sees Romeo dead. Stabs herself. Six people are dead. Great lesson everyone.</p>
          </div>
        )}

        {tab === 'quiz' && (
          <div className="sn-content">
            <p className="sn-section-title">Quick Quiz</p>
            {QUIZ.map((q, qi) => (
              <div key={qi} className="sn-quiz-q">
                <p className="sn-quiz-qtext"><strong>{qi + 1}.</strong> {q.q}</p>
                <div className="sn-quiz-opts">
                  {q.opts.map(opt => (
                    <button 
                      key={opt} 
                      className={`sn-quiz-opt ${quizAnswers[qi] === opt ? (opt === q.correct ? 'sn-quiz-correct' : 'sn-quiz-wrong') : ''}`}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [qi]: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
