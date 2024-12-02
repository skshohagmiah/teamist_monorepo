'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Paperclip, 
  Smile, 
  UserCircle2, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Bell, 
  Users 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EmojiPicker from 'emoji-picker-react'

// Types for our chat application
interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  role?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  reactions?: string[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: string[];
  messages: ChatMessage[];
}

// Mock data
const mockUsers: User[] = [
  { 
    id: 'user1', 
    name: 'John Doe', 
    avatar: '/placeholder-user.jpg', 
    status: 'online',
    role: 'Developer'
  },
  { 
    id: 'user2', 
    name: 'Jane Smith', 
    avatar: '/placeholder-user2.jpg', 
    status: 'away',
    role: 'Designer'
  },
  { 
    id: 'user3', 
    name: 'Mike Johnson', 
    status: 'offline',
    role: 'Project Manager'
  }
];

const mockChatRooms: ChatRoom[] = [
  {
    id: 'room1',
    name: 'General Team Chat',
    type: 'group',
    members: ['user1', 'user2', 'user3'],
    messages: [
      {
        id: 'msg1',
        userId: 'user1',
        content: 'Hey team, how are we progressing on the project?',
        timestamp: new Date(),
        type: 'text'
      }
    ]
  },
  {
    id: 'room2',
    name: 'John Doe',
    type: 'direct',
    members: ['user1', 'user2'],
    messages: [
      {
        id: 'msg2',
        userId: 'user2',
        content: 'Can you review the design mockups?',
        timestamp: new Date(),
        type: 'text'
      }
    ]
  }
];

export default function ChatPage() {
  const [users] = useState<User[]>(mockUsers);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedRoom) {
      scrollToBottom();
    }
  }, [selectedRoom]);

  // Send message
  const sendMessage = () => {
    if (!selectedRoom || !messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg${selectedRoom.messages.length + 1}`,
      userId: 'user1', // Currently logged in user
      content: messageInput,
      timestamp: new Date(),
      type: 'text'
    };

    const updatedRooms = chatRooms.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, messages: [...room.messages, newMessage] }
        : room
    );

    setChatRooms(updatedRooms);
    setSelectedRoom(updatedRooms.find(room => room.id === selectedRoom.id) || null);
    setMessageInput('');
  };

  // Filter rooms and users
  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative border border-black rounded-sm overflow-hidden text-black">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search chats" 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Chat Rooms List */}
        <div className="space-y-2 divide-y-2">
          {filteredRooms.map(room => (
            <div 
              key={room.id} 
              className={`
                flex items-center p-2 rounded-lg cursor-pointer
                ${selectedRoom?.id === room.id ? 'bg-blue-100' : 'hover:bg-gray-200'}
              `}
              onClick={() => setSelectedRoom(room)}
            >
              {room.type === 'group' ? (
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5" />
                </div>
              ) : (
                <Avatar className="mr-3">
                  <AvatarImage src={users.find(u => u.id !== 'user1' && room.members.includes(u.id))?.avatar} />
                  <AvatarFallback>
                    {room.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="font-medium">{room.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {room.messages[room.messages.length - 1]?.content}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {room.messages[room.messages.length - 1]?.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>

        {/* Create Group Chat Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Users className="mr-2" /> Create Group Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
            </DialogHeader>
            {/* Group creation form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-purple-50 ">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
              <div className="flex items-center">
                {selectedRoom.type === 'group' ? (
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5" />
                  </div>
                ) : (
                  <Avatar className="mr-3">
                    <AvatarImage src={users.find(u => u.id !== 'user1' && selectedRoom.members.includes(u.id))?.avatar} />
                    <AvatarFallback>
                      {selectedRoom.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="font-medium">{selectedRoom.name}</div>
                  <div className="text-xs text-gray-500">
                    {selectedRoom.type === 'group' 
                      ? `${selectedRoom.members.length} members` 
                      : users.find(u => u.id !== 'user1' && selectedRoom.members.includes(u.id))?.status
                    }
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {/* Additional room options */}
                    <Button variant="ghost" className="w-full">
                      Room Details
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Mute Notifications
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedRoom.messages.map((message) => {
                const sender = users.find(u => u.id === message.userId);
                const isCurrentUser = message.userId === 'user1';

                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="mr-3">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`
                        max-w-[70%] p-3 rounded-lg 
                        ${isCurrentUser 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-black'}
                      `}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-semibold mb-1">{sender?.name}</div>
                      )}
                      {message.content}
                      <div className="text-xs mt-1 opacity-70 text-right">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4 flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <EmojiPicker 
                    onEmojiClick={(e) => setMessageInput(prev => prev + e.emoji)}
                  />
                </PopoverContent>
              </Popover>
              <Input 
                placeholder="Type a message" 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="w-5 h-5 mr-2" /> Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600">
                Select a chat to start messaging
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}