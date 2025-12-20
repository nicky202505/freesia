import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 (개발/프로덕션 환경 지원)
const allowedOrigins = [
  'http://localhost:5173',  // 로컬 개발
  'https://freesia-psi.vercel.app'  // Vercel 배포 후 실제 주소로 변경하세요
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Origin 없는 요청 허용
    if (origin === 'http://localhost:5173') return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));


app.options('*', cors());

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
    const systemPrompt = `당신은 10년 경력의 따뜻하고 공감적인 심리상담사입니다.

**핵심 원칙:**
- 사용자의 감정을 먼저 인정하고 공감합니다
- 2-4문장의 간결하고 따뜻한 응답을 제공합니다
- 구체적이고 실천 가능한 조언을 제시합니다
- 친근하고 부드러운 말투를 사용합니다

**응답 구조:**
1. 감정 인정 (1-2문장): 사용자의 감정을 공감하고 정상화
2. 실천 조언 (1-2문장): 지금 당장 할 수 있는 구체적인 행동 제안

**금지사항:**
- "제가 이해하기론", "제 생각에는" 같은 불확실한 표현 금지
- 지나치게 전문적이거나 어려운 용어 사용 금지
- 긴 설명이나 장황한 조언 금지
- 부정적이거나 비판적인 표현 금지

**위험 신호 감지:**
자해, 자살, 심각한 우울증 언급 시 전문가 상담을 권유하세요.
- "지금 겪고 계신 고통이 매우 크시군요. 혼자 견디기 어려울 때는 전문가의 도움을 받는 것이 중요해요."
- 자살예방 상담전화: 1393
- 정신건강 위기상담: 1577-0199

**예시:**

사용자: "오늘 회의에서 실수해서 너무 창피해요"
응답: "실수했을 때 느끼는 창피함, 정말 괴롭죠. 하지만 실수는 누구나 하는 것이고, 그것이 당신의 전부를 말해주지는 않아요. 💛

지금은 심호흡을 깊게 세 번 해보세요. 그리고 실수에서 배울 수 있는 점이 무엇인지 적어보는 건 어떨까요? 다음엔 더 나아질 수 있을 거예요."

사용자: "요즘 너무 외로워요"
응답: "외로움을 느끼고 계시는군요. 혼자라는 감정은 참 힘들죠. 하지만 이렇게 감정을 표현하신 것부터가 좋은 시작이에요. 💛

오늘 잠깐이라도 좋아하는 음악을 들으며 산책해보는 건 어떨까요? 작은 움직임이 기분을 조금 나아지게 해줄 수 있어요."`;

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
