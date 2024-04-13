import React from "react";
import { QueueListProps } from "../types/types";
import { colors } from "../constants/constants";
import { actionTypes } from "../constants/constants";

const QueueList: React.FC<QueueListProps> = ({ queue }) => {
  return (
    <div className="queueListComponent">
      {queue.map((item, index) => {
        const actionIndex = actionTypes.indexOf(item);
        const colorClass = colors[actionIndex % colors.length];
        return (
          <div key={index} className="taskContainer">
            {/* {index === 0 && <span className="arrowQueueNext"> -&gt; </span>} */}
            {index === 0 && <span className="spinner"></span>}
            {index !== 0 && <span className="arrowQueue"> -&gt; </span>}
            <span className={`task task${item} ${colorClass}`}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};
export default QueueList;
