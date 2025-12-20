import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, Heart, Cloud, Zap, Flame, Moon, Sun } from 'lucide-react';

const EmotionalCoachApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const messagesEndRef = useRef(null);

  const emotions = [
    { name: '불안함', icon: Cloud, color: 'from-slate-400 to-slate-600', bg: 'bg-slate-50' },
    { name: '우울함', icon: Moon, color: 'from-indigo-400 to-indigo-600', bg: 'bg-indigo-50' },
    { name: '스트레스', icon: Zap, color: 'from-amber-400 to-orange-600', bg: 'bg-amber-50' },
    { name: '화남', icon: Flame, color: 'from-red-400 to-red-600', bg: 'bg-red-50' },
    { name: '외로움', icon: Moon, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
    { name: '행복함', icon: Sun, color: 'from-yellow-400 to-pink-500', bg: 'bg-yellow-50' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCurrentEmotionStyle = () => {
    if (!selectedEmotion) return emotions[0];
    return emotions.find(e => e.name === selectedEmotion) || emotions[0];
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `당신은 따뜻하고 공감적인 감정 코치입니다. 사용자의 감정을 깊이 이해하고, 판단하지 않으며, 건설적인 조언을 제공합니다.

핵심 원칙:
- 먼저 사용자의 감정을 인정하고 공감합니다
- 구체적인 질문으로 상황을 더 잘 이해하려고 노력합니다
- 실천 가능한 작은 행동이나 관점의 변화를 제안합니다
- 긍정적이면서도 현실적인 태도를 유지합니다
- 심각한 정신 건강 문제의 징후가 보이면 전문가 상담을 권장합니다

대화 스타일:
- 친근하지만 존중하는 말투
- 짧고 이해하기 쉬운 문장
- 이모지는 적절히 사용하되 과하지 않게
- 2-4문장 정도로 간결하게 응답`,
          messages: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송해요, 일시적인 오류가 발생했어요. 다시 시도해주세요.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionSelect = (emotionName) => {
    setSelectedEmotion(emotionName);
    sendMessage(`저는 지금 ${emotionName} 느껴요.`);
  };

  const resetConversation = () => {
    setMessages([]);
    setSelectedEmotion(null);
    setInputText('');
  };

  const currentStyle = getCurrentEmotionStyle();

  return (
    <div className={`min-h-screen ${currentStyle.bg} transition-colors duration-700 font-sans`}>
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${currentStyle.color} rounded-full opacity-10 blur-3xl animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr ${currentStyle.color} rounded-full opacity-10 blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            감정 코치
          </h1>
          <p className="text-gray-600">당신의 감정을 들려주세요. 함께 이야기 나눠요 💙</p>
        </div>

        {/* Emotion Selection or Chat */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
              <Heart className={`w-16 h-16 mb-6 text-gray-400 animate-bounce`} />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">지금 어떤 기분이신가요?</h2>
              <p className="text-gray-600 mb-8 text-center">감정을 선택하거나 자유롭게 말씀해주세요</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {emotions.map((emotion, index) => {
                  const Icon = emotion.icon;
                  return (
                    <button
                      key={emotion.name}
                      onClick={() => handleEmotionSelect(emotion.name)}
                      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${emotion.color} text-white 
                        hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl
                        animate-slide-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-lg">{emotion.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    style={{ animationDelay: '0ms' }}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? `bg-gradient-to-br ${currentStyle.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-800 shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-gray-100 p-4 rounded-2xl shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reset Button */}
              <div className="px-6 pt-2">
                <button
                  onClick={resetConversation}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  새로운 대화 시작
                </button>
              </div>
            </>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 bg-white/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                placeholder={messages.length === 0 ? "또는 직접 입력해주세요..." : "메시지를 입력하세요..."}
                className="flex-1 px-5 py-3 rounded-full border-2 border-gray-200 focus:border-gray-400 
                  focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className={`p-3 rounded-full bg-gradient-to-br ${currentStyle.color} text-white 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 
                  transform transition-all shadow-lg hover:shadow-xl`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>💡 심각한 정신 건강 문제는 전문가 상담을 권장드려요</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default EmotionalCoachApp;
