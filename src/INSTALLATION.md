# 프리지아 설치 가이드 📦

## 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/freesia.git
cd freesia
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 추가 패키지 설치 (Recharts)
```bash
npm install recharts
```

---

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `freesia` (또는 원하는 이름)
4. Google Analytics 설정 (선택사항)

### 2. Authentication 설정

1. 왼쪽 메뉴 → "빌드" → "Authentication"
2. "시작하기" 클릭
3. "이메일/비밀번호" 활성화
4. "저장"

### 3. Firestore Database 설정

1. 왼쪽 메뉴 → "빌드" → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. 위치: `asia-northeast3 (서울)` 선택
4. "프로덕션 모드에서 시작" 선택
5. "만들기"

### 4. Firestore 보안 규칙

"규칙" 탭에서 다음 규칙 설정:

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

"게시" 클릭

### 5. Firebase 설정 정보 가져오기

1. 프로젝트 설정 (⚙️ 아이콘)
2. "일반" 탭
3. "내 앱" → "웹 앱 추가" (</> 아이콘)
4. 앱 닉네임: `freesia-web`
5. Firebase SDK 코드 복사

### 6. firebase.ts 업데이트

`src/firebase.ts` 파일 수정:

```typescript
const firebaseConfig = {
  apiKey: "복사한_API_KEY",
  authDomain: "복사한_AUTH_DOMAIN",
  projectId: "복사한_PROJECT_ID",
  storageBucket: "복사한_STORAGE_BUCKET",
  messagingSenderId: "복사한_MESSAGING_SENDER_ID",
  appId: "복사한_APP_ID"
};
```

---

## Anthropic API 설정

### 1. API 키 발급

1. https://console.anthropic.com 접속
2. 로그인 또는 회원가입
3. "API Keys" 메뉴
4. "Create Key" 클릭
5. API 키 복사 (한 번만 표시됨!)

### 2. .env 파일 생성

프로젝트 루트 폴더에 `.env` 파일 생성:

```env
VITE_CLAUDE_API_KEY=sk-ant-your-api-key-here
```

**중요:** API 키를 절대 GitHub에 올리지 마세요!

### 3. 사용량 제한 설정 (권장)

1. Anthropic Console → "Settings"
2. "Usage Limits" 설정
3. 월 $50 이하 권장

---

## 서버 실행

### 터미널 1: 백엔드 서버

```bash
node server.js
```

**성공 메시지:**
```
🌼 프리지아 서버가 포트 3001에서 실행 중입니다!
```

### 터미널 2: 프론트엔드 개발 서버

```bash
npm run dev
```

**성공 메시지:**
```
VITE v7.3.0  ready in 258 ms
➜  Local:   http://localhost:5173/
```

---

## 접속 확인

브라우저에서 `http://localhost:5173` 접속

### 확인 사항:
- [ ] 로그인 페이지가 보임
- [ ] 회원가입 가능
- [ ] 로그인 후 홈 이동
- [ ] AI 채팅 작동
- [ ] 대화 저장 확인 (Firebase)
- [ ] 히스토리 페이지 작동
- [ ] 통계 페이지 작동
- [ ] 설정 페이지 작동

---

## 문제 해결

### "Failed to fetch" 에러
→ 백엔드 서버가 실행 중인지 확인
→ `node server.js` 실행 확인

### "Permission denied" (Firebase)
→ Firestore 보안 규칙 확인
→ 로그인했는지 확인

### API 키 에러
→ `.env` 파일이 루트 폴더에 있는지 확인
→ `VITE_CLAUDE_API_KEY` 이름 확인
→ 서버 재시작 (Ctrl+C 후 다시 실행)

### Recharts 차트 안 보임
→ `npm install recharts` 실행
→ 대화 데이터가 있는지 확인

### 중앙 정렬 안 됨
→ `src/index.css` 파일 확인
→ `index.tsx`에 `import './index.css'` 있는지 확인

---

## 최종 체크리스트 ✅

### Firebase:
- [ ] 프로젝트 생성
- [ ] Authentication 활성화
- [ ] Firestore Database 생성
- [ ] 보안 규칙 설정
- [ ] firebase.ts 업데이트

### API:
- [ ] Anthropic API 키 발급
- [ ] .env 파일 생성
- [ ] API 키 입력

### 실행:
- [ ] npm install 완료
- [ ] 백엔드 서버 실행 (3001번 포트)
- [ ] 프론트엔드 실행 (5173번 포트)
- [ ] 브라우저 접속 확인

### 테스트:
- [ ] 회원가입/로그인
- [ ] AI 채팅
- [ ] 대화 저장
- [ ] 히스토리 조회
- [ ] 통계 확인
- [ ] 설정 변경

---

## 다음 단계

설치가 완료되면:

1. 테스트 계정으로 로그인
2. 다양한 감정으로 대화 시도
3. 히스토리 및 통계 확인
4. 스크린샷 촬영 (포트폴리오용)
5. README.md에 실제 스크린샷 추가

---

설치 완료! 프리지아를 즐겨보세요! 💛
