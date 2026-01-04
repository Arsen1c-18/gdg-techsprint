import { useState } from "react";
import { BookOpen, Sparkles, Send, Copy, Check, X } from "lucide-react";
import "./App.css";

export default function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const generatePrompt = async (retryCount = 0) => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(false);
    if (retryCount === 0) setResult("");

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Please set your Gemini API key in a .env file (VITE_GEMINI_API_KEY=your_key_here)"
        );
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Explain ${topic} simply and clearly for a student.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      

      if (res.status === 429) {
        if (retryCount < 2) {
          await new Promise((r) => setTimeout(r, 2000));
          return generatePrompt(retryCount + 1);
        }
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `API error: ${res.status} - ${
            errorData.error?.message || res.statusText
          }`
        );
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No response from API.");

      setResult(text);
      setError(false);
    } catch (err) {
      setError(true);
      setResult(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearResult = () => {
    setResult("");
    setError(false);
  };

  const formatText = (text) => {
    if (!text || error) return text;

    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((para, idx) => {
      let formatted = para.trim();
      if (!formatted) return null;
      
      // Format bold text (**text**)
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
      
      // Format italic text (*text* but not **text**)
      formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-gray-200">$1</em>');
      
      // Check for "In short:" or summary sections
      const isSummary = /^(In short|Summary|To summarize|In summary)[:：]/i.test(formatted);
      
      // Format numbered lists (1. item)
      if (/^\d+\.\s/.test(formatted)) {
        const items = formatted.split(/\n(?=\d+\.\s)/);
        return (
          <ol key={idx} className="list-decimal list-inside space-y-3 my-4 ml-6">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^\d+\.\s/, '');
              return (
                <li key={i} className="text-gray-300 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: cleanItem }} />
                </li>
              );
            })}
          </ol>
        );
      }
      
      // Format bullet points (- or * at start, but not bold/italic)
      if (/^[-*]\s/.test(formatted) && !formatted.startsWith('**')) {
        const items = formatted.split(/\n(?=[-*]\s)/);
        return (
          <ul key={idx} className="list-disc list-inside space-y-3 my-4 ml-6">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^[-*]\s/, '');
              return (
                <li key={i} className="text-gray-300 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: cleanItem }} />
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Check if it's a heading (starts with #)
      if (formatted.startsWith('#')) {
        const level = formatted.match(/^#+/)?.[0]?.length || 1;
        const headingText = formatted.replace(/^#+\s*/, '');
        const headingLevel = Math.min(level, 3);
        
        if (headingLevel === 1) {
          return (
            <h1 key={idx} className="font-serif font-bold text-purple-300 mt-6 mb-3 text-2xl">
              {headingText}
            </h1>
          );
        } else if (headingLevel === 2) {
          return (
            <h2 key={idx} className="font-serif font-bold text-purple-300 mt-6 mb-3 text-xl">
              {headingText}
            </h2>
          );
        } else {
          return (
            <h3 key={idx} className="font-serif font-bold text-purple-300 mt-6 mb-3 text-lg">
              {headingText}
            </h3>
          );
        }
      }
      
      // Regular paragraph with special styling for summaries
      const paragraphClass = isSummary 
        ? "text-gray-200 leading-relaxed mb-4 p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg italic"
        : "text-gray-300 leading-relaxed mb-4";
      
      return (
        <p key={idx} className={paragraphClass} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" aria-hidden="true"></div>

      <main className="w-full max-w-3xl relative z-10">
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            AI Study Helper
          </h1>
          <p className="text-gray-400 text-base md:text-lg">Ask anything, learn everything</p>
        </header>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-gray-800/50 animate-slide-up">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="What would you like to learn about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && topic.trim()) {
                  generatePrompt();
                }
              }}
              disabled={loading}
              aria-label="Enter topic to learn about"
              className="flex-1 px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              onClick={generatePrompt}
              disabled={loading || !topic.trim()}
              aria-label="Generate explanation"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus-visible-ring"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Thinking…</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" aria-hidden="true" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !result && (
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-800/50 animate-slide-up">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-purple-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 text-lg animate-pulse">Generating your explanation...</p>
              <div className="mt-4 w-full max-w-md space-y-2">
                <div className="h-4 bg-gray-800/50 rounded skeleton"></div>
                <div className="h-4 bg-gray-800/50 rounded skeleton w-5/6"></div>
                <div className="h-4 bg-gray-800/50 rounded skeleton w-4/6"></div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className={`bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border animate-slide-up ${
            error ? "border-red-500/50" : "border-gray-800/50"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {error ? (
                  <X className="w-5 h-5 text-red-400" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-5 h-5 text-purple-400" aria-hidden="true" />
                )}
                <h2 className="text-xl font-semibold text-gray-200">
                  {error ? "Error" : "Here's what I found:"}
                </h2>
              </div>
              <div className="flex gap-2">
                {!error && (
                  <button
                    onClick={copyToClipboard}
                    aria-label="Copy to clipboard"
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-200 focus-visible-ring"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" aria-hidden="true" />
                    ) : (
                      <Copy className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                )}
                <button
                  onClick={clearResult}
                  aria-label="Clear result"
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-200 focus-visible-ring"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={`result-content ${
              error ? "text-red-300" : ""
            }`}>
              {error ? (
                <p className="text-red-300 leading-relaxed">{result}</p>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {formatText(result)}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
