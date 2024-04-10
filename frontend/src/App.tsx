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
import ActionButton from "./components/ActionButton";
import Alert from "./components/Alert";
import CreditSection from "./components/CreditSection";
import QueueList from "./components/QueueList";
// api requests
import { fetchCreditsData, putCreditsData } from "./api/creditsRequests";
// hooks
import { useSocketio } from "./hooks/useSocketio";
import { useFetchAndSetCredits } from "./hooks/useFetchAndSetCredits";
// zustand state
import useQueueStore from "./store/useQueueStore";

function App() {
  const [creditsA, setCreditsA] = useState<number | string | null>(null);
  const [creditsB, setCreditsB] = useState<number | string | null>(null);
  const [creditsC, setCreditsC] = useState<number | string | null>(null);
  const [alertA, setAlertA] = useState<boolean>(false);
  const [alertB, setAlertB] = useState<boolean>(false);
  const [alertC, setAlertC] = useState<boolean>(false);
  // Zustand - local storage gestion for global state
  const {
    queueStore,
    setQueueLS,
    addInQueueLS,
    resetQueueLS,
    removeActionFromQueueLS,
  } = useQueueStore();

  // ====== Edit state ======
  function updateCreditsState(type: string, number: number) {
    switch (type) {
      case "A":
        setCreditsA(number);
        break;
      case "B":
        setCreditsB(number);
        break;
      case "C":
        setCreditsC(number);
        break;
      default:
        console.error("Type inconnu:", type);
    }
  }

  function resetQueue() {
    resetQueueLS(); // local storage
  }

  function deleteCredits() {
    console.clear();
    putCreditsData("A", 0, -1);
    setCreditsA(0);
    putCreditsData("B", 0, -1);
    setCreditsB(0);
    putCreditsData("C", 0, -1);
    setCreditsC(0);
  }

  function resetCredits() {
    console.clear();
    putCreditsData("A", 5, -1);
    setCreditsA(5);
    putCreditsData("B", 5, -1);
    setCreditsB(5);
    putCreditsData("C", 5, -1);
    setCreditsC(5);
  }

  function addInQueue(actionType: string) {
    addInQueueLS(actionType); // local storage
  }

  // ========= useEffect Socket-io (get creditsData from back instantly)  =========
  useSocketio(setCreditsA, setCreditsB, setCreditsC);

  // ========= Fetch data for local state (on reload) =========
  useFetchAndSetCredits(setCreditsA, setCreditsB, setCreditsC);

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
          if (type === "A") {
            setAlertA(true);
          }
          if (type === "B") {
            setAlertB(true);
          }
          if (type === "C") {
            setAlertC(true);
          }
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
        // Pas d'alerte si aucune action n'est en atente
        setAlertA(false);
        setAlertB(false);
        setAlertC(false);
      }
      // Pas d'alerte si pas de crédits X en attente ou si crédits de X > à 0
      if (
        (typeof creditsA === "number" && creditsA > 0) ||
        !queueStore.includes("A")
      ) {
        setAlertA(false);
      }
      if (
        (typeof creditsB === "number" && creditsB > 0) ||
        !queueStore.includes("B")
      ) {
        setAlertB(false);
      }
      if (
        (typeof creditsC === "number" && creditsC > 0) ||
        !queueStore.includes("C")
      ) {
        setAlertC(false);
      }
      // Retire les éléments du tableau qui n'ont plus de crédits
      if (queueStore[0] === "A" && creditsA === 0 && queueStore.includes("A")) {
        // console.log("Remove A from queue");
        const newQueue = queueStore.filter((item) => item !== "A");
        setQueueLS(newQueue); // local storage
      }
      if (queueStore[0] === "B" && creditsB === 0 && queueStore.includes("B")) {
        // console.log("Remove B from queue");
        const newQueue = queueStore.filter((item) => item !== "B");
        setQueueLS(newQueue); // local storage
      }
      if (queueStore[0] === "C" && creditsC === 0 && queueStore.includes("C")) {
        // console.log("Remove C from queue");
        const newQueue = queueStore.filter((item) => item !== "C");
        setQueueLS(newQueue); // local storage
      }
    }
    // => Inverval (1s)
    const intervalIdNextAction = setInterval(nextAction, 1000); // nextAction()
    return () => {
      clearInterval(intervalIdNextAction);
    };
  }, [queueStore, creditsA, creditsB, creditsC]);

  return (
    <>
      <div className="navBar">
        <div className="appTitle">FIFO</div>
        <div className="creditsSection">
          <CreditSection type="A" stateValue={creditsA} />
          <CreditSection type="B" stateValue={creditsB} />
          <CreditSection type="C" stateValue={creditsC} />
        </div>
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
          <div className="titleElement">{"Liste d'actions"}</div>
          <div className="buttonContainer">
            <ActionButton actionType="A" addActionToQueue={addInQueue} />
            <ActionButton actionType="B" addActionToQueue={addInQueue} />
            <ActionButton actionType="C" addActionToQueue={addInQueue} />
          </div>
        </div>
        <div className="sectionContainer">
          <div className="queueTitleSection">
            <div className="titleElement">{"Actions suivantes"}</div>
            {queueStore.length !== 0 ? (
              <img
                onClick={() => resetQueue()}
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
          {alertA ? <Alert message="Crédit insuffisant : A" /> : null}
          {alertB ? <Alert message="Crédit insuffisant : B" /> : null}
          {alertC ? <Alert message="Crédit insuffisant : C" /> : null}
        </div>
      </div>
    </>
  );
}

export default App;
