
import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { 
  getChatMessages, 
  sendChatMessage, 
  markMessagesAsRead, 
  subscribeToMessages, 
  ChatMessage as ChatMessageType 
} from "@/services/chat";
import { useToast } from "@/components/ui/use-toast";

interface ChatInterfaceProps {
  otherUser: User;
}

const ChatInterface = ({ otherUser }: ChatInterfaceProps) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch chat history when the chat is opened
  useEffect(() => {
    if (isOpen && profile) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const fetchedMessages = await getChatMessages(profile.id, otherUser.id);
          setMessages(fetchedMessages);
          // Mark messages from the other user as read
          await markMessagesAsRead(profile.id, otherUser.id);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMessages();
    }
  }, [isOpen, profile, otherUser]);

  // Subscribe to new messages
  useEffect(() => {
    if (!profile) return;

    const unsubscribe = subscribeToMessages(profile.id, (newMessage) => {
      // Only add messages from this conversation
      if (newMessage.sender_id === otherUser.id) {
        setMessages((prev) => [...prev, newMessage]);
        // Mark as read if the chat is open
        if (isOpen) {
          markMessagesAsRead(profile.id, otherUser.id);
        } else {
          // Show notification if chat is not open
          toast({
            title: `New message from ${otherUser.name}`,
            description: newMessage.content,
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [profile, otherUser, isOpen, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!profile) return;
    
    setIsSending(true);
    try {
      const newMessage = await sendChatMessage(profile.id, otherUser.id, content);
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!profile) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Chat with {otherUser.name}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    sender={{
                      id: message.sender_id,
                      name: message.sender_id === profile.id ? profile.name : otherUser.name,
                      email: message.sender_id === profile.id ? profile.email : otherUser.email || "",
                      role: message.sender_id === profile.id ? profile.role : otherUser.role,
                    }}
                    timestamp={message.created_at}
                    isSender={message.sender_id === profile.id}
                  />
                ))}
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatInterface;
