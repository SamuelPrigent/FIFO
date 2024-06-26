// react
import { useState, useEffect, useRef, useMemo } from "react";
// style
import "./style/reset.css";
import "./style/App.scss";
// assets
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
// components
import CreditsElementList from "./components/CreditsElementList.tsx";
import ActionButtonList from "./components/ActionButtonList.tsx";
import QueueList from "./components/QueueList";
import AlertList from "./components/AlertList.tsx";
// api requests
import { fetchCreditsData, putCreditsData } from "./api/creditsRequests";
// hooks
import { useSocketio } from "./hooks/useSocketio";
import { getAllDataAndUpdateState } from "./hooks/useSWR.tsx";
// zustand state
import useQueueStore from "./store/useQueueStore";
// -----
import { TypeOfCredits, TypeOfAlerts } from "./types/types.ts"; // types
import { useCreditActions } from "./utils/useCreditActions.ts"; // utils
import { allType } from "./constants/constants.ts"; // constants
// -----

function App() {
  // Utilisé pour créer un interval de queue calculé
  const [isPaused, setIsPaused] = useState<any>(false);
  const intervalIdRef = useRef<any>(null);
  const startTimeRef = useRef<any>(null);
  const elapsedTimeRef = useRef<any>(0);

  // === Credits state { key: value, key2: value } ===
  const initialCreditsState = useMemo(() => {
    return allType.reduce((acc: TypeOfCredits, type: keyof TypeOfCredits) => {
      acc[type] = null;
      return acc;
    }, {});
  }, [allType]);

  // === Alert state { key: value, key2: value } ===
  const initialAlertsState = useMemo(() => {
    return allType.reduce((acc: TypeOfAlerts, type: keyof TypeOfAlerts) => {
      acc[type] = false;
      return acc;
    }, {});
  }, [allType]);
  // =====
  const [credits, setCredits] = useState<TypeOfCredits>(initialCreditsState);
  const [alerts, setAlerts] = useState<TypeOfAlerts>(initialAlertsState);

  // ====== Edit state for credits and alert ======
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
  getAllDataAndUpdateState(updateCreditsState);

  // ========= Gestion of action execution and queueStore update =========
  // Execute 1 action
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

  // Find nextAction
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
    // Update queue une seule fois avec les modifs potentielles
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

  // Démarre l'interval selon un temps calculé 1sec ou moins avec un délai calculé s'il y'a eu une pause
  function handleStartInterval(customDelay = 1 * 1000) {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(() => {
      nextAction();
      startTimeRef.current = Date.now(); // Réinitialise ce temps pour le prochain intervalle
    }, customDelay);
  }

  // Pause temporaire de 500ms à chaque ajout d'action dans queueStore
  useEffect(() => {
    if (queueStore.length > 0) {
      setIsPaused(true);
      const timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [queueStore]);

  // Pause et reprise de l'intervalle // avec temps custom selon
  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalIdRef.current); // clear l'ancien interval
      elapsedTimeRef.current = Date.now() - startTimeRef.current; // calcul le temps écoulé dans l'interval
    } else {
      // Soustrait le temps déjà attendu pour le prochain interval
      const remainingTime = 1 * 1000 - elapsedTimeRef.current;
      handleStartInterval(Math.max(remainingTime, 500)); // Temps minimal 500ms
    }
  }, [isPaused]);

  // Interval initial 1sec
  useEffect(() => {
    startTimeRef.current = Date.now();
    handleStartInterval();
    return () => clearInterval(intervalIdRef.current);
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
