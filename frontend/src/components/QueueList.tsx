import React from "react";

interface QueueListProps {
  queue: string[];
}

const QueueList: React.FC<QueueListProps> = ({ queue }) => {
  return (
    <div className="queueListComponent">
      {queue.map((item, index) => (
        <React.Fragment key={index}>
          <div className="taskContainer">
            {index !== 0 && <span className="arrowQueue"> -&gt; </span>}
            <span className={`task${item}`}>{item}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default QueueList;
