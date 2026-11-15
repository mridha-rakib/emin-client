import type { UserRole } from "@/store/auth-store";

export const roleHome: Record<UserRole, string> = {
  customer: "/myprofile_customer",
  seller: "/seller/products",
  provider: "/myprofile_provider",
};

const roleRoutes: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/myprofile_customer", roles: ["customer"] },
  { prefix: "/my_bookings_customer", roles: ["customer"] },
  { prefix: "/settings_customer", roles: ["customer", "seller"] },
  { prefix: "/seller", roles: ["seller"] },
  { prefix: "/myprofile_provider", roles: ["provider"] },
  { prefix: "/manage_services", roles: ["provider"] },
  { prefix: "/booking-requests", roles: ["provider"] },
  { prefix: "/settings_provider", roles: ["provider"] },
];

export const canAccessRoleRoute = (role: UserRole, pathname: string) => {
  const rule = roleRoutes.find(
    (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
  );
  return !rule || rule.roles.includes(role);
};
