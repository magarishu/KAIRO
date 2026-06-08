"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, TerminalSquare, Command } from "lucide-react";
import { askSupportBot } from "@/lib/actions/support";

type Message = {
  role: "user" | "bot";
  content: string;
};

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi there! I'm the Kairo Support Bot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Skip the very first greeting message (index 0) because Gemini requires history to start with a 'user' message.
      // Also slice off the last message (which is the current user prompt being sent).
      const historyToPass = newMessages.slice(1, -1).map(msg => ({
        role: msg.role === "bot" ? "model" : "user",
        content: msg.content
      }));
      
      const result = await askSupportBot(userMessage, historyToPass);
      
      if (result.success) {
        setMessages(prev => [...prev, { role: "bot", content: result.text! }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", content: result.error! }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-purple-500 hover:bg-purple-400 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group overflow-hidden shadow-lg"
        title="Chat with Support"
      >
        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
        <MessageCircle className="w-6 h-6 relative z-10" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[350px] sm:w-[400px] h-[550px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 p-5 flex justify-between items-center relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <TerminalSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono tracking-widest uppercase">Kairo Support</h3>
            <p className="text-[9px] text-emerald-400 flex items-center gap-1.5 font-mono tracking-widest uppercase mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span> Online
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-white/10 text-[#888888] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-transparent scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === 'user' ? 'bg-white/5 border-white/10 text-white' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <TerminalSquare className="w-4 h-4" />}
            </div>
            <div className={`max-w-[75%] rounded-xl p-4 text-[13px] leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-purple-500/20 border border-purple-500/30 text-white rounded-tr-sm' 
                : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <TerminalSquare className="w-4 h-4" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-sm p-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-3 relative">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="flex-1 relative">
          <Command className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your command..."
            className="w-full bg-[#111113] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-[#888888] placeholder:font-mono focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center hover:bg-purple-400 disabled:opacity-50 disabled:bg-white/5 disabled:border disabled:border-white/10 disabled:text-[#888888] transition-all shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:shadow-none"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

    </div>
  );
}
