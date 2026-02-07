import { Check, ChevronRight } from "lucide-react";

interface StatusBarProps {
    stages: string[];
    currentStage: string;
    onStageClick?: (stage: string) => void;
}

export function OdooStatusBar({ stages, currentStage, onStageClick }: StatusBarProps) {
    const currentIndex = stages.indexOf(currentStage);

    return (
        <div className="flex items-center border-b border-slate-200 bg-white px-4 py-2 text-sm">
            <div className="flex flex-1 items-center justify-end gap-0.5 overflow-x-auto">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                        <button
                            key={stage}
                            onClick={() => onStageClick?.(stage)}
                            disabled={!onStageClick}
                            className={`
                                relative flex items-center px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-all
                                ${isCurrent 
                                    ? "bg-blue-600 text-white shadow-sm z-10" 
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                                }
                                ${index === 0 ? "rounded-l-md" : ""}
                                ${index === stages.length - 1 ? "rounded-r-md" : ""}
                                ${isCompleted ? "text-blue-600 border-blue-200 bg-blue-50" : ""}
                            `}
                        >
                            {isCompleted && <Check className="mr-1.5 h-3 w-3" />}
                            {stage}
                            
                            {/* Arrow Effect (CSS triangle would be better but this is simple) */}
                            { !isCurrent && index !== stages.length -1 && (
                                <span className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-200">
                                    <ChevronRight className="h-4 w-4 fill-white" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
