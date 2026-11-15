"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Image as ImageIcon, Send, Heart, MessageCircle, Share2, MoreHorizontal, Sparkles, Rss } from "lucide-react";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest, ApiPage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

// --- Animation Variants ---
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

const ROLE_LABELS: Record<string, string> = {
    customer: "Customer",
    provider: "Service Provider",
    seller: "Seller",
};

const roleLabel = (role?: string) => (role && ROLE_LABELS[role]) || role || "Community Member";

type FeedComment = {
    id: string;
    authorName: string;
    authorRole: string;
    authorAvatar?: string;
    text: string;
    createdAt: string;
};

type FeedAuthor = { name: string; role: string; avatarUrl?: string };

type FeedPostView = {
    id: string;
    author: FeedAuthor;
    time: string;
    content: string;
    likes: number;
    comments: number;
    commentItems: FeedComment[];
    isLiked: boolean;
};

const profileUrl = (post: FeedPostView) => {
    const params = new URLSearchParams({
        name: post.author.name,
        role: post.author.role,
    });
    return `/profile/${encodeURIComponent(post.id)}?${params.toString()}`;
};

type FeedPostApiItem = {
    _id: string;
    userId?: string | { _id: string; firstName?: string; lastName?: string; avatar?: string; profession?: string } | null;
    authorName?: string;
    authorRole?: string;
    createdAt?: string;
    description?: string;
    title?: string;
    likes?: number;
    comments?: number;
    likedBy?: string[];
    commentItems?: FeedComment[];
};

const currentActor = () => localStorage.getItem("user_id") || "";

const mapFeedPost = (post: FeedPostApiItem): FeedPostView => {
    const actor = typeof window !== "undefined" ? currentActor() : "anonymous";
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
    const commentItems = Array.isArray(post.commentItems) ? post.commentItems : [];
    const user = post.userId && typeof post.userId === "object" ? post.userId : null;
    const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    return {
    id: post._id,
    author: {
        name: userName || post.authorName || "User",
        role: user?.profession || roleLabel(post.authorRole),
        avatarUrl: user?.avatar || undefined,
    },
    time: post.createdAt ? new Date(post.createdAt).toLocaleString() : "Just now",
    content: post.description || post.title || "",
    likes: likedBy.length,
    comments: commentItems.length,
    commentItems,
    isLiked: likedBy.includes(actor),
    };
};

function AuthorAvatar({ name, avatarUrl, size }: { name: string; avatarUrl?: string; size: "sm" | "md" | "lg" }) {
    const dimensions = size === "lg" ? "w-12 h-12 text-lg" : size === "md" ? "w-10 h-10 text-sm" : "w-7 h-7 text-[10px]";
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className={cn(dimensions, "rounded-full object-cover shrink-0 border border-slate-100")} />;
    }
    return (
        <div className={cn(dimensions, "rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 text-slate-700 flex items-center justify-center font-bold shrink-0")}>
            {initials(name)}
        </div>
    );
}

export default function FeedPage() {
    const { t, language } = useTranslation();
    const isDe = language === "DE";
    const [newPost, setNewPost] = useState("");
    const [posts, setPosts] = useState<FeedPostView[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
    const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
    const [feedError, setFeedError] = useState("");
    const { token, userName, userAvatar, role } = useAuthStore();
    const isHydrated = useSyncExternalStore(subscribeToHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
    const isSignedIn = isHydrated && Boolean(token);
    const myName = (isHydrated && userName) || "Me";
    const myAvatar = (isHydrated && userAvatar) || undefined;

    useEffect(() => {
        apiRequest<ApiPage<FeedPostApiItem>>("/feed-posts?page=1&limit=50")
            .then((data) => setPosts(data.items.map(mapFeedPost)))
            .catch(() => setPosts([]));
    }, []);

    const handleCreatePost = async () => {
        if (!newPost.trim()) return;
        setFeedError("");
        if (!isSignedIn) {
            setFeedError(isDe ? "Bitte melden Sie sich an, um zu posten." : "Please sign in to publish a post.");
            return;
        }
        setIsPosting(true);
        try {
            const saved = await apiRequest<FeedPostApiItem>("/feed-posts", {
                method: "POST",
                body: JSON.stringify({
                    payload: {
                        title: newPost.slice(0, 80),
                        description: newPost,
                        category: "General",
                        authorRole: role,
                        status: "OPEN",
                    },
                }),
            });
            setPosts((current) => [mapFeedPost(saved), ...current]);
            setNewPost("");
        } catch (error) {
            setFeedError(error instanceof Error ? error.message : "Your post could not be published.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleToggleLike = async (postId: string) => {
        setFeedError("");
        if (!isSignedIn) {
            setFeedError(isDe ? "Bitte melden Sie sich an, um Beiträge zu liken." : "Please sign in to like posts.");
            return;
        }
        setPosts((current) => current.map((post) => post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: Math.max(0, post.likes + (post.isLiked ? -1 : 1)) }
            : post
        ));
        try {
            const saved = await apiRequest<FeedPostApiItem>(`/feed-posts/${postId}/reactions`, { method: "POST" });
            setPosts((current) => current.map((post) => post.id === postId ? mapFeedPost(saved) : post));
        } catch {
            setPosts((current) => current.map((post) => post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: Math.max(0, post.likes + (post.isLiked ? -1 : 1)) }
                : post
            ));
        }
    };

    const handleAddComment = async (postId: string) => {
        const text = commentDrafts[postId]?.trim();
        if (!text) return;
        setFeedError("");
        if (!isSignedIn) {
            setFeedError(isDe ? "Bitte melden Sie sich an, um zu kommentieren." : "Please sign in to comment.");
            return;
        }
        try {
            const saved = await apiRequest<FeedPostApiItem>(`/feed-posts/${postId}/comments`, {
                method: "POST",
                body: JSON.stringify({ payload: { text, authorRole: roleLabel(role) } }),
            });
            setPosts((current) => current.map((post) => post.id === postId ? mapFeedPost(saved) : post));
            setCommentDrafts((current) => ({ ...current, [postId]: "" }));
        } catch (error) {
            setFeedError(error instanceof Error ? error.message : "Your comment could not be posted.");
        }
    };

    const handleSharePost = async (post: FeedPostView) => {
        const url = `${window.location.origin}/feed?post=${post.id}`;
        const shareData = {
            title: `${post.author.name} on Odaboo`,
            text: post.content.slice(0, 160),
            url,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopiedPostId(post.id);
            window.setTimeout(() => setCopiedPostId((current) => current === post.id ? null : current), 1800);
        } catch {
            // User cancelled native sharing, or clipboard is unavailable.
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* ── Signature Architectural Grid Hero Section ── */}
            <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100/80 mb-10">
                {/* Architectural grid pattern with radial mask */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <Container className="relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>{isDe ? "Live Community & Schwarzes Brett" : "Live Community & Job Board"}</span>
                        </div>

                        {/* Two-Tone Grand Headline with Wavy SVG Underline */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            {t.feedPage.title}{" "}
                            <span className="text-primary relative inline-block">
                                {isDe ? "& Nachbarn" : "& Verified Pros"}
                                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                            {t.feedPage.subtitle}
                        </p>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="max-w-2xl mx-auto">

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        {/* Create Post Input */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="flex gap-4">
                                <AuthorAvatar name={myName} avatarUrl={myAvatar} size="md" />
                                <div className="flex-grow">
                                    <textarea
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                        placeholder={t.feedPage.postPlaceholder}
                                        className="w-full bg-slate-50 rounded-xl border-none p-4 text-slate-900 focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all resize-none min-h-[100px]"
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <input type="file" id="feed-photo" className="hidden" accept="image/*" />
                                            <label htmlFor="feed-photo" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                                                <ImageIcon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{t.feedPage.photoButton}</span>
                                            </label>
                                        </div>
                                        <button
                                            onClick={handleCreatePost}
                                            disabled={!newPost.trim() || isPosting}
                                            className={cn(
                                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer",
                                                newPost.length > 0 && !isPosting
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            )}
                                        >
                                            <span>{isPosting ? "Posting..." : t.feedPage.postButton}</span>
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {feedError && (
                                        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                                            {feedError}{" "}
                                            {!isSignedIn && (
                                                <Link href="/auth/login" className="underline font-bold">{isDe ? "Anmelden" : "Sign in"}</Link>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Feed Posts */}
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={fadeInUp}
                                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AuthorAvatar name={post.author.name} avatarUrl={post.author.avatarUrl} size="lg" />
                                        <div>
                                            <Link
                                                href={profileUrl(post)}
                                                className="font-bold text-slate-900 hover:text-primary transition-colors"
                                            >
                                                {post.author.name}
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className={cn(
                                                    "font-medium",
                                                    post.author.role.includes("Pro") ? "text-purple-600" : ""
                                                )}>
                                                    {post.author.role}
                                                </span>
                                                <span>•</span>
                                                <span>{post.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Post Content */}
                                <p className="text-slate-700 leading-relaxed mb-6">
                                    {post.content}
                                </p>

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => handleToggleLike(post.id)}
                                        className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors group cursor-pointer",
                                        post.isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
                                    )}>
                                        <Heart className={cn("w-5 h-5 transition-transform group-active:scale-75", post.isLiked && "fill-current")} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-cyan-600 transition-colors cursor-pointer">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{post.comments}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSharePost(post)}
                                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors ml-auto cursor-pointer"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        <span className="hidden sm:inline">{copiedPostId === post.id ? "Copied" : t.feedPage.share}</span>
                                    </button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {post.commentItems.map((comment) => (
                                        <div key={comment.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                    <AuthorAvatar name={comment.authorName || "User"} avatarUrl={comment.authorAvatar} size="sm" />
                                                    {comment.authorName}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">{comment.text}</p>
                                        </div>
                                    ))}

                                    <div className="flex gap-2">
                                        <input
                                            value={commentDrafts[post.id] || ""}
                                            onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                                            placeholder={isDe ? "Kommentar schreiben..." : "Write a comment..."}
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddComment(post.id)}
                                            disabled={!commentDrafts[post.id]?.trim()}
                                            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                        >
                                            {isDe ? "Senden" : "Send"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    </motion.div>
                </div>
            </Container>
        </div>
    );
}
