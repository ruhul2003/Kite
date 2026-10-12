import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { anonymous } from "better-auth/plugins";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Kite";

const client = new MongoClient(uri);
const db = client.db("Kite");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    usePlural: true,
  }),
  user: {
    modelName: "users",
    additionalFields: {
      avatar: {
        type: "string",
        required: false,
        defaultValue:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      coverPhoto: {
        type: "string",
        required: false,
        defaultValue:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "Welcome to my Kite profile!",
      },
      work: {
        type: "string",
        required: false,
        defaultValue: "Community Member",
      },
      livesIn: {
        type: "string",
        required: false,
        defaultValue: "San Francisco, CA",
      },
      username: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    anonymous({
      emailDomainName: "guest.kite.local",
    }),
  ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "kite_auth_secret_session_key",
});
