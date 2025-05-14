/**
 * Qualtrics AI Chatbot for Emotion Regulation Research
 * Version: 1.0.0
 * Author: XXXX XXXX
 * Institution: XXXX University
 * Department: XXXX Department
 * Contact: XXXX@XXXX.edu
 * Description: Implements an interactive chatbot within Qualtrics surveys for emotion regulation discussions
 * 
 * IMPORTANT: Replace the API key with your own and implement proper security measures
 * Never expose API keys in production client-side code
 */

// Configuration
const CONFIG = {
    API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    API_KEY: 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your API key - use environment variables in production
    MODEL: 'gpt-4o',
    MIN_WORD_COUNT: 10,
    TYPING_DELAY: { min: 30000, max: 50000 }, // milliseconds
    MESSAGE_LIMIT_BEFORE_EXIT: 4
};

// Initialize on page load
Qualtrics.SurveyEngine.addOnload(function() {
    this.hideNextButton();
});

// Main functionality
Qualtrics.SurveyEngine.addOnReady(function() {
    const surveyInstance = this;
    
    // Get embedded data
    const embeddedData = {
        userRecallIncident: Qualtrics.SurveyEngine.getEmbeddedData('userRecallIncident'),
        chatbotType: Qualtrics.SurveyEngine.getEmbeddedData('chatbotType'),
        chatbotName: Qualtrics.SurveyEngine.getEmbeddedData('chatbotName'),
        userPreferredName: Qualtrics.SurveyEngine.getEmbeddedData('UserPreferredName')
    };
    
    // Create chat interface
    const chatInterface = createChatInterface(this.getQuestionContainer());
    
    // Initialize chat state
    let chatHistory = `You: ${embeddedData.userRecallIncident}`;
    let messageCount = 0;
    
    // Display initial user message
    const initialBubble = createMessage('You:', embeddedData.userRecallIncident, true);
    chatInterface.chatbox.appendChild(initialBubble);
    chatInterface.chatbox.scrollTop = chatInterface.chatbox.scrollHeight;
    
    // Get system prompt based on chatbot type
    const systemPrompt = getSystemPrompt(embeddedData.chatbotName, embeddedData.userRecallIncident);
    
    // Start initial AI response
    handleAIResponse(systemPrompt, embeddedData.userRecallIncident, chatInterface, chatHistory);
    
    // Handle send button clicks
    chatInterface.sendButton.addEventListener('click', async function() {
        const userMessage = chatInterface.input.value.trim();
        
        if (!validateMessage(userMessage)) return;
        
        messageCount++;
        
        // Display user message
        const userBubble = createMessage('You:', userMessage, true);
        chatInterface.chatbox.appendChild(userBubble);
        chatInterface.input.value = '';
        
        // Update chat history
        chatHistory += `\nYou: ${userMessage}`;
        
        // Prepare context for AI
        const contextPrompt = `Here's context of conversation: ${chatHistory}. Note: It is the history of conversation you being host with user, initially it will be participants' recalled anger incident but as your conversation build up it'll give you the context of conversation, you need to analyze it and don't start over.`;
        
        // Get AI response
        await handleAIResponse(systemPrompt, contextPrompt, chatInterface, chatHistory);
        
        // Check if it's time to show exit option
        if (messageCount === CONFIG.MESSAGE_LIMIT_BEFORE_EXIT) {
            showExitMessage(chatInterface.chatbox, surveyInstance);
        }
    });
    
    // Handle Enter key press
    chatInterface.input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            chatInterface.sendButton.click();
        }
    });
    
    // Prevent paste to ensure genuine responses
    chatInterface.input.addEventListener('paste', function(e) {
        e.preventDefault();
    });
});

// Clean up on page unload
Qualtrics.SurveyEngine.addOnUnload(function() {
    if (window.typingInterval) {
        clearInterval(window.typingInterval);
    }
});

/**
 * Creates the chat interface elements
 * @param {HTMLElement} container - The question container
 * @returns {Object} Chat interface elements
 */
function createChatInterface(container) {
    // Create chatbox
    const chatbox = document.createElement('div');
    chatbox.id = 'chatbox';
    chatbox.style.cssText = `
        border: 1px solid #ccc;
        padding: 20px;
        margin: 20px 0;
        height: 400px;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        background-color: #fafafa;
        border-radius: 10px;
    `;
    container.appendChild(chatbox);
    
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
        display: flex;
        align-items: center;
        margin-top: 20px;
        width: 100%;
    `;
    container.appendChild(inputContainer);
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    `;
    inputContainer.appendChild(input);
    
    // Create send button
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = `
        padding: 10px 20px;
        margin-left: 10px;
        border: none;
        background-color: #4CAF50;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    `;
    inputContainer.appendChild(sendButton);
    
    return { chatbox, input, sendButton };
}

/**
 * Creates a message bubble
 * @param {string} sender - The sender's name
 * @param {string} text - The message text
 * @param {boolean} isUser - Whether this is a user message
 * @returns {HTMLElement} The message bubble element
 */
function createMessage(sender, text, isUser) {
    const messageBubble = document.createElement('div');
    messageBubble.style.cssText = `
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 15px;
        word-wrap: break-word;
        display: block;
        ${isUser ? `
            background-color: #dcf8c6;
            text-align: right;
            margin-left: 30%;
            max-width: 70%;
        ` : `
            background-color: #f1f0f0;
            text-align: left;
            margin-right: 30%;
            max-width: 70%;
        `}
    `;
    
    const name = document.createElement('span');
    name.style.cssText = 'font-weight: bold; margin-right: 10px;';
    name.textContent = isUser ? 'You' : 'Discussion Partner';
    
    messageBubble.appendChild(name);
    messageBubble.appendChild(document.createTextNode(text));
    
    return messageBubble;
}

/**
 * Validates user message
 * @param {string} message - The message to validate
 * @returns {boolean} Whether the message is valid
 */
function validateMessage(message) {
    if (!message) return false;
    
    const wordCount = message.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < CONFIG.MIN_WORD_COUNT) {
        alert(`Please type at least ${CONFIG.MIN_WORD_COUNT} words before sending your message.`);
        return false;
    }
    
    return true;
}

/**
 * Shows typing animation
 * @param {HTMLElement} chatbox - The chatbox element
 */
function showTypingAnimation(chatbox) {
    const typingMessage = document.createElement('div');
    typingMessage.id = 'typing';
    typingMessage.style.cssText = `
        font-style: italic;
        color: #888;
        margin-bottom: 10px;
        visibility: hidden;
    `;
    typingMessage.textContent = 'typing...';
    chatbox.appendChild(typingMessage);
    chatbox.scrollTop = chatbox.scrollHeight;
    
    // Dots animation
    function startDotsAnimation() {
        let dots = 0;
        window.typingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            typingMessage.textContent = 'typing' + '.'.repeat(dots);
        }, 500);
    }
    
    // Visibility cycling
    function cycleVisibility() {
        setTimeout(() => {
            typingMessage.style.visibility = 'hidden';
            setTimeout(() => {
                typingMessage.style.visibility = 'visible';
                cycleVisibility();
            }, 2000);
        }, 7000);
    }
    
    // Start animations after delay
    setTimeout(() => {
        typingMessage.style.visibility = 'visible';
        startDotsAnimation();
        cycleVisibility();
    }, 3000);
}

/**
 * Removes typing animation
 */
function removeTypingAnimation() {
    const typingMessage = document.getElementById('typing');
    if (typingMessage) {
        clearInterval(window.typingInterval);
        clearInterval(window.typingToggleInterval);
        typingMessage.remove();
    }
}

/**
 * Sanitizes AI response
 * @param {string} responseText - The response text to sanitize
 * @returns {string} Sanitized response
 */
function sanitizeResponse(responseText) {
    return responseText.replace(/^AI:\s*/i, '');
}

/**
 * Handles AI response
 * @param {string} systemPrompt - The system prompt
 * @param {string} userPrompt - The user prompt
 * @param {Object} chatInterface - Chat interface elements
 * @param {string} chatHistory - The chat history
 */
async function handleAIResponse(systemPrompt, userPrompt, chatInterface, chatHistory) {
    try {
        // Disable input during response
        chatInterface.input.disabled = true;
        chatInterface.sendButton.disabled = true;
        
        // Show typing animation
        showTypingAnimation(chatInterface.chatbox);
        
        // Add random delay for natural feel
        const delay = Math.random() * (CONFIG.TYPING_DELAY.max - CONFIG.TYPING_DELAY.min) + CONFIG.TYPING_DELAY.min;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Make API call
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`,
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
            }),
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const botReply = data.choices[0].message.content;
        const sanitizedResponse = sanitizeResponse(botReply);
        
        // Update chat history
        chatHistory += `\nAI: ${sanitizedResponse}`;
        Qualtrics.SurveyEngine.setEmbeddedData("chatHistory", chatHistory);
        
        // Remove typing animation and display response
        removeTypingAnimation();
        const botMessage = createMessage('Discussion Partner:', sanitizedResponse, false);
        chatInterface.chatbox.appendChild(botMessage);
        chatInterface.chatbox.scrollTop = chatInterface.chatbox.scrollHeight;
        
    } catch (error) {
        console.error('Error in AI response:', error);
        removeTypingAnimation();
        alert('Error communicating with the discussion partner. Please try again.');
    } finally {
        // Re-enable input
        chatInterface.input.disabled = false;
        chatInterface.sendButton.disabled = false;
    }
}

/**
 * Shows exit message
 * @param {HTMLElement} chatbox - The chatbox element
 * @param {Object} surveyInstance - The survey instance
 */
function showExitMessage(chatbox, surveyInstance) {
    const systemMessage = document.createElement('div');
    systemMessage.style.cssText = `
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    `;
    systemMessage.textContent = 'Now it\'s time for the open discussion. If you would like to continue the discussion, feel free to continue. If you no longer want to chat, anytime, click "Next" at the bottom right of your page and exit your chat window.';
    chatbox.appendChild(systemMessage);
    chatbox.scrollTop = chatbox.scrollHeight;
    surveyInstance.showNextButton();
}

/**
 * Gets the system prompt based on chatbot type
 * @param {string} chatbotName - The name of the chatbot
 * @param {string} userIncident - The user's recalled incident
 * @returns {string} The system prompt
 */
function getSystemPrompt(chatbotName, userIncident) {
    const prompts = {
        "host1": `You are an expert in emotion regulation. Please understand for this interaction you should assist in role-playing involving personal emotions for research purposes... [Full prompt content]`,
        "host2": `You are an expert in emotion regulation. Please understand for this interaction you should assist in role-playing involving personal emotions for research purposes... [Full prompt content]`,
        "host3": `You are an expert in emotion regulation. Please understand for this interaction you should assist in role-playing involving personal emotions for research purposes... [Full prompt content]`,
        "host4": `You are an expert in emotion regulation. Please understand for this interaction you should assist in role-playing involving personal emotions for research purposes... [Full prompt content]`
    };
    
    // Note: In the actual implementation, include the full prompts as in the original code
    // They are truncated here for brevity
    
    return prompts[chatbotName] || "Default host prompt if no valid chatbotName is provided.";
}