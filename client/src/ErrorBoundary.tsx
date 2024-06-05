import React, { useState, useEffect } from "react";

export const ErrorBoundary = ({ children }: { children: JSX.Element }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return (
      <iframe
        title="Not Found"
        src="/notFound.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
      ></iframe>
    );
  }

  return <>{children}</>;
};
