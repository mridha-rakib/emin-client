"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import {
    Search,
    Send,
    Mic,
    MicOff,
    MoreVertical,
    Phone,
    PhoneOff,
    Video,
    Paperclip,
    Smile,
    CheckCheck,
    ArrowLeft,
    Plus,
    Circle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest, ApiPage, apiUrl } from "@/lib/api";

type ConversationView = {
    id: string;
    kind: "direct" | "support";
    peerId: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
};

type CallKind = "audio" | "video";
type CallPhase = "idle" | "calling" | "incoming" | "active";
type CallSignal = {
    type: "offer" | "answer" | "ice" | "hangup" | "reject";
    conversationId: string;
    fromUserId: string;
    toUserId: string;
    kind?: CallKind;
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
};

type ConversationApi = {
    _id: string;
    participants?: string[];
    lastMessage?: { text?: string; createdAt?: string };
    updatedAt?: string;
};

type UserApi = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
};

type ChatMessage = {
    _id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: string;
};

type SupportMessageApi = {
    _id?: string;
    senderId?: string;
    senderRole?: string;
    message: string;
    createdAt?: string;
};

type SupportTicketApi = {
    _id: string;
    subject: string;
    userId?: string;
    messages?: SupportMessageApi[];
    updatedAt?: string;
};

const supportName = (subject: string) => `Support · ${subject}`;

const toSupportMessages = (ticket: SupportTicketApi): ChatMessage[] =>
    (ticket.messages ?? []).map((item, index) => ({
        _id: String(item._id || `${ticket._id}-${index}`),
        conversationId: ticket._id,
        senderId: item.senderRole === "admin" || item.senderRole === "guest" ? String(item.senderId || "support") : String(item.senderId || ""),
        text: item.message,
        createdAt: item.createdAt || "",
    }));

const toSupportChat = (ticket: SupportTicketApi): ConversationView => {
    const messages = ticket.messages ?? [];
    const last = messages[messages.length - 1];
    return {
        id: ticket._id,
        kind: "support",
        peerId: "",
        name: supportName(ticket.subject),
        avatar: "",
        lastMessage: last?.message || ticket.subject,
        time: formatMessageTime(last?.createdAt || ticket.updatedAt),
        unread: 0,
    };
};

const isObjectId = (value: string | null) => Boolean(value && /^[a-f\d]{24}$/i.test(value));
const getCurrentUserId = () => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("user_id");
    return isObjectId(stored) ? stored as string : "";
};

const initialsFor = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "C";

function PersonAvatar({ name, avatar, selected = false }: { name: string; avatar: string; selected?: boolean }) {
    return (
        <div className={cn(
            "flex h-full w-full items-center justify-center bg-[#17b9c1]/10 text-sm font-black text-[#17b9c1]",
            selected && "bg-white/10 text-white"
        )}>
            {avatar ? (
                <Image src={avatar} unoptimized={isStoredUpload(avatar)} alt={name} width={56} height={56} className="object-cover w-full h-full" />
            ) : initialsFor(name)}
        </div>
    );
}

const formatMessageTime = (createdAt?: string) => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MessagesPage() {
    const { t } = useTranslation();
    const [conversations, setConversations] = useState<ConversationView[]>([]);
    const [selectedChat, setSelectedChat] = useState<ConversationView | null>(null);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const [messagesByConversation, setMessagesByConversation] = useState<Record<string, ChatMessage[]>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [callPhase, setCallPhase] = useState<CallPhase>("idle");
    const [callKind, setCallKind] = useState<CallKind>("audio");
    const [callName, setCallName] = useState("");
    const [callNotice, setCallNotice] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
    const activePeerRef = useRef("");
    const activeConversationRef = useRef("");
    const incomingRef = useRef<CallSignal | null>(null);
    const conversationsRef = useRef<ConversationView[]>([]);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const onCallSignalRef = useRef<(signal: CallSignal) => void>(() => undefined);
    conversationsRef.current = conversations;
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const currentUserId = useMemo(getCurrentUserId, []);
    const selectedMessages = selectedChat ? messagesByConversation[selectedChat.id] || [] : [];
    const visibleConversations = conversations.filter((chat) =>
        chat.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    useEffect(() => {
        const socket = io(apiUrl, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            const userId = getCurrentUserId();
            if (userId) socket.emit("joinUser", { userId });
        });
        socket.on("disconnect", () => setIsConnected(false));
        socket.on("callSignal", (signal: CallSignal) => onCallSignalRef.current(signal));
        socket.on("supportTicket", (ticket: SupportTicketApi) => {
            const userId = getCurrentUserId();
            if (!ticket?._id || (ticket.userId && String(ticket.userId) !== userId)) return;
            const chat = toSupportChat(ticket);
            setConversations((current) => current.some((item) => item.id === chat.id) ? current : [chat, ...current]);
            setMessagesByConversation((current) => ({ ...current, [ticket._id]: toSupportMessages(ticket) }));
        });
        socket.on("supportMessage", (payload: { ticketId?: string; userId?: string; subject?: string; message?: SupportMessageApi }) => {
            const userId = getCurrentUserId();
            const ticketId = payload?.ticketId ? String(payload.ticketId) : "";
            const incoming = payload?.message;
            if (!ticketId || !incoming || (payload.userId && String(payload.userId) !== userId)) return;
            const chatMessage: ChatMessage = {
                _id: String(incoming._id || `${ticketId}-${Date.now()}`),
                conversationId: ticketId,
                senderId: incoming.senderRole === "admin" ? String(incoming.senderId || "support") : String(incoming.senderId || ""),
                text: incoming.message,
                createdAt: incoming.createdAt || new Date().toISOString(),
            };
            setMessagesByConversation((current) => {
                const existing = current[ticketId] || [];
                if (existing.some((item) => item._id === chatMessage._id)) return current;
                return { ...current, [ticketId]: [...existing, chatMessage] };
            });
            setConversations((current) => {
                const chat: ConversationView = {
                    id: ticketId,
                    kind: "support",
                    peerId: "",
                    name: supportName(payload.subject || "Support"),
                    avatar: "",
                    lastMessage: incoming.message,
                    time: formatMessageTime(chatMessage.createdAt),
                    unread: 0,
                };
                if (!current.some((item) => item.id === ticketId)) return [chat, ...current];
                return current.map((item) => item.id === ticketId ? { ...item, lastMessage: chat.lastMessage, time: chat.time } : item);
            });
        });
        socket.on("messageCreated", (incoming: ChatMessage) => {
            setMessagesByConversation((current) => {
                const existing = current[incoming.conversationId] || [];
                if (existing.some((item) => item._id === incoming._id)) return current;
                return {
                    ...current,
                    [incoming.conversationId]: [...existing, incoming],
                };
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) return;
        Promise.all([
            apiRequest<ApiPage<ConversationApi>>("/conversations?page=1&limit=100").catch(() => ({ items: [] as ConversationApi[] })),
            apiRequest<SupportTicketApi[]>(`/support-tickets/mine?userId=${userId}`).catch(() => [] as SupportTicketApi[]),
        ])
            .then(async ([data, tickets]) => {
                const mine = data.items.filter((item) => (item.participants ?? []).map(String).includes(userId));
                const views = await Promise.all(mine.map(async (item) => {
                    const otherId = (item.participants ?? []).map(String).find((id) => id !== userId);
                    let name = "Conversation";
                    let avatar = "";
                    if (otherId && isObjectId(otherId)) {
                        try {
                            const user = await apiRequest<UserApi>(`/users/${otherId}`);
                            name = [user.firstName, user.lastName].filter(Boolean).join(" ") || name;
                            avatar = user.avatar || "";
                        } catch {
                            name = "Conversation";
                        }
                    }
                    return {
                        id: item._id,
                        kind: "direct" as const,
                        peerId: otherId || "",
                        name,
                        avatar,
                        lastMessage: item.lastMessage?.text || "No messages yet",
                        time: formatMessageTime(item.lastMessage?.createdAt || item.updatedAt),
                        unread: 0,
                    };
                }));
                const supportViews = tickets.map(toSupportChat);
                const combined = [...views, ...supportViews];
                setMessagesByConversation((current) => {
                    const next = { ...current };
                    tickets.forEach((ticket) => {
                        next[ticket._id] = toSupportMessages(ticket);
                    });
                    return next;
                });
                setConversations(combined);
                setSelectedChat((current) => combined.find((chat) => chat.id === current?.id) ?? combined[0] ?? null);
            })
            .catch(() => {
                setConversations([]);
                setSelectedChat(null);
            });
    }, []);

    useEffect(() => {
        if (!selectedChat || selectedChat.kind === "support") return;
        socketRef.current?.emit("joinConversation", { conversationId: selectedChat.id });
        apiRequest<ApiPage<ChatMessage>>(`/messages?conversationId=${selectedChat.id}&page=1&limit=100`)
            .then((data) => {
                setMessagesByConversation((current) => ({
                    ...current,
                    [selectedChat.id]: [...data.items].reverse(),
                }));
            })
            .catch(() => {
                setMessagesByConversation((current) => ({ ...current, [selectedChat.id]: current[selectedChat.id] || [] }));
            });
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedMessages.length, selectedChat?.id]);

    useEffect(() => {
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
    }, [localStream, remoteStream, callPhase]);

    const sendSignal = (signal: Omit<CallSignal, "fromUserId"> & { fromUserId?: string }) => {
        socketRef.current?.emit("callSignal", { ...signal, fromUserId: currentUserId });
    };

    const stopCallMedia = () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        peerRef.current?.close();
        peerRef.current = null;
        pendingIceRef.current = [];
        activePeerRef.current = "";
        activeConversationRef.current = "";
        incomingRef.current = null;
        setLocalStream(null);
        setRemoteStream(null);
        setMuted(false);
        setCallPhase("idle");
    };

    const createPeer = (peerId: string, conversationId: string) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        peer.onicecandidate = (event) => {
            if (!event.candidate) return;
            sendSignal({
                type: "ice",
                conversationId,
                toUserId: peerId,
                candidate: event.candidate.toJSON(),
            });
        };
        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            setCallPhase("active");
        };
        peerRef.current = peer;
        return peer;
    };

    const attachLocalStream = async (kind: CallKind, peer: RTCPeerConnection) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: kind === "video" });
        localStreamRef.current = stream;
        setLocalStream(stream);
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        return stream;
    };

    const applyRemoteDescription = async (peer: RTCPeerConnection, description: RTCSessionDescriptionInit) => {
        await peer.setRemoteDescription(description);
        const queued = pendingIceRef.current;
        pendingIceRef.current = [];
        await Promise.all(queued.map((candidate) => peer.addIceCandidate(candidate)));
    };

    const startCall = async (kind: CallKind) => {
        setMenuOpen(false);
        if (!selectedChat?.peerId || !currentUserId) {
            setCallNotice(t.messagesPage.selectToChat);
            return;
        }
        if (callPhase !== "idle") return;
        setCallNotice("");
        setCallKind(kind);
        setCallName(selectedChat.name);
        activePeerRef.current = selectedChat.peerId;
        activeConversationRef.current = selectedChat.id;
        try {
            const peer = createPeer(selectedChat.peerId, selectedChat.id);
            await attachLocalStream(kind, peer);
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            sendSignal({
                type: "offer",
                conversationId: selectedChat.id,
                toUserId: selectedChat.peerId,
                kind,
                sdp: peer.localDescription ?? offer,
            });
            setCallPhase("calling");
        } catch {
            stopCallMedia();
            setCallNotice(t.messagesPage.callFailed);
        }
    };

    const acceptCall = async () => {
        const signal = incomingRef.current;
        if (!signal?.sdp || !currentUserId) return;
        setCallKind(signal.kind === "video" ? "video" : "audio");
        activePeerRef.current = signal.fromUserId;
        activeConversationRef.current = signal.conversationId;
        try {
            const peer = createPeer(signal.fromUserId, signal.conversationId);
            await attachLocalStream(signal.kind === "video" ? "video" : "audio", peer);
            await applyRemoteDescription(peer, signal.sdp);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            sendSignal({
                type: "answer",
                conversationId: signal.conversationId,
                toUserId: signal.fromUserId,
                sdp: peer.localDescription ?? answer,
            });
            setCallPhase("active");
        } catch {
            sendSignal({ type: "reject", conversationId: signal.conversationId, toUserId: signal.fromUserId });
            stopCallMedia();
            setCallNotice(t.messagesPage.callFailed);
        }
    };

    const declineCall = () => {
        const signal = incomingRef.current;
        if (signal) sendSignal({ type: "reject", conversationId: signal.conversationId, toUserId: signal.fromUserId });
        stopCallMedia();
    };

    const endCall = () => {
        if (activePeerRef.current && activeConversationRef.current) {
            sendSignal({
                type: "hangup",
                conversationId: activeConversationRef.current,
                toUserId: activePeerRef.current,
            });
        }
        stopCallMedia();
    };

    const toggleMute = () => {
        const next = !muted;
        localStreamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = !next;
        });
        setMuted(next);
    };

    onCallSignalRef.current = async (signal) => {
        if (!currentUserId || signal.toUserId !== currentUserId) return;
        if (signal.type === "offer" && signal.sdp) {
            incomingRef.current = signal;
            const caller = conversationsRef.current.find((chat) => chat.peerId === signal.fromUserId);
            setCallName(caller?.name || "Conversation");
            setCallKind(signal.kind === "video" ? "video" : "audio");
            setCallPhase("incoming");
            return;
        }
        const peer = peerRef.current;
        if (signal.type === "answer" && signal.sdp && peer) {
            await applyRemoteDescription(peer, signal.sdp);
            setCallPhase("active");
            return;
        }
        if (signal.type === "ice" && signal.candidate) {
            if (!peer || !peer.remoteDescription) {
                pendingIceRef.current.push(signal.candidate);
                return;
            }
            await peer.addIceCandidate(signal.candidate);
            return;
        }
        if (signal.type === "hangup" || signal.type === "reject") stopCallMedia();
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = message.trim();
        if (!text || !selectedChat || !currentUserId) return;
        if (selectedChat.kind === "support") {
            setMessage("");
            void apiRequest<{ ticket: SupportTicketApi }>(`/support-tickets/${selectedChat.id}/messages`, {
                method: "POST",
                body: JSON.stringify({
                    message: text,
                    senderRole: "user",
                    senderId: currentUserId,
                    senderName: window.localStorage.getItem("user_name") || "You",
                }),
            }).then((result) => {
                setMessagesByConversation((current) => ({ ...current, [result.ticket._id]: toSupportMessages(result.ticket) }));
                const last = result.ticket.messages?.[result.ticket.messages.length - 1];
                setConversations((current) => current.map((chat) => chat.id === result.ticket._id ? { ...chat, lastMessage: last?.message || chat.lastMessage, time: formatMessageTime(last?.createdAt) } : chat));
            }).catch(() => setCallNotice(t.messagesPage.sendFailed));
            return;
        }
        socketRef.current?.emit("sendMessage", {
            conversationId: selectedChat.id,
            senderId: currentUserId,
            text,
        });
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-white pt-[85px] pb-0 h-screen flex flex-col overflow-hidden">
            <div className="flex-grow flex h-full pb-4 px-4 md:px-8 lg:px-12 max-w-[1370px] mx-auto w-full">
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex overflow-hidden flex-grow relative w-full h-full">

                    {/* Sidebar */}
                    <div className={cn(
                        "w-full md:w-80 lg:w-[400px] border-r border-slate-100 flex flex-col transition-all duration-300 z-30 bg-white",
                        !showSidebar && "hidden md:flex"
                    )}>
                        <div className="p-8 pb-4">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t.messagesPage.title}</h1>
                                <button className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={t.messagesPage.searchConversations}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-none rounded-2xl text-[14px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto px-4 py-2 custom-scrollbar">
                            {visibleConversations.length === 0 && (
                                <p className="px-4 py-10 text-center text-sm font-bold text-slate-400">No conversations yet</p>
                            )}
                            {visibleConversations.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        setSelectedChat(chat);
                                        if (window.innerWidth < 768) setShowSidebar(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all mb-2 group relative cursor-pointer",
                                        selectedChat?.id === chat.id
                                            ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                            : "hover:bg-slate-50"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                            selectedChat?.id === chat.id ? "border-white/20" : "border-white shadow-md"
                                        )}>
                                            <PersonAvatar name={chat.name} avatar={chat.avatar} selected={selectedChat?.id === chat.id} />
                                        </div>
                                    </div>
                                    <div className="flex-grow text-left overflow-hidden">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "font-black text-base truncate tracking-tight",
                                                selectedChat?.id === chat.id ? "text-white" : "text-slate-800"
                                            )}>{chat.name}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold",
                                                selectedChat?.id === chat.id ? "text-white/60" : "text-slate-400"
                                            )}>{chat.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={cn(
                                                "text-[13px] truncate max-w-[180px] font-medium",
                                                selectedChat?.id === chat.id ? "text-white/80" : "text-slate-500"
                                            )}>
                                                {chat.lastMessage}
                                            </p>
                                            {(messagesByConversation[chat.id]?.length || chat.unread) > 0 && selectedChat?.id !== chat.id && (
                                                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                                    {messagesByConversation[chat.id]?.length || chat.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow flex flex-col bg-white relative z-20 h-full overflow-hidden">

                        {/* Header */}
                        <div className="p-6 md:px-8 border-b border-slate-50 flex items-center justify-between bg-white/90 backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowSidebar(true)}
                                    className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-5 h-5 text-slate-800" />
                                </button>
                                {selectedChat && (
                                <>
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                        <PersonAvatar name={selectedChat.name} avatar={selectedChat.avatar} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 leading-tight">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            {selectedChat.kind === "support" ? "Support" : isConnected ? t.messagesPage.online : t.messagesPage.offline}
                                        </p>
                                        {selectedChat.kind !== "support" && isConnected && <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500" />}
                                    </div>
                                </div>
                                </>
                                )}
                            </div>
                            {selectedChat?.kind !== "support" && <div className="relative flex items-center gap-2">
                                <button type="button" onClick={() => void startCall("audio")} title={t.messagesPage.voiceCall} className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all cursor-pointer">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button type="button" onClick={() => void startCall("video")} title={t.messagesPage.videoCall} className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all cursor-pointer">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button type="button" onClick={() => setMenuOpen((open) => !open)} title={t.messagesPage.voiceCall} className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                                        <button type="button" onClick={() => void startCall("audio")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">
                                            <Phone className="h-4 w-4" /> {t.messagesPage.voiceCall}
                                        </button>
                                        <button type="button" onClick={() => void startCall("video")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">
                                            <Video className="h-4 w-4" /> {t.messagesPage.videoCall}
                                        </button>
                                        {callPhase !== "idle" && (
                                            <button type="button" onClick={endCall} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50">
                                                <PhoneOff className="h-4 w-4" /> {t.messagesPage.endCall}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>}
                        </div>
                        {callNotice && <p className="px-8 pb-3 text-xs font-bold text-amber-600">{callNotice}</p>}

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/20">
                            {selectedMessages.length === 0 && (
                                <div className="h-full flex items-center justify-center text-center">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400">{selectedChat ? "No messages yet" : "No conversations yet"}</p>
                                        <p className="text-xs text-slate-300 mt-1">{selectedChat ? "Send a message to start the conversation." : "New chats appear here when someone messages you."}</p>
                                    </div>
                                </div>
                            )}
                            {selectedMessages.map((msg) => {
                                const sent = msg.senderId === currentUserId;
                                return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg._id}
                                    className={cn(
                                        "flex flex-col max-w-[80%] md:max-w-[65%]",
                                        sent ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-6 py-4 text-[15px] leading-relaxed shadow-sm font-medium",
                                        sent
                                            ? "bg-slate-900 text-white rounded-[2rem] rounded-tr-none shadow-xl shadow-slate-100"
                                            : "bg-white text-slate-700 rounded-[2rem] rounded-tl-none border border-slate-100"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 px-2">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{formatMessageTime(msg.createdAt)}</span>
                                        {sent && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                                    </div>
                                </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        {selectedChat && <div className="p-8 bg-white border-t border-slate-50">
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-4 bg-slate-50/50 p-2 pl-4 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-slate-100 transition-all"
                            >
                                <button type="button" className="p-3 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t.messagesPage.typeMessage}
                                    className="flex-grow bg-transparent border-none focus:ring-0 text-[15px] font-bold py-3 text-slate-800 placeholder:text-slate-400 outline-none"
                                />
                                <div className="flex items-center gap-2">
                                    <button type="button" className="p-3 text-slate-400 hover:text-primary transition-colors hidden sm:block cursor-pointer">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#17b9c1] hover:bg-[#12949a] text-white w-14 h-14 rounded-2xl shadow-xl shadow-[#17b9c1]/30 transition-all flex items-center justify-center scale-95 hover:scale-100 active:scale-95 cursor-pointer"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>}
                    </div>

                </div>
            </div>

            {callPhase !== "idle" && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
                    <div className="w-full max-w-lg rounded-[2rem] bg-slate-900 p-6 text-white shadow-2xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            {callPhase === "incoming" ? t.messagesPage.incomingCall : callPhase === "calling" ? t.messagesPage.calling : callKind === "video" ? t.messagesPage.videoCall : t.messagesPage.voiceCall}
                        </p>
                        <h2 className="mt-2 text-2xl font-black">{callName}</h2>
                        {callKind === "video" && (
                            <div className="relative mt-5 h-64 overflow-hidden rounded-3xl bg-black">
                                <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                                <video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-3 right-3 h-24 w-32 rounded-2xl object-cover" />
                            </div>
                        )}
                        {callKind === "audio" && <audio ref={remoteAudioRef} autoPlay className="hidden" />}
                        <div className="mt-6 flex items-center justify-center gap-3">
                            {callPhase === "incoming" ? (
                                <>
                                    <button type="button" onClick={declineCall} className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold">{t.messagesPage.decline}</button>
                                    <button type="button" onClick={() => void acceptCall()} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold">{t.messagesPage.accept}</button>
                                </>
                            ) : (
                                <>
                                    {callPhase === "active" && (
                                        <button type="button" onClick={toggleMute} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                        </button>
                                    )}
                                    <button type="button" onClick={callPhase === "incoming" ? declineCall : endCall} className="flex h-12 items-center gap-2 rounded-2xl bg-red-500 px-5 text-sm font-bold">
                                        <PhoneOff className="h-5 w-5" /> {t.messagesPage.endCall}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}</style>
        </div>
    );
}
