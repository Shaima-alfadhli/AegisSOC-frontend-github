import Image from "next/image";
import { publicAsset } from "@/lib/publicAsset";
import { cn } from "@/lib/utils/cn";

export function AiCopilotBrain({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dims = { sm: 56, md: 96, lg: 160, xl: 200 }[size];

  return (
    <div
      className={cn(
        "relative shrink-0 bg-transparent",
        size === "sm" && "size-14",
        size === "md" && "size-24",
        size === "lg" && "size-40",
        size === "xl" && "size-48",
        className
      )}
    >
      <Image
        src={publicAsset("/brand/ai-copilot-brain.png")}
        alt="AI Security Copilot"
        width={dims}
        height={dims}
        unoptimized
        className="relative size-full object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(59,231,255,0.35)]"
        style={{ background: "transparent" }}
        priority={size === "lg" || size === "xl"}
      />
    </div>
  );
}
