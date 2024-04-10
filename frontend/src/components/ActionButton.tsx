import { ActionButtonProps } from "../types/types"; // types

const ActionButton: React.FC<ActionButtonProps> = ({
  actionType,
  addActionToQueue,
}) => {
  return (
    <button
      id={`type${actionType}`}
      className="buttonType"
      onClick={() => addActionToQueue(actionType)}
    >
      Type {actionType}
    </button>
  );
};

export default ActionButton;
