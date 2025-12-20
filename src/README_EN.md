# 🌼 Freesia

> AI-Powered Emotional Coaching Service

Freesia is a Korean-language emotional coaching web application powered by Claude AI. It helps users manage their emotions through empathetic conversations and AI-driven insights.

![Freesia Main](https://via.placeholder.com/800x400/FFD93D/FFFFFF?text=Freesia+Main+Screen)

## ✨ Key Features

### 🤖 AI Emotional Coaching
- Real-time conversations powered by **Claude Sonnet 4** API
- 6 emotion categories (Joy, Sadness, Depression, Anger, Loneliness, Peace)
- Empathetic and professional AI responses
- Optimized for Korean language

### 💬 Conversation Management
- Real-time chat interface
- Typing animations
- Color-coded emotions
- Automatic conversation saving

### 📚 History
- View past conversations
- Sorted by date
- Emotion icons and previews
- Message count display

### 📊 Statistics & Insights
- Emotion distribution donut chart
- Weekly conversation stats
- AI-powered insights (3 types)
- Emotional pattern analysis

### ⚙️ Personalization
- Profile management
- Notification settings (ON/OFF toggles)
- General settings (data sync, auto backup, biometric auth)
- Multi-language support ready

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Page routing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **CSS3** - Styling (responsive design)

### Backend
- **Node.js** - Runtime environment
- **Express** - API proxy server
- **CORS** - Cross-Origin Resource Sharing

### Database & Auth
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- Real-time data synchronization

### AI
- **Anthropic Claude API** - Emotional coaching AI
- Claude Sonnet 4 model

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase project
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/freesia.git
cd freesia
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
VITE_CLAUDE_API_KEY=your_anthropic_api_key_here
```

4. **Configure Firebase**

Update Firebase configuration in `src/firebase.ts`:
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

### Running the App

**Development mode:**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
node server.js
```

The application will run at `http://localhost:5173`.

## 🔧 Configuration

### Firebase Setup

1. Create a new project in [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database (Seoul region recommended)
4. Set security rules:

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

### Anthropic API Key

1. Get an API key from [Anthropic Console](https://console.anthropic.com)
2. Add to `.env` file
3. Set monthly usage limits (recommended)

## 📁 Project Structure

```
freesia/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # Login page
│   │   ├── SignupPage.tsx         # Signup page
│   │   ├── HomePage.tsx           # Main home (chat)
│   │   ├── HistoryPage.tsx        # Conversation history
│   │   ├── StatsPage.tsx          # Statistics page
│   │   ├── SettingsPage.tsx       # Settings page
│   │   ├── BottomNav.tsx          # Bottom navigation
│   │   └── *.css                  # Component styles
│   ├── App.tsx                    # Main app component
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Global styles
│   └── firebase.ts                # Firebase config
├── server.js                      # Express proxy server
├── .env                           # Environment variables (not in git)
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

## 📱 Main Pages

### Login / Signup
- Email/password authentication
- Firebase Authentication integration
- Input validation and error handling

### Home (Chat)
- 6 emotion buttons
- Real-time AI conversation
- Typing animation
- Reset conversation feature

### History
- Date-sorted conversation list
- Emotion icons and previews
- Message count display
- Card-based UI

### Statistics
- Total conversations / Weekly count
- Emotion distribution donut chart
- AI insights (3 types)
- Real-time data analysis

### Settings
- Profile info (name, email)
- General settings (toggles)
- Notification settings (toggles)
- Terms and policies
- Logout

## 🎨 Design

### Design System
- **Primary Color**: #FFD93D (Yellow)
- **Secondary Color**: #FFA726 (Orange)
- **Background**: #FAFAFA (Light Gray)
- **Font**: Noto Sans KR

### Emotion Colors
- Joy: #FFD93D
- Sadness: #94C9FF
- Depression: #B4A7D6
- Anger: #FFB4B4
- Loneliness: #C7B8EA
- Peace: #B8E6D5

### Responsive Design
- Desktop: Max 800px centered
- Tablet: Full width (below 768px)
- Mobile: Full width (below 480px)

## 📊 Data Structure

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

## 🔐 Security

- User authentication via Firebase Authentication
- Data access control with Firestore security rules
- API keys managed through environment variables
- HTTPS communication (production)

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
```

### Backend (Railway/Render)

Upload `server.js` to deployment platform

Set environment variables:
- `VITE_CLAUDE_API_KEY`
- `PORT` (auto-configured)

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Nicole**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com) - Claude AI API
- [Firebase](https://firebase.google.com) - Authentication and Database
- [Recharts](https://recharts.org) - Chart library
- [Lucide](https://lucide.dev) - Icons

## 📸 Screenshots

### Main Home
![Home Screen](https://via.placeholder.com/800x600/FFF9E6/333333?text=Home+Screen)

### History
![History](https://via.placeholder.com/800x600/FAFAFA/333333?text=History)

### Statistics
![Statistics](https://via.placeholder.com/800x600/FAFAFA/333333?text=Statistics)

### Settings
![Settings](https://via.placeholder.com/800x600/FFF0F0/333333?text=Settings)

---

**Freesia** - Share your emotions and take care of your mind 💛
