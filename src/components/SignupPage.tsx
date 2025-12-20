import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './SignupPage.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 사용자 이름 업데이트
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }

      navigate('/home');
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="signup-container">
      {/* 헤더 */}
      <header className="signup-header">
        <p className="header-subtitle">emotional coaching service</p>
        <h1 className="header-title">프리지아</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="signup-main">
        <div className="signup-box">
          <h2 className="signup-title">회원가입</h2>
          <p className="signup-subtitle">프리지아와 함께 시작해보세요 💛</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="signup-form">
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="signup-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호 (최소 6자)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-input"
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

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="signup-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="eye-button"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="signup-button">
              회원가입
            </button>
          </form>

          <div className="signup-footer">
            <p className="footer-text">
              이미 계정이 있으신가요?{' '}
              <a href="/login" className="login-link">
                로그인
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
