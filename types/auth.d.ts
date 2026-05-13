import "better-auth";

declare module "better-auth" {
  interface User {
    role: "ADMIN" | "USER";
  }
  interface Session {
    user: User;
  }
}

// ضيف الجزء ده كمان للتأكيد على الـ React Client
declare module "better-auth/react" {
  interface User {
    role: "ADMIN" | "USER";
  }
}
