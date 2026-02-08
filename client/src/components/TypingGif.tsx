import typingCatGif from "../../public/assets/typing-cat.gif";

const TypingCatGif = () => {
  if (!typingCatGif) return null;
  return (
    <div className="flex justify-center items-center">
      <img
        src={typingCatGif} // imported GIF
        alt="Adorable white cat typing on keyboard"
        style={{
          width: "100%",
          height: "100%", // numeric pixels
          borderRadius: "12px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  );
};

export default TypingCatGif;
