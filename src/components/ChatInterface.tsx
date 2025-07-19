import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Heart, Smile } from "lucide-react";

interface ChatInterfaceProps {
  roomId: string;
  partner: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  timestamp: Date;
  reaction?: string;
}

export const ChatInterface = ({ roomId, partner }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to your SoulRoom! 💕',
      sender: 'partner',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      text: 'I love this intimate space we have together',
      sender: 'me',
      timestamp: new Date(Date.now() - 30000),
      reaction: '❤️',
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate partner response
    setTimeout(() => {
      const responses = [
        "I feel the same way 💝",
        "This is such a special place for us",
        "I love sharing this moment with you",
        "Your words warm my heart 🌟",
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'partner',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    ));
  };

  return (
    <Card className="flex flex-col h-[600px] warm-glow">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse-soft" />
          <span className="font-medium text-foreground">Chatting with {partner}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] group`}>
              <div
                className={`p-3 rounded-2xl soul-transition ${
                  message.sender === 'me'
                    ? 'sunset-gradient text-background ml-4'
                    : 'bg-card text-foreground mr-4'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.reaction && (
                  <div className="mt-2 text-lg">{message.reaction}</div>
                )}
              </div>
              
              <div className={`flex items-center mt-1 space-x-2 ${
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {!message.reaction && (
                  <div className="opacity-0 group-hover:opacity-100 soul-transition flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => addReaction(message.id, '❤️')}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => addReaction(message.id, '😊')}
                    >
                      <Smile className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border/20">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            className="sunset-gradient hover:scale-105 soul-transition text-background"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};