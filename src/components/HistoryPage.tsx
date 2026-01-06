import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquare } from 'lucide-react';
import BottomNav from './BottomNav';
import './HistoryPage.css';

interface Conversation {
  id: string;
  emotion: string;
  preview: string;
  createdAt: any;
  messages: Array<{ role: string; content: string }>;
}

const HistoryPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const emotionEmojis: { [key: string]: string } = {
    '기쁨': '😊',
    '슬픔': '😢',
    '우울': '😔',
    '분노': '😠',
    '외로움': '😞',
    '평온': '😌',
    '일반': '💬',
  };

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Firestore에서 대화 목록 불러오기
  useEffect(() => {
    if (!userId) return;

    const conversationsRef = collection(db, 'conversations', userId, 'chats');
    const q = query(conversationsRef, orderBy('createdAt', 'desc'));

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

  // 날짜 포맷팅
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 대화 클릭 (나중에 상세 페이지로 이동)
  const handleConversationClick = (conversation: Conversation) => {
    console.log('대화 클릭:', conversation);
    // TODO: 상세 페이지로 이동
  };

  return (
    <div className="history-container">
      {/* 헤더 */}
      <header className="history-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="history-main">
        <h2 className="history-page-title">대화 히스토리</h2>

        {loading ? (
          <div className="loading-container">
            <p>대화를 불러오는 중...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="empty-container">
            <MessageSquare size={48} />
            <p className="empty-text">아직 대화가 없어요</p>
            <p className="empty-subtext">홈에서 프리지아와 대화를 시작해보세요 💛</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="conversation-card"
                onClick={() => handleConversationClick(conversation)}
              >
                {/* 날짜 */}
                <div className="card-date">
                  {formatDate(conversation.createdAt)}
                </div>

                {/* 내용 */}
                <div className="card-content">
                  <div className="card-header">
                    <span className="card-emoji">
                      {emotionEmojis[conversation.emotion] || '💬'}
                    </span>
                    <span className="card-emotion">{conversation.emotion}</span>
                  </div>
                  
                  <p className="card-preview">
                    {conversation.preview || '대화 내용이 없습니다'}
                  </p>

                  <div className="card-meta">
                    <span className="card-message-count">
                      💬 {conversation.messages?.length || 0}개 메시지
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default HistoryPage;


