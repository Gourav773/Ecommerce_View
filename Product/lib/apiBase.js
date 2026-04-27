const rawBase = process.env.NEXT_PUBLIC_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5000";
export const API_BASE = rawBase.replace(/\/+$/, "");
