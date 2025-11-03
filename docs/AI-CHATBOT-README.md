# PaySmile AI Chatbot - Smiley Helper

## Overview

The Smiley Helper is an AI-powered chatbot integrated into PaySmile to help users understand blockchain technology, cryptocurrencies, and how to use the PaySmile donation platform.

## Features

✅ **Blockchain Education**

- Explains blockchain basics in simple terms
- Answers questions about cryptocurrencies and CELO
- Describes smart contracts and how they work

✅ **Platform Guidance**

- Walks users through the donation process
- Explains NFT badges and reward tiers
- Provides security and safety information

✅ **Persistent Chat History**

- Conversations are saved locally
- Chat history persists across sessions
- Easy to clear history when needed

✅ **User-Friendly Interface**

- Floating chat button on all pages
- Beautiful, responsive design matching PaySmile branding
- Suggested questions for easy start
- Typing indicators for better UX

## File Structure

```
src/
├── components/
│   └── AIChat.tsx                 # Main chatbot component
├── hooks/
│   └── use-chat-history.ts        # Chat history persistence hook
└── app/
    └── api/
        └── chatbot/
            └── route.ts           # API endpoint for AI responses
```

## Usage

The AI chatbot automatically appears on all pages as a floating button in the bottom-right corner.

### User Flow:

1. Click the sparkles icon to open chat
2. Choose a suggested question or type your own
3. Receive instant AI responses
4. Continue conversation naturally
5. Close chat or clear history as needed

## Knowledge Base

The chatbot currently has built-in knowledge about:

- **Blockchain Technology**: What it is, how it works, benefits
- **CELO Cryptocurrency**: Features, benefits, transaction costs
- **Donations**: Step-by-step guide to donating
- **NFT Badges**: Tiers, benefits, how to earn
- **Security**: Safety measures, wallet protection
- **Smart Contracts**: Purpose, functionality, transparency
- **Wallets**: Setup, usage, MetaMask integration
- **Gas Fees**: What they are, costs on Celo

## API Endpoint

### POST `/api/chatbot`

**Request:**

```json
{
  "message": "What is blockchain?",
  "conversationHistory": []
}
```

**Response:**

```json
{
  "response": "Blockchain is a digital ledger technology...",
  "suggestions": ["Tell me more", "How do I get started?"]
}
```

## Customization

### Adding New Knowledge

Edit `/src/app/api/chatbot/route.ts` and add to `PAYSMILE_KNOWLEDGE` object:

```typescript
const PAYSMILE_KNOWLEDGE = {
  newTopic: `Your detailed explanation here...`,
  // ... existing topics
};
```

Then add detection logic in `generateResponse()`:

```typescript
if (lowerMessage.includes("keyword")) {
  return PAYSMILE_KNOWLEDGE.newTopic;
}
```

### Changing Appearance

Colors and styling can be customized in `/src/components/AIChat.tsx`:

- **Primary color**: `bg-primary` (currently yellow #FFD700)
- **Chat bubbles**: `bg-muted` for AI, `bg-primary` for user
- **Avatar**: Update `AI_AVATAR` constant with new image URL

### Suggested Questions

Modify `SUGGESTED_QUESTIONS` array in `/src/components/AIChat.tsx`:

```typescript
const SUGGESTED_QUESTIONS = [
  "Your custom question here",
  // ... more questions
];
```

## Future Enhancements

### Planned Features:

- [ ] Integration with OpenAI/Gemini API for advanced AI
- [ ] Voice input/output support
- [ ] Multilingual support (French, Swahili)
- [ ] Context-aware responses based on current page
- [ ] Rich media responses (images, videos)
- [ ] Feedback system (thumbs up/down)
- [ ] Analytics dashboard for common questions
- [ ] Export chat transcript feature

### Advanced AI Integration

To connect with OpenAI/Gemini:

1. Add API key to environment variables:

```bash
OPENAI_API_KEY=your_key_here
# or
GOOGLE_AI_API_KEY=your_key_here
```

2. Update `/src/app/api/chatbot/route.ts`:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { message, conversationHistory } = await request.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are Smiley Helper, an AI assistant for PaySmile...",
      },
      ...conversationHistory,
      { role: "user", content: message },
    ],
  });

  return NextResponse.json({
    response: completion.choices[0].message.content,
  });
}
```

## Performance

- **Initial Load**: ~50KB (component + styles)
- **API Response Time**: <500ms for simple queries
- **Chat History**: Max 50 messages stored locally
- **Memory Usage**: Minimal (localStorage only)

## Accessibility

- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ ARIA labels on all interactive elements
- ✅ High contrast text for readability
- ✅ Focus indicators on buttons

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Troubleshooting

### Chat not appearing

- Check if `<AIChatButton />` is in layout.tsx
- Verify no CSS conflicts with z-index
- Check console for JavaScript errors

### Messages not persisting

- Verify localStorage is enabled
- Check browser privacy settings
- Clear cache and reload

### API errors

- Check `/api/chatbot/route.ts` is deployed
- Verify no CORS issues
- Check network tab for failed requests

## Contributing

When adding features:

1. Test on mobile and desktop
2. Ensure accessibility standards
3. Update knowledge base documentation
4. Add error handling
5. Test chat history persistence

## License

Part of PaySmile - All rights reserved
