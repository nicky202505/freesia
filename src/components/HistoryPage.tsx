import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import BottomNav from './BottomNav';
import './HomePage.css';

const GUEST_CHAT_LIMIT = 10;
const GUEST_COUNT_KEY = 'freesia_guest_count';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 비회원 여부: location state 또는 userId가 없는 경우
  const [isGuest, setIsGuest] = useState<boolean>(
    (location.state as any)?.isGuest === true
  );
  const [guestCount, setGuestCount] = useState<number>(() => {
    return parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
  });
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emotions = [
    { name: '기쁨', emoji: '😊', color: '#FFD93D' },
    { name: '슬픔', emoji: '😢', color: '#94C9FF' },
    { name: '우울', emoji: '😔', color: '#B4A7D6' },
    { name: '분노', emoji: '😠', color: '#FFB4B4' },
    { name: '외로움', emoji: '😞', color: '#C7B8EA' },
    { name: '평온', emoji: '😌', color: '#B8E6D5' },
  ];

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsGuest(false);
        setConversationId(generateConversationId());
      } else {
        setUserId(null);
        // location state로 비회원 여부 재확인
        if ((location.state as any)?.isGuest) {
          setIsGuest(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 비회원 카운트 동기화
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem(GUEST_COUNT_KEY, String(guestCount));
    }
  }, [guestCount, isGuest]);

  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  const saveConversation = async (updatedMessages: Message[], emotion: string) => {
    if (!userId || !conversationId) return;
    try {
      const conversationRef = doc(db, 'conversations', userId, 'chats', conversationId);
      await setDoc(conversationRef, {
        messages: updatedMessages,
        emotion: emotion,
        preview: updatedMessages[0]?.content.substring(0, 50) || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('대화 저장 실패:', error);
    }
  };

  const sendMessage = async (text: string, emotion?: string) => {
    if (!text.trim() || isLoading) return;

    // 비회원 횟수 체크
    if (isGuest) {
      const currentCount = parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
      if (currentCount >= GUEST_CHAT_LIMIT) {
        setShowGuestModal(true);
        return;
      }
    }

    setShowWelcome(false);
    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    const currentEmotion = emotion || selectedEmotion || '일반';
    if (emotion && !selectedEmotion) setSelectedEmotion(emotion);

    try {
      const API_URL = import.meta.env.PROD
        ? 'https://freesia-production-5de6.up.railway.app'
        : 'http://localhost:3001';

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error('API 요청 실패');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content[0].text,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // 비회원 카운트 증가
      if (isGuest) {
        const newCount = parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10) + 1;
        localStorage.setItem(GUEST_COUNT_KEY, String(newCount));
        setGuestCount(newCount);

        // 10회 도달 시 모달 표시
        if (newCount >= GUEST_CHAT_LIMIT) {
          setTimeout(() => setShowGuestModal(true), 800);
        }
      } else {
        await saveConversation(finalMessages, currentEmotion);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '죄송해요, 지금 응답을 드릴 수 없어요. 잠시 후 다시 시도해주세요. 🙏',
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionClick = (emotionName: string) => {
    sendMessage(`저는 지금 ${emotionName} 느껴요.`, emotionName);
  };

  const resetConversation = () => {
    setMessages([]);
    setShowWelcome(true);
    setInputText('');
    setSelectedEmotion('');
    setConversationId(generateConversationId());
  };

  // 비회원 남은 횟수
  const remainingCount = Math.max(0, GUEST_CHAT_LIMIT - guestCount);
  const isGuestLimitReached = isGuest && guestCount >= GUEST_CHAT_LIMIT;

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="home-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
      </header>

      {/* 비회원 횟수 배너 */}
      {isGuest && !showGuestModal && (
        <div className={`guest-banner ${remainingCount <= 3 ? 'guest-banner--warning' : ''}`}>
          {remainingCount > 0 ? (
            <>
              비회원 모드 · 남은 대화 <strong>{remainingCount}회</strong>
              <button className="guest-banner-login" onClick={() => navigate('/login')}>
                로그인하고 무제한 이용 →
              </button>
            </>
          ) : (
            <>
              대화 횟수를 모두 사용했어요
              <button className="guest-banner-login" onClick={() => setShowGuestModal(true)}>
                계속하려면 로그인 →
              </button>
            </>
          )}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="home-main">
        {showWelcome ? (
          <div className="welcome-section">
            <div className="welcome-message">
              <p className="welcome-text">
                안녕하세요, 제 이름은 <span className="highlight">프리지아</span>예요.
                <br />
                만나서 반가워요! 💛
              </p>
            </div>

            <h2 className="question">지금 기분은 어떠세요?</h2>

            <div className="input-section">
              <input
                type="text"
                placeholder="예) 오늘 회의에서 실수해서 불안해요"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                className="text-input"
                disabled={isGuestLimitReached}
              />
            </div>

            <div className="emotions-grid">
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionClick(emotion.name)}
                  className="emotion-button"
                  style={{ backgroundColor: emotion.color }}
                  disabled={isGuestLimitReached}
                >
                  <span className="emotion-emoji">{emotion.emoji}</span>
                  <span className="emotion-name">{emotion.name}</span>
                </button>
              ))}
            </div>

            <p className="hint-text">💡 원하실 때 언제든지 대화를 시작할 수 있어요</p>
          </div>
        ) : (
          <div className="chat-section">
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-bubble">{message.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant-message">
                  <div className="message-bubble loading">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <button onClick={resetConversation} className="reset-button">
              <RotateCcw size={16} />
              새로 시작하기
            </button>

            <div className="chat-input-section">
              <input
                type="text"
                placeholder={isGuestLimitReached ? '로그인 후 계속 대화할 수 있어요' : '메시지를 입력하세요...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                className="chat-input"
                disabled={isLoading || isGuestLimitReached}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading || isGuestLimitReached}
                className="send-button"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />

      {/* 비회원 한도 초과 모달 */}
      {showGuestModal && (
        <div className="guest-modal-overlay" onClick={() => setShowGuestModal(false)}>
          <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guest-modal-emoji">🌼</div>
            <h3 className="guest-modal-title">비회원 대화 횟수를<br />모두 사용했어요</h3>
            <p className="guest-modal-desc">
              프리지아와 계속 대화하려면<br />
              로그인 또는 회원가입이 필요해요.<br />
              <span className="guest-modal-highlight">회원은 횟수 제한 없이 이용할 수 있어요 💛</span>
            </p>
            <div className="guest-modal-buttons">
              <button
                className="guest-modal-btn guest-modal-btn--primary"
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
              <button
                className="guest-modal-btn guest-modal-btn--secondary"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>
            <button
              className="guest-modal-close"
              onClick={() => setShowGuestModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;