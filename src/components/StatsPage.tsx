import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Lightbulb } from 'lucide-react';
import BottomNav from './BottomNav';
import './StatsPage.css';

interface Conversation {
  id: string;
  emotion: string;
  createdAt: any;
  messages: Array<{ role: string; content: string }>;
}

const StatsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const emotionColors: { [key: string]: string } = {
    '기쁨': '#FFD93D',
    '슬픔': '#94C9FF',
    '우울': '#B4A7D6',
    '분노': '#FFB4B4',
    '외로움': '#C7B8EA',
    '평온': '#B8E6D5',
    '일반': '#E0E0E0',
  };

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore에서 대화 목록 불러오기
  useEffect(() => {
    if (!userId) return;

    const conversationsRef = collection(db, 'conversations', userId, 'chats');
    const q = query(conversationsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsList: Conversation[] = [];
      snapshot.forEach((doc) => {
        conversationsList.push({
          id: doc.id,
          ...doc.data(),
        } as Conversation);
      });
      setConversations(conversationsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // 통계 계산
  const getTotalConversations = () => conversations.length;

  const getThisWeekConversations = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return conversations.filter(conv => {
      if (!conv.createdAt) return false;
      const date = conv.createdAt.toDate();
      return date >= weekAgo;
    }).length;
  };

  const getEmotionDistribution = () => {
    const emotionCounts: { [key: string]: number } = {};
    
    conversations.forEach(conv => {
      const emotion = conv.emotion || '일반';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    return Object.entries(emotionCounts).map(([name, value]) => ({
      name,
      value,
      color: emotionColors[name] || '#E0E0E0'
    }));
  };

  const getMostFrequentEmotion = () => {
    const distribution = getEmotionDistribution();
    if (distribution.length === 0) return '일반';
    
    return distribution.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    ).name;
  };

  const getAIInsights = () => {
    const total = getTotalConversations();
    const thisWeek = getThisWeekConversations();
    const mostEmotion = getMostFrequentEmotion();

    const insights = [];

    if (total === 0) {
      insights.push('아직 대화가 없어요. 프리지아와 대화를 시작해보세요!');
    } else {
      if (thisWeek > 5) {
        insights.push('이번 주에 감정을 자주 표현하셨네요. 자신의 마음을 들여다보는 시간을 갖고 계시는군요! 💛');
      } else if (thisWeek === 0) {
        insights.push('이번 주는 대화가 없었어요. 언제든 편하게 찾아와주세요.');
      }

      if (mostEmotion !== '일반') {
        insights.push(`최근 "${mostEmotion}" 감정을 많이 느끼셨어요. 이런 감정을 인정하는 것이 중요해요.`);
      }

      insights.push('꾸준히 감정을 기록하면 자신을 더 잘 이해할 수 있어요.');
    }

    return insights;
  };

  const emotionData = getEmotionDistribution();
  const insights = getAIInsights();

  return (
    <div className="stats-container">
      {/* 헤더 */}
      <header className="stats-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="stats-main">
        <h2 className="stats-page-title">대화 통계</h2>

        {loading ? (
          <div className="loading-container">
            <p>통계를 불러오는 중...</p>
          </div>
        ) : (
          <div className="stats-content">
            {/* 대화 현황 */}
            <section className="stats-section">
              <h3 className="section-title">대화 현황</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <MessageSquare className="stat-icon" />
                  <p className="stat-value">{getTotalConversations()}</p>
                  <p className="stat-label">총 대화</p>
                </div>
                <div className="stat-card">
                  <TrendingUp className="stat-icon" />
                  <p className="stat-value">{getThisWeekConversations()}</p>
                  <p className="stat-label">이번 주</p>
                </div>
              </div>
            </section>

            {/* 감정 분포 */}
            <section className="stats-section">
              <h3 className="section-title">감정 분포</h3>
              <div className="chart-container">
                {emotionData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={emotionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {emotionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="emotion-legend">
                      {emotionData.map((item) => (
                        <div key={item.name} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="legend-text">
                            {item.name} ({item.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-chart">
                    <p>아직 데이터가 없어요</p>
                  </div>
                )}
              </div>
            </section>

            {/* 감정 추이 그래프 */}
            <section className="stats-section">
              <h3 className="section-title">감정 추이 그래프</h3>
              <div className="graph-placeholder">
                <p className="placeholder-text">최근 7일 감정 추이</p>
                <p className="placeholder-subtext">곧 제공될 예정이에요</p>
              </div>
            </section>

            {/* AI 인사이트 */}
            <section className="stats-section">
              <h3 className="section-title">AI 인사이트</h3>
              <div className="insights-container">
                {insights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <Lightbulb className="insight-icon" />
                    <p className="insight-text">{insight}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default StatsPage;
