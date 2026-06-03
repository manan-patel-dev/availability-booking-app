import { createContext } from "react";
import { useAuth as _useAuth } from "./useAuth";

export const AuthContext = createContext(null);
export const useAuth = _useAuth;
