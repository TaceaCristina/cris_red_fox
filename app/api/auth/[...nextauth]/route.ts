import { handlers } from "@/auth" // Referring to the auth.ts we just created
import { ServerRuntime } from "next";

export const runtime: ServerRuntime = "nodejs";

export const { GET, POST } = handlers