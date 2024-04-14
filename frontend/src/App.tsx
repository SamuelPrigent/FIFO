// react
import { useState, useEffect, useRef } from "react";
// style
import "./style/reset.css";
import "./style/App.scss";
// assets
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
// components
// import Alert from "./components/Alert";
import AlertList from "./components/AlertList.tsx";
import CreditsElementList from "./components/CreditsElementList.tsx";
import ActionButtonList from "./components/ActionButtonList.tsx";
import QueueList from "./components/QueueList";
// api requests
import { fetchCreditsData, putCreditsData } from "./api/creditsRequests";
// hooks
import { useSocketio } from "./hooks/useSocketio";
import { useFetchAndSetCredits } from "./hooks/useFetchAndSetCredits";
// zustand state
import useQueueStore from "./store/useQueueStore";
// -----
import { TypeOfCredits, TypeOfAlerts } from "./types/types.ts"; // types
import { useCreditActions } from "./utils/useCreditActions.ts"; // utils
import { allType } from "./constants/constants.ts";

// -----

function App() {
  // Objet généré via allType permettant de créer le state => credits
  const initialCreditsState = allType.reduce(
    (acc: TypeOfCredits, type: keyof TypeOfCredits) => {
      acc[type] = null;
      return acc;
    },
    {} as TypeOfCredits
  );

  // Objet généré via allType permettant de créer le state => alerts
  const initialAlertsState = allType.reduce(
    (acc: TypeOfAlerts, type: keyof TypeOfAlerts) => {
      acc[type] = false;
      return acc;
    },
    {} as TypeOfAlerts
  );

  // State généré via array allType et ses éléments : ["A", "B", "C", ...]
  const [credits, setCredits] = useState<TypeOfCredits>(initialCreditsState);
  const [alerts, setAlerts] = useState<TypeOfAlerts>(initialAlertsState);

  // ====== Credits and Alert state handle (by type) ======
  const { updateCreditsState, updateAlertState, deleteCredits, resetCredits } =
    useCreditActions(setCredits, setAlerts, allType);

  // ====== Import zustand for local storage management ======
  const {
    queueStore,
    setQueueLS,
    addInQueueLS,
    resetQueueLS,
    removeActionFromQueueLS,
  } = useQueueStore();

  // =========== UseRef to get updated state value ==========
  // queueStoreRef
  const queueStoreRef = useRef(queueStore);
  useEffect(() => {
    queueStoreRef.current = queueStore;
  }, [queueStore]);
  // creditsRef
  const creditsRef = useRef(credits);
  useEffect(() => {
    creditsRef.current = credits;
  }, [credits]);
  // AlertsRef
  const AlertsRef = useRef(alerts);
  useEffect(() => {
    AlertsRef.current = alerts;
  }, [alerts]);

  // ========= useEffect Socket-io (get creditsData from back instantly)  =========
  useSocketio(updateCreditsState, allType);

  // ========= Fetch data for local state for all type of credits (on reload) =========
  allType.forEach((type) => {
    useFetchAndSetCredits(updateCreditsState, type);
  });

  // ========= Gestion of action execution and queueStore update =========
  // execute 1 action
  async function executeActionByType(type: string) {
    try {
      const creditsData = await fetchCreditsData(`${type}`); // get data
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

  // check alerts and disable it after 2.5 sec
  function checkAndPopAlerts(type: string, creditsX: number, queue: string[]) {
    if (creditsX === 0 && queue.includes(type)) {
      updateAlertState(type, true);
      setTimeout(() => {
        updateAlertState(type, false);
      }, 2500);
    }
  }

  // find next action
  function nextAction() {
    // Copie initiale de la queue actuelle
    let newQueue = [...queueStoreRef.current];
    // Boucle
    allType.forEach((type) => {
      const creditsX = creditsRef.current[type];
      // check alert avant de filtré la queue
      checkAndPopAlerts(type, creditsX as number, newQueue);
      // Remove creditsX with no credits from newQueue
      if (creditsX === 0 && newQueue.includes(type)) {
        newQueue = newQueue.filter((item) => item !== type);
      }
    });
    // Update queue une fois avec les modif potentiellement apportées
    if (newQueue.length !== queueStoreRef.current.length) {
      setQueueLS(newQueue);
      queueStoreRef.current = newQueue;
    }
    // Exécuter l'action si la queue n'est pas vide
    if (newQueue.length > 0) {
      const nextActionInQueue = newQueue[0];
      executeActionByType(nextActionInQueue);
      removeActionFromQueueLS(0);
    }
  }

  // => Inverval (1.7s)
  useEffect(() => {
    const intervalIdNextAction = setInterval(nextAction, 1.7 * 1000);
    return () => {
      clearInterval(intervalIdNextAction);
    };
  }, []);

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
            <CreditsElementList allType={allType} credits={credits} />
          </div>
        </div>
        <div className="sectionContainer">
          <div className="titleElement">{"Liste d'actions"}</div>
          <div className="buttonContainer">
            <ActionButtonList
              allType={allType}
              addActionToQueue={addInQueueLS}
            />
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
          <AlertList allType={allType} alerts={alerts} />
        </div>
      </div>
    </>
  );
}

export default App;
