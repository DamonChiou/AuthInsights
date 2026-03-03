export { auth as proxy } from "@/src/auth";

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
