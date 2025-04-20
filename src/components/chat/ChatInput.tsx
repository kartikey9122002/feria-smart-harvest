
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { isListening, startListening } = useVoiceSearch({
    onResult: (transcript) => {
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
    },
    onError: (error) => {
      toast({
        title: "Voice Input Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="min-h-[50px] max-h-[100px]"
      />
      <div className="flex flex-col gap-2">
        <Button 
          type="button"
          size="icon"
          variant="outline"
          onClick={startListening}
          className={isListening ? "bg-primary text-primary-foreground" : ""}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
