import { putCreditsData } from "../api/creditsRequests";
import { SetCreditsFunction, SetAlertsFunction } from "../types/types";

export const useCreditActions = (
  setCredits: SetCreditsFunction,
  setAlerts: SetAlertsFunction,
  allType: string[]
) => {
  // set one credit state
  const updateCreditsState = (type: string, value: number) => {
    setCredits((prevCredits) => ({
      ...prevCredits,
      [type]: value,
    }));
  };
  // update one alert state
  const updateAlertState = (type: string, value: boolean) => {
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [type]: value,
    }));
  };

  // all to 0
  const deleteCredits = () => {
    allType.forEach((type) => {
      putCreditsData(type, 0, -1).then(() => {
        updateCreditsState(type, 0);
      });
    });
  };
  // all to 5
  const resetCredits = () => {
    allType.forEach((type) => {
      putCreditsData(type, 5, -1).then(() => {
        updateCreditsState(type, 5);
      });
    });
  };

  return {
    updateCreditsState,
    deleteCredits,
    resetCredits,
    updateAlertState,
  };
};

export default useCreditActions;
