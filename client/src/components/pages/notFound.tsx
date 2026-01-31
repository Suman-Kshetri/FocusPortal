import { useNavigate } from "@tanstack/react-router";

export default function NotFound({
  errorCode = "404",
  title = "Oops! Page Not Found",
  message = "Looks like you've taken a wrong turn in your study journey!",
  buttonText = "Back to Home",
}) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate({ to: "/" })
  }
  return (
    <div className="relative h-screen w-full overflow-hidden bg-linear-to-b from-background to-muted">
      <div className="absolute h-full w-full flex justify-center items-center opacity-30">
        <img
          src="/assets/404/cloud.png"
          alt="404 Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-br from-background/50 via-transparent to-muted/50"></div>

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4 relative">
          <div className="mb-8 animate-bounce-gentle">
            <h1 className="text-[16rem] md:text-[16rem] font-extrabold text-transparent bg-clip-text bg-linear-to-br from-primary via-primary to-accent-foreground leading-none tracking-wider drop-shadow-2xl">
              {errorCode}
            </h1>
          </div>
          <h2 className="text-3xl md:text-3xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg md:text-lg">
            {message}
          </p>
          <button
            onClick={handleClick}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 hover:bg-primary/90 transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-2 justify-center">
              {buttonText}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}