import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { getNotFoundTexts } from "@/lib/not-found-i18n";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const texts = getNotFoundTexts(language);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{texts.title}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{texts.message}</p>
        <a href="/" className="text-foreground underline hover:text-foreground/80">
          {texts.backHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
