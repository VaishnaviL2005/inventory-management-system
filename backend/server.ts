console.log("Starting server.ts...");
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Import routes
import receiptRoutes from "./routes/receiptRoutes.js";

app.use("/api/receipts", receiptRoutes);

// Auth setup commented out temporarily to get server running
// TODO: Fix @auth/neon-adapter ESM import issues
/*
import { createRequire } from "module";
import { ExpressAuth } from "@auth/express";
const requireModule = createRequire(import.meta.url);
const NeonAdapter = requireModule("@auth/neon-adapter").default;
const Credentials = requireModule("@auth/express/providers/credentials").default;
import { Pool } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use("/auth/*", ExpressAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const result = await pool.query("SELECT * FROM users WHERE email = $1", [
            credentials.email,
          ])
          const user = result.rows[0]

          if (!user || !user.password_hash) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  adapter: NeonAdapter(pool),
  session: { strategy: "jwt" },
}));
*/

app.listen(5000, () => console.log("Backend running on 5000"));
