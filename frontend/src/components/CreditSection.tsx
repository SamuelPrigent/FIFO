import credit from "../assets/credit.svg";

interface CreditProps {
  type: string;
  stateValue: number | string | null;
}

const CreditSection: React.FC<CreditProps> = ({ type, stateValue }) => {
  return (
    <div className="creditSection">
      <div>{type} :</div>
      <div>{stateValue}</div>
      <img src={credit} className="creditSvg" />
    </div>
  );
};
export default CreditSection;
