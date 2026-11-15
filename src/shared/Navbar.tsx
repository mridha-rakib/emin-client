"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  MessageSquare,
  FileSearch,
  Settings,
  LogOut,
  ChevronDown,
  CalendarRange,
  ClipboardList,
  Globe,
  PlusCircle,
  ShoppingBag,
  UploadCloud,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/auth-store";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useTranslation();
  const isDe = language === "DE";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const { token, role: userRole, userName, userAvatar, logout } = useAuthStore();
  const avatarSrc = isHydrated ? userAvatar : "";
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
  const isLoggedIn = isHydrated && Boolean(token);

  // Universal clean public navigation links
  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.marketplace, href: "/marketplace" },
    { name: t.nav.services, href: "/services" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.subscription, href: "/subscription" },
    { name: t.nav.feed, href: "/feed", isFeed: true },
  ];

  const customerMenu = [
    { name: t.nav.myProfile, icon: User, href: "/myprofile_customer" },
    { name: t.nav.messages, icon: MessageSquare, href: "/messages" },
    { name: t.nav.myBookings, icon: FileSearch, href: "/my_bookings_customer" },
    {
      name: t.nav.settings,
      icon: Settings,
      href: "/settings_customer",
      hasChevron: true,
    },
    {
      name: t.nav.postRequirements,
      icon: PlusCircle,
      href: "/post",
      isHighlight: true,
    },
  ];

  const sellerMenu = [
    { name: t.nav.sellerDashboard, icon: Layers, href: "/seller/products" },
    { name: t.nav.uploadProduct, icon: UploadCloud, href: "/seller/upload", isHighlight: true },
    { name: t.nav.marketplace, icon: ShoppingBag, href: "/marketplace" },
    { name: t.nav.messages, icon: MessageSquare, href: "/messages" },
    { name: t.nav.subscription, icon: Sparkles, href: "/subscription" },
    {
      name: t.nav.settings,
      icon: Settings,
      href: "/settings_customer",
      hasChevron: true,
    },
  ];

  const providerMenu = [
    { name: t.nav.myProfile, icon: User, href: "/myprofile_provider" },
    { name: t.nav.messages, icon: MessageSquare, href: "/messages" },
    {
      name: t.nav.bookingRequests,
      icon: CalendarRange,
      href: "/booking-requests",
    },
    {
      name: t.nav.manageServices,
      icon: ClipboardList,
      href: "/manage_services",
    },
    { name: t.nav.subscription, icon: Sparkles, href: "/subscription" },
    {
      name: t.nav.settings,
      icon: Settings,
      href: "/settings_provider",
      hasChevron: true,
    },
    {
      name: t.nav.postRequirements,
      icon: PlusCircle,
      href: "/post",
      isHighlight: true,
    },
  ];

  const activeMenu = userRole === "seller"
    ? sellerMenu
    : userRole === "provider"
      ? providerMenu
      : customerMenu;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/auth/login");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest(".profile-dropdown-container")) {
        setIsProfileOpen(false);
      }
      if (isLanguageOpen && !target.closest(".language-dropdown-container")) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileOpen, isLanguageOpen]);

  if (pathname?.startsWith("/auth")) return null;

  return (
    <nav
      suppressHydrationWarning
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "top-0 w-full h-[85px] py-4 shadow-xs bg-white/95 backdrop-blur-md border-b border-slate-100"
          : "top-0 w-full h-[85px] py-4 bg-transparent",
      )}
    >
      <Container>
        {/* Layout: Left (Logo) | Center (Nav Links) | Right (Auth + Language) */}
        <div className="flex items-center justify-between gap-4 h-full" suppressHydrationWarning>
          {/* ── Left side: Logo ── */}
          <div className="flex items-center shrink-0" suppressHydrationWarning>
            <Link href="/" className="flex items-center" suppressHydrationWarning>
              <Image
                src="/Logo.png"
                alt="Odaboo Logo"
                width={140}
                height={45}
                className="h-10 w-auto object-contain transition-all duration-300"
                priority
                loading="eager"
              />
            </Link>
          </div>

          {/* ── Center: Centered Navigation Links ── */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-6" suppressHydrationWarning>
            <div className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                if (link.isFeed && !isLoggedIn) return null;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    suppressHydrationWarning
                    className={cn(
                      "px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-full text-[13.5px] xl:text-[14.5px] font-bold transition-all whitespace-nowrap tracking-tight",
                      isActive
                        ? "text-primary font-black bg-primary/10"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/60",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Right: Auth + Language ── */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Language Selector */}
            <div className="relative language-dropdown-container">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    {(["EN", "DE"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLanguageOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 cursor-pointer",
                          language === lang
                            ? "text-primary font-bold bg-slate-50/50"
                            : "text-slate-600",
                        )}
                      >
                        {lang === "EN" ? "English" : "Deutsch"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="relative profile-dropdown-container">
                  <div
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-11 h-11 rounded-full border-[1.5px] p-0.5 cursor-pointer overflow-hidden transition-all border-[#17b9c1] hover:scale-105 active:scale-95"
                  >
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc}
                        unoptimized={isStoredUpload(avatarSrc)}
                        alt="Profile"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                        {userInitials}
                      </span>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-3 z-50 overflow-hidden"
                      >
                        {/* Account type is fixed for this signed-in account. */}
                        <div className="mx-2 mb-2 p-2.5 bg-slate-50/90 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {isDe ? "Kontotyp" : "Account type"}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                              userRole === "seller" 
                                ? "bg-purple-100 text-purple-700 border border-purple-200" 
                                : userRole === "provider" 
                                  ? "bg-blue-100 text-blue-700 border border-blue-200" 
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            )}>
                              {userRole}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1 px-2">
                          {activeMenu.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsProfileOpen(false)}
                              className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors group",
                                item.isHighlight
                                  ? "bg-[#17b9c1]/10 text-[#0e8a90] hover:bg-[#17b9c1]/20 font-bold mt-1"
                                  : "hover:bg-slate-50 text-slate-700"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon
                                  className={cn(
                                    "w-[18px] h-[18px] transition-colors",
                                    item.isHighlight
                                      ? "text-[#17b9c1]"
                                      : "text-slate-600 group-hover:text-primary"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-[15px] transition-colors",
                                    item.isHighlight
                                      ? "font-bold text-[#0e8a90]"
                                      : "font-medium text-slate-700 group-hover:text-slate-900"
                                  )}
                                >
                                  {item.name}
                                </span>
                              </div>
                              {item.hasChevron && (
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                              )}
                            </Link>
                          ))}
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group"
                          >
                            <LogOut className="w-[18px] h-[18px] text-red-500 transition-colors" />
                            <span className="text-[15px] font-medium text-red-500 transition-colors">
                              {t.nav.logout}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  className="text-[15px] font-extrabold transition-colors text-slate-800 hover:text-primary cursor-pointer"
                  onClick={() => router.push("/auth/login")}
                >
                  {t.nav.login}
                </button>
                <PrimaryButton
                  className="rounded-full px-8 py-2.5 text-sm font-bold transition-all bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20"
                  onClick={() => router.push("/auth/sign_up")}
                >
                  {t.nav.signUp}
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 transition-colors text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[75%] sm:w-[50%] z-50 lg:hidden bg-white p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/Logo.png"
                    alt="Odaboo Logo"
                    width={120}
                    height={35}
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 1. Main Nav Options at the Top */}
              <div className="flex flex-col gap-6 mb-8 overflow-y-auto">
                {navLinks.map((link) => {
                  if (link.isFeed && !isLoggedIn) return null;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-2xl font-[800] text-slate-900 hover:text-primary transition-colors border-b border-slate-50 pb-4"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile Language Selector */}
                <div className="pt-2 pb-2">
                  <p className="text-sm font-semibold text-slate-500 mb-3 px-1">
                    {t.nav.language}
                  </p>
                  <div className="flex gap-2">
                    {(["EN", "DE"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-colors border cursor-pointer",
                          language === lang
                            ? "border-primary text-primary bg-primary/5"
                            : "border-slate-100 text-slate-600 bg-slate-50",
                        )}
                      >
                        {lang === "EN" ? "English" : "Deutsch"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Profile & Bottom Section */}
              <div className="mt-auto space-y-4">
                {isLoggedIn ? (
                  <div className="border-t border-slate-100 pt-6">
                    {/* Profile Dropdown Toggle */}
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-[#17b9c1] p-0.5 overflow-hidden">
                          {avatarSrc ? (
                            <Image
                              src={avatarSrc}
                              unoptimized={isStoredUpload(avatarSrc)}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                              {userInitials}
                            </span>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">
                            {userName || "Your account"}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {userRole}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-slate-400 transition-transform duration-300",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {/* Profile Options Accordion */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-1 py-2 px-1">
                            {/* Mobile account type indicator */}
                            <div className="p-3 mb-2 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  {isDe ? "Kontotyp" : "Account type"}
                                </span>
                                <span className="text-xs font-black uppercase text-slate-800">
                                  {userRole}
                                </span>
                              </div>
                            </div>

                            {activeMenu.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors group"
                              >
                                <item.icon className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                                  {item.name}
                                </span>
                              </Link>
                            ))}
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-red-50 transition-colors group text-red-500"
                            >
                              <LogOut className="w-5 h-5" />
                              <span className="text-sm font-bold">
                                {t.nav.logout}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <PrimaryButton
                      className="w-full bg-[#17b9c1] hover:bg-[#15a7ad] text-white rounded-xl h-14 font-bold mt-4 shadow-lg shadow-cyan-500/10"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/post");
                      }}
                    >
                      {t.nav.postRequirements}
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
                    <PrimaryButton
                      className="w-full h-14 rounded-xl font-bold"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/auth/login");
                      }}
                    >
                      {t.nav.login}
                    </PrimaryButton>
                    <PrimaryButton
                      variant="outline"
                      className="w-full h-14 rounded-xl font-bold"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/auth/sign_up");
                      }}
                    >
                      {t.nav.signUp}
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
