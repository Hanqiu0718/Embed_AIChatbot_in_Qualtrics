# Embedding AI Chatbots in Qualtrics for Social Science Research 

A specialized chatbot implementation for Qualtrics surveys.

## Overview

This project implements an interactive chatbot within Qualtrics surveys that helps participants process workplace anger experiences through cognitive reappraisal strategies. The chatbot uses OpenAI's GPT-4o API to provide personalized, context-aware responses while maintaining specific interaction styles based on research requirements.

## Citation

If you use this code in your research, please cite our working paper, which describes the implements for this code:
```
Li, H., & SHIH, M. (2025). Managing Anger: Enhancing AI-driven Cognitive Reappraisal Through Emotional Validation. Retrieved from osf.io/a3sxf_v1
```

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
- OpenAI API (GPT-4o)
- JavaScript (ES6+)

### 1. Qualtrics Configuration

1. Create a new question in your Qualtrics survey
2. Set the question type to "Text Entry"
3. Add the JavaScript code to the question
4. Set up the embedded data fields

### 2. API Configuration

Replace the API key in the code with your own OpenAI API key:
```javascript
'Authorization': `Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
```

### 3. Customize Prompts

Modify the `userPrompt` variables for each host type to adjust the specific prompt you wish to set for your chatbots

## Usage

1. Participants enter their workplace anger experience
2. The chatbot initiates conversation based on the selected host type
3. Participants engage in a guided discussion about their experience
4. After 5 exchanges, participants can continue chatting or exit
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

## Authors

- Hanqiu Li - (https://github.com/Hanqiu0718)
- Contact info: hanqiu.li.phd@anderson.ucla.edu

## Research Ethics

This project was approved by the Institutional Review Board at UCLA. All participants provided informed consent before engaging with the chatbot.
