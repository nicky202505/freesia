# 🌼 프리지아 (Freesia)

> AI 기반 감정 코칭 서비스

프리지아는 Claude AI를 활용한 한국어 감정 코칭 웹 애플리케이션입니다. 사용자의 감정을 인식하고 공감적인 대화를 통해 감정 관리를 돕는 서비스입니다.

![프리지아 메인](https://via.placeholder.com/800x400/FFD93D/FFFFFF?text=Freesia+Main+Screen)

## ✨ 주요 기능

### 🤖 AI 감정 코칭
- **Claude Sonnet 4** API를 활용한 실시간 대화
- 6가지 감정 카테고리 (기쁨, 슬픔, 우울, 분노, 외로움, 평온)
- 공감적이고 전문적인 AI 응답
- 한국어 최적화 감정 인식

### 💬 대화 관리
- 실시간 채팅 인터페이스
- 타이핑 애니메이션
- 감정별 색상 구분
- 대화 내역 자동 저장

### 📚 히스토리
- 과거 대화 목록 조회
- 날짜별 정렬
- 감정 아이콘 표시
- 대화 미리보기

### 📊 통계 및 인사이트
- 감정 분포 도넛 차트
- 주간 대화 현황
- AI 기반 인사이트 제공
- 감정 패턴 분석

### ⚙️ 개인화 설정
- 프로필 관리
- 알림 설정 (ON/OFF 토글)
- 일반 설정 (데이터 동기화, 자동 백업, 생체 인증)
- 다국어 지원 준비

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **React Router** - 페이지 라우팅
- **Recharts** - 데이터 시각화
- **Lucide React** - 아이콘
- **CSS3** - 스타일링 (반응형 디자인)

### Backend
- **Node.js** - 런타임 환경
- **Express** - API 프록시 서버
- **CORS** - Cross-Origin Resource Sharing

### Database & Auth
- **Firebase Authentication** - 사용자 인증
- **Firebase Firestore** - NoSQL 데이터베이스
- 실시간 데이터 동기화

### AI
- **Anthropic Claude API** - 감정 코칭 AI
- Claude Sonnet 4 모델

## 📁 프로젝트 구조

```
freesia/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # 로그인 페이지
│   │   ├── SignupPage.tsx         # 회원가입 페이지
│   │   ├── HomePage.tsx           # 메인 홈 (채팅)
│   │   ├── HistoryPage.tsx        # 대화 히스토리
│   │   ├── StatsPage.tsx          # 통계 페이지
│   │   ├── SettingsPage.tsx       # 설정 페이지
│   │   ├── BottomNav.tsx          # 하단 네비게이션
│   │   └── *.css                  # 각 컴포넌트 스타일
│   ├── App.tsx                    # 메인 앱 컴포넌트
│   ├── index.tsx                  # 진입점
│   ├── index.css                  # 전역 스타일
│   └── firebase.ts                # Firebase 설정
├── server.js                      # Express 프록시 서버
├── .env                           # 환경 변수 (git에 미포함)
├── package.json                   # 의존성 관리
└── README.md                      # 프로젝트 문서
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Firebase 프로젝트
- Anthropic API 키

### 설치

1. **저장소 클론**
```bash
git clone https://github.com/nicky202505/freesia.git
cd freesia
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**

`.env` 파일 생성:
```env
VITE_CLAUDE_API_KEY=your_anthropic_api_key_here
```

4. **Firebase 설정**

`src/firebase.ts` 파일에서 Firebase 설정 업데이트:
```typescript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};
```

### 실행

**개발 모드:**

터미널 1 (프론트엔드):
```bash
npm run dev
```

터미널 2 (백엔드):
```bash
node server.js
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

## 🔧 환경 설정

### Firebase 설정

1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호)
3. Firestore Database 생성 (서울 리전 권장)
4. 보안 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Anthropic API 키

1. [Anthropic Console](https://console.anthropic.com)에서 API 키 발급
2. `.env` 파일에 추가
3. 월 사용량 제한 설정 권장

## 📱 주요 페이지

### 로그인 / 회원가입
- 이메일/비밀번호 인증
- Firebase Authentication 연동
- 입력 검증 및 에러 처리

### 홈 (채팅)
- 6개 감정 버튼
- 실시간 AI 대화
- 타이핑 애니메이션
- 새로 시작하기 기능

### 히스토리
- 날짜별 대화 목록
- 감정 아이콘 및 미리보기
- 메시지 개수 표시
- 카드형 UI

### 통계
- 총 대화 수 / 주간 대화 수
- 감정 분포 도넛 차트
- AI 인사이트 (3가지)
- 실시간 데이터 분석

### 설정
- 프로필 정보 (이름, 이메일)
- 일반 설정 (토글)
- 알림 설정 (토글)
- 약관 및 정책
- 로그아웃

## 🎨 디자인

### 디자인 시스템
- **메인 컬러**: #FFD93D (노란색)
- **서브 컬러**: #FFA726 (주황색)
- **배경**: #FAFAFA (연한 회색)
- **폰트**: Noto Sans KR

### 감정별 컬러
- 기쁨: #FFD93D
- 슬픔: #94C9FF
- 우울: #B4A7D6
- 분노: #FFB4B4
- 외로움: #C7B8EA
- 평온: #B8E6D5

### 반응형 디자인
- 데스크톱: 최대 800px 중앙 정렬
- 태블릿: 전체 너비 (768px 이하)
- 모바일: 전체 너비 (480px 이하)

## 📊 데이터 구조

### Firestore Collections

```
conversations/
  {userId}/
    chats/
      {conversationId}/
        - messages: Array<{role, content}>
        - emotion: string
        - preview: string
        - createdAt: timestamp
        - updatedAt: timestamp
```

## 🔐 보안

- Firebase Authentication을 통한 사용자 인증
- Firestore 보안 규칙으로 데이터 접근 제어
- API 키는 환경 변수로 관리
- HTTPS 통신 (프로덕션)

## 🌐 배포

### 프론트엔드 (Vercel/Netlify)

```bash
npm run build
```

### 백엔드 (Railway/Render)

`server.js`를 배포 플랫폼에 업로드

환경 변수 설정:
- `VITE_CLAUDE_API_KEY`
- `PORT` (자동 설정)

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 👤 개발자

**니콜**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: jangnicole878@gmail.com

## 🙏 감사의 말

- [Anthropic](https://www.anthropic.com) - Claude AI API
- [Firebase](https://firebase.google.com) - 인증 및 데이터베이스
- [Recharts](https://recharts.org) - 차트 라이브러리
- [Lucide](https://lucide.dev) - 아이콘

## 📸 스크린샷

### 메인 홈
![홈 화면](https://via.placeholder.com/800x600/FFF9E6/333333?text=Home+Screen)

### 히스토리
![히스토리](https://via.placeholder.com/800x600/FAFAFA/333333?text=History)

### 통계
![통계](https://via.placeholder.com/800x600/FAFAFA/333333?text=Statistics)

### 설정
![설정](https://via.placeholder.com/800x600/FFF0F0/333333?text=Settings)

---

**프리지아**와 함께 감정을 나누고 마음을 돌보세요 💛
