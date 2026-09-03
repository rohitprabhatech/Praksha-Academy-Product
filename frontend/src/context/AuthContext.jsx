import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "praksha_auth";

const MOCK_USERS = [
  {
    email: "student@praksha.com",
    password: "student123",
    role: "student",
    name: "Student User",
  },
  {
    email: "teacher@praksha.com",
    password: "teacher123",
    role: "teacher",
    name: "Teacher User",
  },
  {
    email: "admin@praksha.academy",
    password: "admin123",
    role: "admin",
    name: "Admin",
  },
];

const getStoredAuth = () => {
  try {
    const rememberedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (rememberedUser) {
      return JSON.parse(rememberedUser);
    }

    const sessionUser = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (sessionUser) {
      return JSON.parse(sessionUser);
    }

    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredAuth);

  const login = async ({
    email,
    password,
    rememberMe = false,
    allowedRole = null,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = MOCK_USERS.find(
      (mockUser) =>
        mockUser.email === normalizedEmail &&
        mockUser.password === password
    );

    // Invalid email/password
    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Role restriction
    // Example:
    // normal login -> student only
    // admin login  -> admin only
    if (allowedRole && matchedUser.role !== allowedRole) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const authenticatedUser = {
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    setUser(authenticatedUser);

    const serializedUser = JSON.stringify(authenticatedUser);

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serializedUser);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serializedUser);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return {
      success: true,
      user: authenticatedUser,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

export default AuthContext;