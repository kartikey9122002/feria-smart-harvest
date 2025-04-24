
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "./ChatInterface";
import { useState } from "react";

interface ChatListProps {
  users: User[];
}

const ChatList = ({ users }: ChatListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No chat history found
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedUser(user)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
      {selectedUser && <ChatInterface otherUser={selectedUser} />}
    </div>
  );
};

export default ChatList;
