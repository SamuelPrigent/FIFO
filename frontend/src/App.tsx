// react
import { useState, useEffect } from "react";
// style
import "./style/reset.css";
import "./style/App.scss";
// assets
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
// components
import CreditsList from "./components/CreditsList";
import ActionButton from "./components/ActionButton";
import QueueList from "./components/QueueList";
import Alert from "./components/Alert";
// api requests
import { fetchCreditsData, putCreditsData } from "./api/creditsRequests";
// hooks
import { useSocketio } from "./hooks/useSocketio";
import { useFetchAndSetCredits } from "./hooks/useFetchAndSetCredits";
// zustand state
import useQueueStore from "./store/useQueueStore";
// types
import { TypeOfCredits, TypeOfAlerts } from "./types/types.ts";

function App() {
  // allType
  const allType: Array<keyof TypeOfCredits> = ["A", "B", "C"];

  // ======= state variables =======
  // credits
  const [credits, setCredits] = useState<TypeOfCredits>({
    A: null,
    B: null,
    C: null,
  });
  // alert
  const [alerts, setAlerts] = useState<TypeOfAlerts>({
    A: false,
    B: false,
    C: false,
  });

  // Zustand for local storage management
  const {
    queueStore,
    setQueueLS,
    addInQueueLS,
    resetQueueLS,
    removeActionFromQueueLS,
  } = useQueueStore();

  // ====== Edit and Get local state of credits by (type) ======

  function getCreditsState(type: keyof TypeOfCredits): number | string | null {
    // Assurez-vous que `credits` est l'état contenant tous les types de crédits.
    const creditValue = credits[type];
    if (creditValue !== undefined) {
      return creditValue;
    } else {
      console.error("Type inconnu:", type);
      return null;
    }
  }

  function updateCreditsState(type: string, value: number) {
    setCredits((prevCredits) => ({
      ...prevCredits,
      [type]: value,
    }));
  }

  function updateAlertState(type: string, value: boolean) {
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [type]: value,
    }));
  }

  function deleteCredits() {
    console.clear();
    allType.forEach((type) => {
      putCreditsData(type as string, 0, -1);
      updateCreditsState(type as string, 0);
    });
  }

  function resetCredits() {
    console.clear();
    allType.forEach((type) => {
      putCreditsData(type as string, 5, -1);
      updateCreditsState(type as string, 5);
    });
  }

  function addInQueue(actionType: string) {
    addInQueueLS(actionType); // local storage
  }

  // ========= useEffect Socket-io (get creditsData from back instantly)  =========
  useSocketio(updateCreditsState, allType as string[]);

  // ========= Fetch data for local state for all type of credits (on reload) =========
  allType.forEach((type) => {
    useFetchAndSetCredits(updateCreditsState, type as string);
  });

  // ========= Execute prochaine action de la queue => interval 1sec =========
  useEffect(() => {
    async function executeActionByType(type: string) {
      try {
        const creditsData = await fetchCreditsData(`${type}`); // get data : fetchCreditsData("A")
        const databaseCredits = creditsData.number; // get : data.number // check via database
        if (databaseCredits > 0) {
          putCreditsData(`${type}`, databaseCredits - 1, creditsData.__v) // Update Database with data
            .then(() => {
              updateCreditsState(type, databaseCredits - 1); // then update local State
            })
            .catch(async () => {
              console.log(`Credits ${type} (retry-update)`);
              const updatedCreditsData = await fetchCreditsData(`${type}`);
              putCreditsData(
                `${type}`,
                updatedCreditsData.number - 1,
                updatedCreditsData.__v
              );
              updateCreditsState(type, updatedCreditsData.number - 1);
            });
        } else {
          // set alert true
          updateAlertState(type, true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    function nextAction() {
      // Check if "action" waiting in queue
      if (queueStore.length > 0) {
        // console.clear();
        const nextActionInQueue = queueStore[0]; // get next "action" (ex : "A")
        executeActionByType(nextActionInQueue); // execute l'action
        removeActionFromQueueLS(0); // retire l'action du local storage
      } else {
        // -- Pas d'alerte si aucune action n'est en atente
        allType.forEach((type) => {
          updateAlertState(type as string, false);
        });
      }
      // check for all type of crédits
      allType.forEach((type) => {
        const creditsX = getCreditsState(type);
        // Pas d'alerte si => pas de crédits X en attente ou si crédits de X > 0
        if (
          (typeof creditsX === "number" && creditsX > 0) ||
          !queueStore.includes(`${type}`)
        ) {
          updateAlertState(type as string, false);
        }
        // Retire les éléments du tableau qui n'ont plus de crédits
        if (
          queueStore[0] === type &&
          creditsX === 0 &&
          queueStore.includes(type)
        ) {
          const newQueue = queueStore.filter((item) => item !== type);
          setQueueLS(newQueue); // local storage
        }
      });
    }
    // => Inverval (1s)
    const intervalIdNextAction = setInterval(nextAction, 1000); // nextAction()
    return () => {
      clearInterval(intervalIdNextAction);
    };
  }, [queueStore, credits]);

  return (
    <>
      <div className="navBar">
        <div className="appTitle">FIFO</div>
        {/* buttons for dev mode */}
        <div className="creditsButtonSection">
          <div className="resetCredit" onClick={() => deleteCredits()}>
            <img src={cross} className="crossSvg" />
          </div>
          <div className="resetCredit" onClick={() => resetCredits()}>
            <img src={reset} className="resetSvg" />
          </div>
        </div>
      </div>
      <div className="mainContainer">
        <div className="sectionContainer">
          <div className="titleElement">{"Crédits disponible"}</div>
          <div className="creditsContainer">
            {allType.map((type) => (
              <CreditsList key={type} type={type as string} credits={credits} />
            ))}
          </div>
        </div>
        <div className="sectionContainer">
          <div className="titleElement">{"Liste d'actions"}</div>
          <div className="buttonContainer">
            {allType.map((type) => (
              <ActionButton
                key={type}
                actionType={type as string}
                addActionToQueue={addInQueue}
              />
            ))}
          </div>
        </div>
        <div className="sectionContainer">
          <div className="queueTitleSection">
            <div className="titleElement">{"Actions suivantes"}</div>
            {queueStore.length !== 0 ? (
              <img
                onClick={() => resetQueueLS()}
                src={reset2}
                className="resetSvg2"
              />
            ) : null}
          </div>
          <div className="queueList">
            {queueStore.length !== 0 ? (
              <QueueList queue={queueStore} />
            ) : (
              "Aucune action en attente"
            )}
          </div>
          {allType.map((type) =>
            alerts[type] ? (
              <Alert key={type} message={`Crédit insuffisant : ${type}`} />
            ) : null
          )}
        </div>
      </div>
    </>
  );
}

export default App;
