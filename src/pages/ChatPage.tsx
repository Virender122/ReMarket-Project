import Navbar from "@/components/Navbar";
import { conversations, chatMessages } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, ArrowLeft, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ChatPage = () => {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Please <a href="/login" className="text-primary underline">log in</a> to access chat.</p>
      </div>
    );
  }

  const [selectedChat, setSelectedChat] = useState<string | null>("c1");
  const [message, setMessage] = useState("");
  const [showList, setShowList] = useState(true);

  const selected = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* Conversation List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col",
          selectedChat && !showList ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9 bg-muted/50 border-transparent" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { setSelectedChat(conv.id); setShowList(false); }}
                className={cn(
                  "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                  selectedChat === conv.id && "bg-muted/70"
                )}
              >
                <div className="relative">
                  <img src={conv.user.avatar} alt={conv.user.name} className="h-12 w-12 rounded-full bg-muted" />
                  {conv.user.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{conv.user.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.productTitle}</p>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="gradient-primary border-0 text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selectedChat || showList ? "hidden md:flex" : "flex"
        )}>
          {selected ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowList(true)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <img src={selected.user.avatar} alt={selected.user.name} className="h-10 w-10 rounded-full bg-muted" />
                  {selected.user.online && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{selected.user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selected.user.online ? "Online" : "Offline"} · {selected.productTitle}
                  </p>
                </div>
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5",
                      msg.sender === "me"
                        ? "gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>{msg.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && setMessage("")}
                  />
                  <Button className="gradient-primary border-0 text-primary-foreground" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
