import { Check } from "lucide-react";

interface StatusBarProps {
    stages: string[];
    currentStage: string;
    onStageClick?: (stage: string) => void;
}

export function OdooStatusBar({ stages, currentStage, onStageClick }: StatusBarProps) {
    const currentIndex = stages.indexOf(currentStage);

    return (
        <div className="flex items-center border rounded-md overflow-hidden bg-white text-sm font-medium shadow-sm">
            {stages.map((stage, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;
                
                return (
                    <button
                        key={stage}
                        onClick={() => onStageClick?.(stage)}
                        disabled={!onStageClick}
                        className={`
                            relative flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors border-r last:border-r-0
                            ${isCurrent 
                                ? "bg-slate-800 text-white z-10" 
                                : isCompleted
                                    ? "bg-white text-slate-800 hover:bg-slate-50"
                                    : "bg-white text-slate-400 hover:bg-slate-50"
                            }
                        `}
                    >
                        {isCompleted && <Check className="mr-1.5 h-3 w-3" />}
                        {stage}
                    </button>
                )
            })}
        </div>
    );
}
