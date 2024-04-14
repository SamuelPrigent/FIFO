import CreditsElement from "./CreditsElement";
import { CreditsElementListProps } from "../types/types";

const CreditsElementList: React.FC<CreditsElementListProps> = ({
  allType,
  credits,
}) => {
  return (
    <>
      {allType.map((type, index) => (
        <CreditsElement
          credits={credits}
          key={type}
          type={type}
          index={index}
        />
      ))}
    </>
  );
};

export default CreditsElementList;
