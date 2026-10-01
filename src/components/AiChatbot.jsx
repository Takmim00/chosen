import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  FiSend,
  FiKey,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiCpu,
  FiExternalLink,
  FiInfo,
  FiUser,
  FiMessageSquare,
  FiRefreshCw,
} from "react-icons/fi";
import {
  sendChatMessage,
  getApiKey,
  setApiKey as saveApiKeyService,
  clearApiKey as removeApiKeyService,
  getSelectedModel,
  setSelectedModel as saveModelService,
  AVAILABLE_MODELS,
} from "../services/gemini";

const QUICK_PROMPTS = [
  "How do I create an effective job posting on ChaskiX?",
  "Write a winning proposal for a web development project",
  "What are the best pricing strategies for freelance services?",
  "How can I attract high-value clients to my business?",
];

const INITIAL_WELCOME = {
  id: "welcome",
  role: "assistant",
  content: `👋 **Hello! I'm ChaskiX AI Assistant**, powered by Google Gemini.

I'm here to help you get the most out of ChaskiX:
- **For Clients**: Craft compelling job requests, define budgets, and find top talent.
- **For Providers**: Write winning proposals, optimize your profile, and grow your earnings.
- **Any Task**: Brainstorming, drafting emails, writing code, or answering questions.

How can I assist you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const AiChatbot = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chaskix_chat_messages");
      return saved ? JSON.parse(saved) : [INITIAL_WELCOME];
    } catch {
      return [INITIAL_WELCOME];
    }
  });

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-3.8-flash");
  const [errorBanner, setErrorBanner] = useState(null);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Keep page fixed at top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Check API key and active model on mount
  useEffect(() => {
    const key = getApiKey();
    setHasApiKey(Boolean(key));
    setApiKeyInput(key);
    setSelectedModel(getSelectedModel());
  }, []);

  // Save messages to localStorage for session persistence
  useEffect(() => {
    try {
      localStorage.setItem("chaskix_chat_messages", JSON.stringify(messages));
    } catch (err) {
      console.warn("Could not save chat history to localStorage", err);
    }
  }, [messages]);

  // Smooth scroll inside messages container only (NEVER scrolls the window/page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSaveApiKey = (e) => {
    e?.preventDefault();
    const trimmed = apiKeyInput.trim();
    saveApiKeyService(trimmed);
    const key = getApiKey();
    setHasApiKey(Boolean(key));
    setShowKeyModal(false);
    setErrorBanner(null);
  };

  const handleClearApiKey = () => {
    removeApiKeyService();
    setApiKeyInput("");
    setHasApiKey(Boolean(getApiKey()));
    setShowKeyModal(false);
  };

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    saveModelService(newModel);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear this conversation history?")) {
      setMessages([INITIAL_WELCOME]);
      localStorage.removeItem("chaskix_chat_messages");
      setErrorBanner(null);
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const userText = (textToSend || inputMessage).trim();
    if (!userText || loading) return;

    // Check if key is configured
    const activeKey = getApiKey();
    if (!activeKey) {
      setErrorBanner(
        "Please provide a Gemini API Key to chat. Click 'API Key Settings' above to enter your key or configure it in .env."
      );
      setShowKeyModal(true);
      return;
    }

    const newMsg = {
      id: "user-" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, newMsg];
    setMessages(nextHistory);
    setInputMessage("");
    setErrorBanner(null);
    setLoading(true);

    try {
      // Filter out welcome message from context sent to API to save tokens
      const apiHistory = nextHistory
        .filter((m) => m.id !== "welcome")
        .slice(-8); // keep last 8 messages for context

      const responseText = await sendChatMessage(
        apiHistory.slice(0, -1),
        userText,
        selectedModel
      );

      const botMsg = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setErrorBanner(err.message || "Failed to generate response. Please try again.");

      const errMsg = {
        id: "err-" + Date.now(),
        role: "assistant",
        isError: true,
        content: `⚠️ **Error**: ${err.message || "An unexpected error occurred."}\n\n*Tip: Check your API key or try switching models in the top bar.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-stone-50 via-white to-stone-100 p-2 sm:p-4 overflow-hidden">
      <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 h-full bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        
        {/* Header Bar */}
        <header className="px-4 sm:px-5 py-3.5 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8A893F] to-[#b3b259] flex items-center justify-center text-white shadow-md">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-800">ChaskiX AI Assistant</h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#8A893F]/15 text-[#848239]">
                  Gemini
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Talent matching & marketplace assistant
              </p>
            </div>
          </div>

          {/* Right actions: Model Selector, Key status & settings */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5 text-xs bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-700">
              <FiCpu className="text-[#848239]" />
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
                title="Select Gemini Model"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Status / Config Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                hasApiKey
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse"
              }`}
              title="Configure Gemini API Key"
            >
              <FiKey className="w-3.5 h-3.5" />
              <span>{hasApiKey ? "API Connected" : "Set API Key"}</span>
            </button>

            {/* Clear History Button */}
            <button
              onClick={handleClearHistory}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
              title="Clear chat history"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Global Error or Notice Banner */}
        {errorBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-amber-700 hover:text-amber-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Messages Scroll Area - Scroll is isolated here with overscroll-contain */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf9f6] overscroll-contain"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm ${
                    isUser
                      ? "bg-[#FFAA01] text-black"
                      : msg.isError
                      ? "bg-red-500 text-white"
                      : "bg-[#8A893F] text-white"
                  }`}
                >
                  {isUser ? <FiUser className="w-4 h-4" /> : <FiMessageSquare className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 shadow-sm text-sm ${
                      isUser
                        ? "bg-[#8A893F] text-white rounded-tr-none"
                        : msg.isError
                        ? "bg-red-50 border border-red-200 text-red-900 rounded-tl-none"
                        : "bg-white border border-stone-200/90 text-stone-800 rounded-tl-none"
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-stone prose-headings:text-stone-900 prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-code:text-[#848239] prose-code:bg-stone-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:my-2 prose-li:my-0.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Message Footer (Timestamp & Copy) */}
                  <div
                    className={`flex items-center gap-2 text-[11px] text-stone-400 px-1 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-stone-700 transition-colors p-0.5"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <FiCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing / Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8A893F] text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                <FiMessageSquare className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2 text-stone-500 text-sm">
                <span className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-[#8A893F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-[#8A893F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-[#8A893F] rounded-full animate-bounce"></span>
                </span>
                <span className="text-xs text-stone-500 font-medium ml-2">
                  ChaskiX AI is thinking...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 sm:px-5 py-2.5 bg-stone-50/80 border-t border-stone-200 shrink-0">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1.5">
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="text-xs bg-white hover:bg-stone-100 hover:border-[#8A893F] text-stone-700 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs transition-all text-left disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar - Fixed at bottom of chat card */}
        <footer className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask ChaskiX AI anything... (Press Enter to send, Shift+Enter for newline)"
                rows={1}
                className="w-full resize-none rounded-xl border border-stone-300 focus:border-[#8A893F] focus:ring-2 focus:ring-[#8A893F]/20 px-4 py-2.5 sm:py-3 text-sm text-stone-800 focus:outline-none placeholder-stone-400 transition-all max-h-28"
                style={{
                  minHeight: "44px",
                  height: "auto",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="h-11 sm:h-12 px-4 sm:px-5 bg-[#8A893F] hover:bg-[#7a7935] disabled:bg-stone-300 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <FiRefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-sm">Send</span>
                  <FiSend className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>Powered by Google Gemini API</span>
            <span className="hidden sm:inline">Vercel-ready & responsive</span>
          </div>
        </footer>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-[#8A893F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiKey className="w-5 h-5" />
                <h3 className="font-bold text-lg">Gemini API Key Settings</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/80 hover:text-white font-bold text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveApiKey} className="p-6 space-y-4">
              <p className="text-sm text-stone-600 leading-relaxed">
                Connect your Google Gemini API key to enable live AI responses. The key is stored safely in your browser or can be set via <code className="bg-stone-100 px-1 py-0.5 rounded text-[#848239]">VITE_GEMINI_API_KEY</code> in your environment.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#8A893F] focus:ring-2 focus:ring-[#8A893F]/20 font-mono"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                <FiInfo className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  Don't have an API key yet? Get one 100% free from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline inline-flex items-center gap-0.5 text-amber-950"
                  >
                    Google AI Studio <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {hasApiKey && (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-auto"
                  >
                    Remove Key
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#8A893F] hover:bg-[#7a7935] rounded-lg shadow-sm transition-colors"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
