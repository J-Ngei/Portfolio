import React, { useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X, Loader } from 'lucide-react';

const BOT_ENDPOINT = import.meta.env.VITE_PORTFOLIO_BOT_URL || 'http://127.0.0.1:8000/chat';

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi! I can answer questions about James's background, projects, and technical focus. Ask me anything about the portfolio.",
  },
];

const PortfolioBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    const history = messages
      .filter(({ role }) => role !== 'system')
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: 'user', content: trimmedInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(BOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedInput,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bot request failed with ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.reply?.trim() || "I’m not sure how to answer that yet.";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Portfolio bot request failed:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'The bot is unavailable right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex animate-bounce items-center gap-1.5 rounded-full border border-teal-100 bg-white py-2 pl-3 pr-3.5 text-sm font-semibold text-teal-700 shadow-lg transition-colors hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700"
            aria-label="Ask the portfolio assistant"
          >
            <Sparkles className="h-4 w-4 text-teal-500 dark:text-teal-400" />
            Ask me anything
          </button>
        )}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xl transition-transform hover:scale-105"
          aria-label={isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant'}
        >
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
          )}
          {isOpen ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[65] flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 to-teal-900 px-4 py-3 text-white dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Portfolio Assistant</p>
                <p className="text-xs text-teal-200">Ask about my work and background</p>
              </div>
            </div>
            <div className="rounded-full bg-teal-500/20 p-1.5 text-teal-200">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="flex max-h-[420px] min-h-[320px] flex-col overflow-y-auto bg-slate-50 p-3 dark:bg-slate-950">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100">
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Thinking…</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3 dark:border-slate-700">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about my projects..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-teal-600 p-2 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PortfolioBot;
