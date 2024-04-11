import { Dispatch, SetStateAction } from "react";
// === Type ===
// --- app.tsx ---
// credits
export type CreditsState = {
  [key: string]: number | string | null;
};
export type SetCreditsFunction = Dispatch<SetStateAction<CreditsState>>;
export type TypeOfCredits = { [key: string]: number | string | null };
// alert
export type AlertState = {
  [key: string]: boolean;
};
export type SetAlertsFunction = Dispatch<SetStateAction<AlertState>>;
export type TypeOfAlerts = { [key: string]: boolean };

// === Interface ===
// api/creditsRequests
export interface CreditData {
  _id: string;
  name: string;
  number: number;
  maxNumber: number;
  __v: number;
}

// components/ActionButton
export interface ActionButtonProps {
  actionType: string;
  addActionToQueue: (actionType: string) => void;
  index: number;
}

// components/Alert
export interface AlertProps {
  message: string;
}

// components/CreditsList
export interface CreditsListProps {
  type: string;
  credits: TypeOfCredits;
  index: number;
}

// components/QueueList
export interface QueueListProps {
  queue: string[];
}

// hooks/useSocketio
export interface CreditsData {
  [key: string]: number | undefined;
}

// stores/useQueueStore
export interface QueueState {
  queueStore: string[];
  addInQueueLS: (actionType: string) => void;
  resetQueueLS: () => void;
  removeActionFromQueueLS: (index: number) => void;
  setQueueLS: (newQueue: string[]) => void;
}
