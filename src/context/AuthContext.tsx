import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

type User = {
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
  const redirectUri =
    import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <AuthProviderWithAuth0>{children}</AuthProviderWithAuth0>
    </Auth0Provider>
  );
}

function AuthProviderWithAuth0({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setAuthUser({
        email: user.email || "",
        name: user.name || "",
        picture: user.picture || "",
        isAdmin: user.email === "m13971212844@gmail.com",
      });
    } else {
      setAuthUser(null);
    }
  }, [isAuthenticated, user]);

  const login = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const value = {
    user: authUser,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
