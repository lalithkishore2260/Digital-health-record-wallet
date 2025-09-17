import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  file?: string;
}

interface ChatbotProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

const API_KEY = "AIzaSyCpaqJPgz6HH_H5-grNR1ShLd2s-aCdVCQ";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const PatientChatbotHTML = ({ isMinimized, onToggleMinimize, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hey there! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fileData, setFileData] = useState<{ base64: string; mime: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64String = (ev.target?.result as string).split(",")[1];
      setFileData({ base64: base64String, mime: file.type });
    };
    reader.readAsDataURL(file);
  };
  const cancelFile = () => setFileData(null);

  // Bot response
  const fetchBotResponse = async (userMessage: string) => {
    try {
      const body = {
        contents: [
          {
            role: "user",
            parts: [
              { text: userMessage },
              ...(fileData ? [{ inline_data: { mime_type: fileData.mime, data: fileData.base64 } }] : []),
            ],
          },
        ],
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message);

      const botText = data.candidates[0].content.parts[0].text.trim();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: botText,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: `⚠️ ${err.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setFileData(null);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      file: fileData ? `data:${fileData.mime};base64,${fileData.base64}` : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    fetchBotResponse(inputMessage);
  };

  return (
    <div className="chatbot_popup fixed bottom-20 right-4 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-50">
      {/* Header */}
      <div className="chat_header flex justify-between items-center p-2 border-b">
        <h2 className="text-lg font-semibold">Chatbot</h2>
        <div className="flex space-x-2">
          <button onClick={onToggleMinimize}>{isMinimized ? "🔼" : "🔽"}</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="chat_body flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`message flex ${msg.type === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`p-2 rounded max-w-[70%] ${msg.type === "bot" ? "bg-gray-200" : "bg-blue-500 text-white"}`}>
                  {msg.content}
                  {msg.file && <img src={msg.file} alt="uploaded" className="mt-2 max-h-32 rounded" />}
                </div>
              </div>
            ))}

            {isTyping && <div className="text-gray-500 text-sm">Bot is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="chat_footer p-2 border-t">
            <form
              className="chat_form flex space-x-2 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input type="file" id="file_input" className="hidden" onChange={handleFileChange} />
              <button type="button" onClick={() => document.getElementById("file_input")?.click()}>📎</button>

              {fileData && (
                <div className="relative">
                  <img src={`data:${fileData.mime};base64,${fileData.base64}`} alt="preview" className="h-10 w-10 object-cover rounded" />
                  <button
                    type="button"
                    onClick={cancelFile}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              <textarea
                className="flex-1 border rounded p-1"
                placeholder="Message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                rows={1}
              />
              <button type="submit" className="bg-blue-600 text-white px-3 rounded">Send</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
