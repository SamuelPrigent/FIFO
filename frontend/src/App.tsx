// react
import { useState, useEffect } from "react";
// style
import "./style/reset.css";
import "./style/App.css";
// assets
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
// components
import ActionButton from "./components/ActionButton";
import Alert from "./components/Alert";
import CreditSection from "./components/CreditSection";
import QueueList from "./components/QueueList";
// request api
import { fetchCreditsData, putCreditsData } from "./api/creditsApi";
// custom hook
import { useSocketio } from "./hooks/useSocketio";

function App() {
  const [queue, setQueue] = useState<string[]>([]);
  const [creditsA, setCreditsA] = useState<number | string | null>(null);
  const [creditsB, setCreditsB] = useState<number | string | null>(null);
  const [creditsC, setCreditsC] = useState<number | string | null>(null);
  const [alertA, setAlertA] = useState<boolean>(false);
  const [alertB, setAlertB] = useState<boolean>(false);
  const [alertC, setAlertC] = useState<boolean>(false);

  // === Edit state by type ===

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

  // =============

  function resetQueue() {
    setQueue([]);
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
    setQueue((previousQueue) => [...previousQueue, actionType]);
  }

  // ========= useEffect Socket-io  =========
  useSocketio(setCreditsA, setCreditsB, setCreditsC);

  // ====== Fetch data for local state (on reload) ======
  useEffect(() => {
    async function fetchDataForLocalState() {
      const creditsAData = await fetchCreditsData("A"); // fetch credits A data
      setCreditsA(creditsAData.number); // update local state
      const creditsBData = await fetchCreditsData("B"); // fetch credits B data
      setCreditsB(creditsBData.number); // update local state
      const creditsCData = await fetchCreditsData("C"); // fetch credits B data
      setCreditsC(creditsCData.number); // update local state
    }
    fetchDataForLocalState(); // on reload
  }, []);
  //

  // ======= Interval 1sec => Execute les actions =======
  useEffect(() => {
    // Action (fetch data in Database before -1)
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
      if (queue.length > 0) {
        // console.clear();
        const nextActionInQueue = queue[0]; // get next "action" (ex : "A")
        executeActionByType(nextActionInQueue); // execute l'action
        setQueue((previousQueue) => previousQueue.slice(1)); // retire l'action (éxécuté) du tableau
      } else {
        // Pas d'alerte si aucune action n'est en atente
        setAlertA(false);
        setAlertB(false);
        setAlertC(false);
      }
      // Check credits for alert
      if (
        (typeof creditsA === "number" && creditsA > 0) ||
        !queue.includes("A")
      ) {
        setAlertA(false);
      }
      if (
        (typeof creditsB === "number" && creditsB > 0) ||
        !queue.includes("B")
      ) {
        setAlertB(false);
      }
      if (
        (typeof creditsC === "number" && creditsC > 0) ||
        !queue.includes("C")
      ) {
        setAlertC(false);
      }
      // Retire les éléments du tableau qui n'ont plus de crédits
      if (queue[0] === "A" && creditsA === 0 && queue.includes("A")) {
        // console.log("Remove A from queue");
        const newQueue = queue.filter((item) => item !== "A");
        setQueue(newQueue);
      }
      if (queue[0] === "B" && creditsB === 0 && queue.includes("B")) {
        // console.log("Remove B from queue");
        const newQueue = queue.filter((item) => item !== "B");
        setQueue(newQueue);
      }
      if (queue[0] === "C" && creditsC === 0 && queue.includes("C")) {
        // console.log("Remove C from queue");
        const newQueue = queue.filter((item) => item !== "C");
        setQueue(newQueue);
      }
    }
    // => Inverval (1s)
    const intervalIdNextAction = setInterval(nextAction, 1000); // nextAction()
    return () => {
      clearInterval(intervalIdNextAction);
    };
  }, [queue, creditsA, creditsB, creditsC]);

  return (
    <>
      <div className="navBar">
        <div className="appTitle">FIFO</div>
        <div className="creditsSection">
          <CreditSection type="A" stateValue={creditsA} />
          <CreditSection type="B" stateValue={creditsB} />
          <CreditSection type="C" stateValue={creditsC} />
        </div>
        {/* button for dev mode */}
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
            {queue.length !== 0 ? (
              <img
                onClick={() => resetQueue()}
                src={reset2}
                className="resetSvg2"
              />
            ) : (
              ""
            )}
          </div>
          <div className="queueList">
            {queue.length !== 0 ? (
              <QueueList queue={queue} />
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
