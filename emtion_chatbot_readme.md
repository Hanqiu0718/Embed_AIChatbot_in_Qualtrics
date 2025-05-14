# Qualtrics AI Chatbot for Emotion Regulation Research

A specialized chatbot implementation for Qualtrics surveys that facilitates emotion regulation discussions using cognitive reappraisal techniques.

## Overview

This project implements an interactive chatbot within Qualtrics surveys that helps participants process workplace anger experiences through cognitive reappraisal strategies. The chatbot uses OpenAI's GPT-4 API to provide personalized, context-aware responses while maintaining specific interaction styles based on research requirements.

## Features

- **Real-time chat interface** integrated into Qualtrics surveys
- **Multiple chatbot personalities** (host1-4) with different interaction styles
- **Adaptive response timing** to simulate human-like conversation patterns
- **Emotion regulation strategies** based on cognitive reappraisal techniques
- **Message validation** (minimum 10 words) to ensure meaningful interactions
- **Typing indicators** for enhanced user experience
- **Conversation history tracking** via Qualtrics embedded data

## Technical Details

### Dependencies
- Qualtrics Survey Platform
- OpenAI API (GPT-4)
- JavaScript (ES6+)

### Key Components

1. **Chat Interface**
   - Custom-styled message bubbles
   - Input field with Enter key support
   - Send button with loading states
   - Auto-scrolling chat window

2. **AI Integration**
   - OpenAI GPT-4 API integration
   - Context-aware conversations
   - Response sanitization
   - Error handling

3. **Chatbot Personalities**
   - `host1`: AI-disclosed, neutral tone
   - `host2`: Human-presenting, neutral tone
   - `host3`: AI-disclosed, empathetic tone
   - `host4`: Human-presenting, empathetic tone

## Setup Instructions

### 1. Qualtrics Configuration

1. Create a new question in your Qualtrics survey
2. Set the question type to "Text Entry"
3. Add the JavaScript code to the question
4. Set up the following embedded data fields:
   - `userRecallIncident`
   - `chatbotType`
   - `chatbotName`
   - `UserPreferredName`

### 2. API Configuration

Replace the API key in the code with your own OpenAI API key:
```javascript
'Authorization': `Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
```

### 3. Customize Prompts

Modify the `userPrompt` variables for each host type to adjust:
- Emotion regulation strategies
- Language style
- Response tone
- Character limits

## Usage

1. Participants enter their workplace anger experience
2. The chatbot initiates conversation based on the selected host type
3. Participants engage in a guided discussion about their experience
4. After 4 exchanges, participants can continue chatting or exit
5. Conversation history is saved to Qualtrics embedded data

## Code Structure

```javascript
// Main components:
- addOnload(): Initializes the chat interface
- addOnReady(): Sets up event listeners and chat functionality
- createMessage(): Generates message bubbles
- fetchAIResponse(): Handles API calls to OpenAI
- showTypingAnimation(): Creates typing indicators
- sanitizeResponse(): Cleans AI responses
```

## Security Considerations

⚠️ **Important**: Never expose your API key in client-side code. Consider:
- Using a proxy server to handle API calls
- Implementing rate limiting
- Adding request validation
- Using environment variables for sensitive data

## Research Applications

This chatbot is designed for research studies investigating:
- Emotion regulation effectiveness
- Human-AI interaction patterns
- Cognitive reappraisal strategies
- Workplace anger management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- XXXX XXXX - *Initial work* - [XXXX](https://github.com/XXXX)

## Acknowledgments

- OpenAI for GPT-4 API
- Qualtrics for survey platform
- Research team members at XXXX University
- Study participants from XXXX

## Support

For questions or issues:
- Open an issue on GitHub
- Contact: XXXX@XXXX.edu
- Documentation: [Wiki](https://github.com/XXXX/qualtrics-chatbot/wiki)

## Version History

- v1.0.0 - Initial release (XXXX/XX/XX)
  - Basic chat functionality
  - Four chatbot personalities
  - Emotion regulation features

## Future Enhancements

- [ ] Implement server-side API proxy
- [ ] Add multilingual support
- [ ] Enhance error recovery
- [ ] Add conversation analytics
- [ ] Implement adaptive response timing
- [ ] Add participant feedback collection

## Citation

If you use this code in your research, please cite:
```
XXXX, X., XXXX, X., & XXXX, X. (XXXX). Qualtrics AI Chatbot for Emotion 
Regulation Research. GitHub. https://github.com/XXXX/qualtrics-chatbot
```

## Research Ethics

This project was approved by the Institutional Review Board at XXXX University (Protocol #XXXX-XXXX). All participants provided informed consent before engaging with the chatbot.