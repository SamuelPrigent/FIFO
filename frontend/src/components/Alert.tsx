import { AlertProps } from "../types/types";

const Alert: React.FC<AlertProps> = ({ message }) => {
  return <div className="alertText">{message}</div>;
};
export default Alert;
