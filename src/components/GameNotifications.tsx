import React from "react";
import { GameEffect } from "@/types/adventure";
import { HeartBreak, X, TrendUp } from "phosphor-react";

interface GameNotificationsProps {
  effects: GameEffect[];
  onDismiss?: () => void;
}

export function GameNotifications({
  effects,
  onDismiss,
}: GameNotificationsProps) {
  if (!effects || effects.length === 0) return null;

  const getEffectMessage = (
    effect: GameEffect
  ): {
    message: string;
    type?: "danger" | "success" | "info" | "warning";
    icon?: React.ReactNode;
  } => {
    switch (effect.type) {
      case "lose_heart":
        return {
          message: "You lost a heart! Be more careful with your choices.",
          type: "danger",
          icon: <HeartBreak size={20} weight="fill" />,
        };
      case "gain_score":
        return {
          message: `Great job! You earned ${effect.value || 10} points!`,
          type: "success",
          icon: <TrendUp size={20} weight="fill" />,
        };
      default:
        return {
          message: "",
        };
    }
  };

  const getAlertClasses = (type: "danger" | "success" | "info" | "warning") => {
    const baseClasses = "mb-4 p-4 rounded-lg border-1 shadow-lg";
    switch (type) {
      case "danger":
        return `${baseClasses} bg-red-700 border-red-500 text-white`;
      case "success":
        return `${baseClasses} bg-green-700 border-green-500 text-white`;
      case "warning":
        return `${baseClasses} bg-yellow-100 border-yellow-500 text-yellow-800`;
      case "info":
        return `${baseClasses} bg-blue-100 border-blue-500 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-500 text-gray-800`;
    }
  };

  return (
    <div className="space-y-2 my-6">
      {effects.map((effect, index) => {
        const { message, type, icon } = getEffectMessage(effect);
        return type && message ? (
          <div key={index} className={getAlertClasses(type)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium">{message}</span>
              </div>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
}
