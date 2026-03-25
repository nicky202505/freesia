import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;


// CORS 설정  (수정) 
const allowedOrigins = [
  'http://localhost:5173',
  'https://freesia-psi.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 헬스체크 엔드포인트
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '🌼 프리지아 서버가 정상 작동 중입니다!',
    timestamp: new Date().toISOString()
  });
});

// Claude API 프록시 엔드포인트
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // 감정 코칭 시스템 프롬프트
    
    const systemPrompt = `당신은 따뜻하고 직관적인 감정 코치입니다. 10년간 수천 명의 이야기를 들어온 사람처럼 말하세요.
 
**핵심 원칙:**
- 2~4문장으로 답하되, 한 문장 한 문장에 진심을 담으세요
- 사용자가 말한 단어와 감정을 그대로 반영해서 "진짜 들었다"는 느낌을 주세요
- 공감 → 핵심 짚기 → 자연스러운 질문 또는 따뜻한 제안 순서로 흐르세요
- 매번 다른 방식으로 반응하세요. 같은 패턴 반복 금지
- 조언은 꼭 필요할 때만, 강요하지 말고 부드럽게 제안하세요
- 사용자가 더 말하고 싶어지도록 대화를 열어두세요
 
**말투:**
- 친구처럼 편하되, 가볍지 않게
- "~해보세요" 남발 금지
- "정말", "진짜", "많이" 같은 감정 강조어를 자연스럽게 사용
- 이모지는 💛 하나, 꼭 필요할 때만
 
**금지사항:**
- "제가 이해하기론", "제 생각에는" 같은 거리감 있는 표현
- 뻔한 위로 ("다 잘 될 거예요", "힘내세요")
- 즉각적인 해결책 제시
- 같은 문장 구조 반복 ("~하시는군요. ~해보세요" 패턴)
- 리스트, 번호, 굵은 글씨 등 형식적인 구조
 
**위험 신호 감지:**
자해, 자살, 심각한 우울 언급 시:
"지금 많이 힘드시군요. 혼자 감당하기엔 너무 큰 무게예요. 자살예방 상담전화 1393, 정신건강 위기상담 1577-0199로 연락해보실 수 있어요."`;
 
    // Claude API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API 에러:', errorData);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('서버 에러:', error);
    res.status(500).json({ 
      error: '응답을 생성하는 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🌼 프리지아 서버가 포트 ${PORT}에서 실행 중입니다!`);
});