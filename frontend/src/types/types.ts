// === Type ===
// app.tsx
export type TypeOfCredits = { [key: string]: number | string | null };
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
}

// components/Alert
export interface AlertProps {
  message: string;
}

// components/CreditsList
export interface CreditsListProps {
  type: string;
  credits: TypeOfCredits;
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
