"use client";

import { createContext, useEffect, useState } from "react";
import { SignUpRequest, ForgotPasswordRequest, ResetPasswordRequest, useAuthService } from "@/lib/services/auth.service";
import { User } from "@/lib/types/user";
import Loading from "@/components/loading";

export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signIn: (username: string, password: string, turnstileToken?: string) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  setUser: () => { },
  reloadUser: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getMe, signIn: signInService, signUp: signUpService, forgotPassword: forgotPasswordService, resetPassword: resetPasswordService } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signIn = async (username: string, password: string, turnstileToken?: string) => {
    setIsLoading(true);
    try {
      const response = await signInService({ username, password, turnstileToken });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      const user = await getMe();

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest) => {
    setIsLoading(true);
    try {
      const response = await signUpService(data);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      const user = await getMe();

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    try {
      await forgotPasswordService(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    try {
      await resetPasswordService(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadUser = async () => {
    setIsLoading(true);
    try {
      const user = await getMe();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading show={true} message="Yükleniyor..." fullScreen={true} />;
  }

  return <AuthContext.Provider value={{ user, setUser, isLoading, isAuthenticated, signIn, signUp, forgotPassword, resetPassword, signOut, reloadUser }}>{children}</AuthContext.Provider>;
};
