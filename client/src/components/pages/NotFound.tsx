
const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <div className="w-32 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-secondary text-secondary-foreground border-2 border-border rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
        <div className="mt-12 flex justify-center gap-8">
          <div className="w-16 h-16 rounded-full bg-muted opacity-50"></div>
          <div className="w-12 h-12 rounded-full bg-accent opacity-50"></div>
          <div className="w-20 h-20 rounded-full bg-secondary opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound
