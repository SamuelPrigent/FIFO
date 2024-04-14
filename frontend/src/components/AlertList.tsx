import Alert from "./Alert";
import { AlertListProps } from "../types/types";

const AlertList: React.FC<AlertListProps> = ({ allType, alerts }) => {
  return (
    <>
      {allType.map((type) =>
        alerts[type] ? (
          <Alert key={type} message={`Crédit insuffisant : ${type}`} />
        ) : null
      )}
    </>
  );
};

export default AlertList;
