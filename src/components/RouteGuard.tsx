"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { protectedRoutes, routes } from "@/resources";
import { Button, Column, Flex, Heading, PasswordInput, Spinner } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

/** Route enablement is static config, so it can be resolved synchronously. */
function isRouteEnabled(pathname: string | null): boolean {
  if (!pathname) return false;

  if (pathname in routes) {
    return routes[pathname as keyof typeof routes];
  }

  const dynamicRoutes = ["/blog", "/work"] as const;
  return dynamicRoutes.some((route) => pathname.startsWith(route) && routes[route]);
}

/**
 * Hides disabled routes and gates password-protected ones.
 *
 * Enablement is derived directly from the pathname during render, so pages
 * stream their real content in the first HTML response — previously every
 * route rendered a spinner until a client effect ran, which cost the site its
 * server-rendered content for crawlers and delayed the largest paint. Only
 * genuinely protected routes still wait on the auth check.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const routeEnabled = isRouteEnabled(pathname);
  const passwordRequired = Boolean(
    pathname && protectedRoutes[pathname as keyof typeof protectedRoutes],
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(passwordRequired);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!passwordRequired) {
      setCheckingAuth(false);
      return;
    }

    let active = true;
    setCheckingAuth(true);

    fetch("/api/check-auth")
      .then((response) => {
        if (active) setIsAuthenticated(response.ok);
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [passwordRequired, pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (!routeEnabled) {
    return <NotFound />;
  }

  if (passwordRequired) {
    if (checkingAuth) {
      return (
        <Flex fillWidth paddingY="128" horizontal="center">
          <Spinner />
        </Flex>
      );
    }

    if (!isAuthenticated) {
      return (
        <Column paddingY="128" maxWidth={24} gap="24" center>
          <Heading align="center" wrap="balance">
            This page is password protected
          </Heading>
          <Column fillWidth gap="8" horizontal="center">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errorMessage={error}
            />
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </Column>
        </Column>
      );
    }
  }

  return <>{children}</>;
};

export { RouteGuard };
