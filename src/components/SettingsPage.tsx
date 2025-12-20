import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User } from 'lucide-react';
import BottomNav from './BottomNav';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // 토글 상태
  const [toggles, setToggles] = useState({
    dataSync: false,
    autoBackup: false,
    biometric: false,
    conversationNotif: false,
    systemNotif: false,
    marketing: false,
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="settings-container">
      {/* 헤더 */}
      <header className="settings-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
        <p className="settings-header-text">내 정보</p>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="settings-main">
        {/* 프로필 섹션 */}
        <section className="settings-section profile-section">
          <h3 className="section-title">Profile</h3>
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={32} />
            </div>
            <div className="profile-info">
              <p className="profile-label">이름</p>
              <p className="profile-value">{user?.displayName || '사용자'}</p>
              <p className="profile-label">이메일</p>
              <p className="profile-value">{user?.email}</p>
            </div>
          </div>
          <button className="profile-edit-btn">프로필 수정</button>
        </section>

        {/* 일반 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">일반</h3>
          <div className="settings-list">
            <div className="settings-item">
              <span>데이터 동기화</span>
              <button 
                className={`toggle-btn ${toggles.dataSync ? 'active' : ''}`}
                onClick={() => handleToggle('dataSync')}
              >
                {toggles.dataSync ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="settings-item">
              <span>자동 백업</span>
              <button 
                className={`toggle-btn ${toggles.autoBackup ? 'active' : ''}`}
                onClick={() => handleToggle('autoBackup')}
              >
                {toggles.autoBackup ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="settings-item">
              <span>생체 인증 (지문/얼굴)</span>
              <button 
                className={`toggle-btn ${toggles.biometric ? 'active' : ''}`}
                onClick={() => handleToggle('biometric')}
              >
                {toggles.biometric ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </section>

        {/* 알림 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">알림</h3>
          <div className="settings-list">
            <div className="settings-item">
              <span>대화 알림 (3~5분 후)</span>
              <button 
                className={`toggle-btn ${toggles.conversationNotif ? 'active' : ''}`}
                onClick={() => handleToggle('conversationNotif')}
              >
                {toggles.conversationNotif ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="settings-item">
              <span>시스템 알림 (4~5분 후)</span>
              <button 
                className={`toggle-btn ${toggles.systemNotif ? 'active' : ''}`}
                onClick={() => handleToggle('systemNotif')}
              >
                {toggles.systemNotif ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="settings-item">
              <span>마케팅 수신 동의</span>
              <button 
                className={`toggle-btn ${toggles.marketing ? 'active' : ''}`}
                onClick={() => handleToggle('marketing')}
              >
                {toggles.marketing ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </section>

        {/* 정보 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">정보</h3>
          <div className="settings-list">
            <button className="settings-link">
              <span>도움말 센터</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>자주 묻는 질문</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>문의하기</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 언어 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">언어</h3>
          <div className="settings-list">
            <button className="settings-link">
              <span>한국어</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 약관 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">약관 및 정책</h3>
          <div className="settings-list">
            <button className="settings-link">
              <span>서비스 이용약관</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>개인정보 처리방침</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>위치 기반 서비스 이용약관</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>청소년 보호정책</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 평가 섹션 */}
        <section className="settings-section">
          <h3 className="section-title">평가</h3>
          <div className="settings-list">
            <button className="settings-link">
              <span>리뷰 작성</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>별점 매기기</span>
              <ChevronRight size={20} />
            </button>
            <button className="settings-link">
              <span>친구 추천하기</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 버전 정보 */}
        <section className="settings-section">
          <div className="version-info">
            <p className="version-label">버전</p>
            <p className="version-value">1.0.0</p>
          </div>
        </section>

        {/* 로그아웃 */}
        <section className="settings-section">
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </section>

        {/* 회원 탈퇴 */}
        <section className="settings-section">
          <button className="withdrawal-link">
            회원 탈퇴
          </button>
        </section>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
