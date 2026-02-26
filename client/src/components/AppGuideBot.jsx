import { useState, useRef, useEffect } from 'react';
import { Bot, X, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const MOCK_RESPONSES = {
    greeting: "Hi there! I'm your AI Career Coach. How can I help you today?",
    dashboard: "You're on the dashboard! Here you can see a summary of your applications. Click 'Add New Job' to track a new application, or 'Export' to download your data.",
    skills: "This is your Skills roadmap. Add skills you want to learn, and click the '+10%' button to quickly track your progress!",
    add_job: "To add a job, click the 'Add New Job' button on your Dashboard. You can fill in the company, role, location, and the date you applied.",
    default: "That's a great question! While I'm just a demo bot right now, in the future I'll connect to OpenAI or Google Gemini to give you real AI resume advice and interview prep!",
};

const AppGuideBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    // Context-aware greeting based on route
    useEffect(() => {
        if (!isOpen) return;
        if (messages.length > 0) return;

        let initialMessage = MOCK_RESPONSES.greeting;
        if (location.pathname === '/dashboard') initialMessage = MOCK_RESPONSES.dashboard;
        if (location.pathname === '/skills') initialMessage = MOCK_RESPONSES.skills;

        setMessages([{ text: initialMessage, isBot: true }]);
    }, [isOpen, location.pathname, messages.length]);

    // Auto-scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages((prev) => [...prev, { text: userMsg, isBot: false }]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            let response = MOCK_RESPONSES.default;
            const lowerInput = userMsg.toLowerCase();

            if (lowerInput.includes('job') || lowerInput.includes('add')) {
                response = MOCK_RESPONSES.add_job;
            } else if (lowerInput.includes('skill')) {
                response = MOCK_RESPONSES.skills;
            }

            setMessages((prev) => [...prev, { text: response, isBot: true }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px] max-h-[70vh] animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold flex items-center gap-2">AI Career Coach <Sparkles size={14} className="text-yellow-300" /></h3>
                                <p className="text-xs text-primary-100">Powered by Mock AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot
                                        ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                                        : 'bg-primary-600 text-white rounded-tr-none shadow-md'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 input h-10 text-sm !rounded-full"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="h-10 w-10 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors shadow-sm"
                            >
                                <Send size={16} className="ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen
                        ? 'bg-white text-slate-500 scale-90 shadow-md'
                        : 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white animate-bounce shadow-primary-500/30'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default AppGuideBot;
