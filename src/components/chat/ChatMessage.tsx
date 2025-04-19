
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  sender: User;
  timestamp: string;
  isSender: boolean;
}

const ChatMessage = ({ content, sender, timestamp, isSender }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 mb-4 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatar} alt={sender.name} />
        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
