import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "ANALYST" | "VIEWER";
        };
    }

    interface User {
        id: string;
        role?: "ADMIN" | "ANALYST" | "VIEWER";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "ADMIN" | "ANALYST" | "VIEWER";
        id: string;
    }
}