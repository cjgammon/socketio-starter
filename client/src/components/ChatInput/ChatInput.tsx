import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}
