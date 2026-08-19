"use client";
import { useSession } from "next-auth/react";

type RoleGuardProps = {
    allowedRoles: ("ADMIN" | "ANALYST" | "VIEWER")[];
    children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { data: session } = useSession();
    const role = session?.user?.role;

    if (!role || !allowedRoles.includes(role)) {
        return null;
    }

    return <>{children}</>;
}