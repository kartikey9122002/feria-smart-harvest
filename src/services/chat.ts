
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types";

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

// Get chat messages between two users
export const getChatMessages = async (currentUserId: string, otherUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    // Filter to only include messages between these two users
    const filteredMessages = data.filter(
      (msg) => 
        (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) || 
        (msg.sender_id === otherUserId && msg.receiver_id === currentUserId)
    );
    
    return filteredMessages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    toast({
      title: "Error",
      description: "Failed to load chat messages",
      variant: "destructive",
    });
    return [];
  }
};

// Send a new chat message
export const sendChatMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    toast({
      title: "Error",
      description: "Failed to send message",
      variant: "destructive",
    });
    return null;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (currentUserId: string, senderId: string) => {
  try {
    const { error } = await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("receiver_id", currentUserId)
      .eq("sender_id", senderId)
      .eq("read", false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return false;
  }
};

// Subscribe to new messages from a specific sender
export const subscribeToMessages = (
  currentUserId: string,
  callback: (message: ChatMessage) => void
) => {
  const channel = supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${currentUserId}`,
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Get a list of users the current user has chatted with
export const getChatUsers = async (currentUserId: string): Promise<User[]> => {
  try {
    const { data: sentMessages, error: sentError } = await supabase
      .from("chat_messages")
      .select("receiver_id")
      .eq("sender_id", currentUserId)
      .distinct();

    const { data: receivedMessages, error: receivedError } = await supabase
      .from("chat_messages")
      .select("sender_id")
      .eq("receiver_id", currentUserId)
      .distinct();

    if (sentError || receivedError) throw sentError || receivedError;

    // Combine unique user IDs
    const userIds = [
      ...new Set([
        ...sentMessages.map(msg => msg.receiver_id),
        ...receivedMessages.map(msg => msg.sender_id)
      ])
    ];

    // Get user details
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (usersError) throw usersError;
    
    return users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email || '',
      role: user.role as 'seller' | 'buyer' | 'admin',
      avatar: user.avatar_url || undefined
    }));
  } catch (error) {
    console.error("Error fetching chat users:", error);
    toast({
      title: "Error",
      description: "Failed to load chat contacts",
      variant: "destructive",
    });
    return [];
  }
};
