import ActionButton from "./ActionButton";
import { ActionButtonListProps } from "../types/types";

const ActionButtonList: React.FC<ActionButtonListProps> = ({
  allType,
  addActionToQueue,
}) => {
  return (
    <>
      {allType.map((type, index) => (
        <ActionButton
          actionType={type}
          addActionToQueue={() => addActionToQueue(type)}
          key={type}
          index={index}
        />
      ))}
    </>
  );
};

export default ActionButtonList;
