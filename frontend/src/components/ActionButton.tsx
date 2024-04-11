import { ActionButtonProps } from "../types/types"; // types
import { colors } from "../constants/constants";

const ActionButton: React.FC<ActionButtonProps> = ({
  actionType,
  addActionToQueue,
  index,
}) => {
  const colorClass = colors[index % colors.length];

  return (
    <button
      id={`type${actionType}`}
      className={`actionButton ${colorClass}`}
      onClick={() => addActionToQueue(actionType)}
    >
      {`Type ${actionType}`}
    </button>
  );
};

export default ActionButton;
