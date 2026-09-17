import logoImg from "../assets/logo.png";

export { logoImg };

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

export default function Logo({
  size = "md",
  className = "",
  showText = true,
  textClassName = "",
  subtitleClassName = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <img
          src={logoImg}
          alt="Denim Universe Official Logo"
          className={`${sizeMap[size]} rounded-full object-cover shadow-lg ring-2 ring-white/20 transition-all duration-300`}
          loading="eager"
        />
      </span>
      {showText && (
        <span className="leading-none">
          <span className={`font-display block text-[17px] font-extrabold tracking-tight text-white ${textClassName}`}>
            DENIM <span className="text-amber-400">UNIVERSE</span>
          </span>
          <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-200/70 ${subtitleClassName}`}>
            Explore the world of denim
          </span>
        </span>
      )}
    </div>
  );
}