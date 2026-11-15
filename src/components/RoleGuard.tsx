"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessRoleRoute, roleHome } from "@/lib/role-access";
import { useAuthStore } from "@/store/auth-store";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const blocked = Boolean(
    isHydrated && token && pathname && !canAccessRoleRoute(role, pathname),
  );

  useEffect(() => {
    if (blocked) router.replace(roleHome[role]);
  }, [blocked, role, router]);

  if (blocked) return null;
  return children;
}
