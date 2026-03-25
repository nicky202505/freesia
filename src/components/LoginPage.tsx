import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, Eye, EyeOff, UserX } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error: any) {
      console.error('로그인 실패:', error);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // 비회원 로그인: 카운트 초기화 후 홈으로 이동
  const handleGuestLogin = () => {
    localStorage.setItem('freesia_guest_count', '0');
    navigate('/home', { state: { isGuest: true } });
  };

  return (
    <div className="login-container">
      {/* 헤더 */}
      <header className="login-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="login-main">
        <div className="login-box">
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">프리지아와 함께 감정을 나눠보세요 💛</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          {/* 구분선 */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">또는</span>
            <span className="divider-line" />
          </div>

          {/* 비회원 로그인 버튼 */}
          <button onClick={handleGuestLogin} className="guest-button">
            <UserX size={18} />
            비회원으로 시작하기             
          </button>

          <div className="login-footer">
            <p className="footer-text">
              계정이 없으신가요?{' '}
              <a href="/signup" className="signup-link">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}; 



export default LoginPage;