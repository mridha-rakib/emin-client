"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthPage = pathname?.startsWith("/auth");

    if (isAuthPage || !mounted) {
        return null;
    }

    return <Footer />;
}
