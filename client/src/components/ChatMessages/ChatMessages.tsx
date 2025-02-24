interface ChatMessagesProps {
  messages: string[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div>
      <h3>Received Messages:</h3>
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
}
