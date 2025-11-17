import { useEffect, useState } from 'react';

interface RouteProps {
  children: React.ReactNode;
}

export function Router({ children }: RouteProps) {
  const [, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      setPath(window.location.pathname);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <>{children}</>;
}

export function useRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { path };
}
