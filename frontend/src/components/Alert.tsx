interface AlertProps {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
  return <div className="alertText">{message}</div>;
};
export default Alert;
