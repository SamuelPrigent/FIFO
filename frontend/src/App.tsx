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
  // Zustand for local storage management
  const {
    queueStore,
    setQueueLS,
    addInQueueLS,
    resetQueueLS,
    removeActionFromQueueLS,
  } = useQueueStore();

  // Array : type of actions
  const allType = ["A", "B", "C"];

  // ====== Edit or get state (credits, alert) ======
  // -- get credits state // non scalable ???
  function getCreditsState(type: string): number | string | null {
    switch (type) {
      case "A":
        return creditsA;
      case "B":
        return creditsB;
      case "C":
        return creditsC;
      default:
        console.error("Type inconnu:", type);
        return null;
    }
  }

  // -- update credits state // non scalable ???
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

  // -- update alert state // non scalable ???
  function updateAlertState(type: string, value: boolean) {
    switch (type) {
      case "A":
        setAlertA(value);
        break;
      case "B":
        setAlertB(value);
        break;
      case "C":
        setAlertC(value);
        break;
      default:
        console.error("Type inconnu:", type);
    }
  }

  function deleteCredits() {
    console.clear();
    allType.forEach((type) => {
      putCreditsData(type, 0, -1);
    });
    // non scalable ??? => rajoute 1 par 1 les setState
    setCreditsA(0);
    setCreditsB(0);
    setCreditsC(0);
  }

  function resetCredits() {
    console.clear();
    allType.forEach((type) => {
      putCreditsData(type, 5, -1);
    });
    // non scalable ??? => rajoute 1 par 1 les setState
    setCreditsA(5);
    setCreditsB(5);
    setCreditsC(5);
  }

  function addInQueue(actionType: string) {
    addInQueueLS(actionType); // local storage
  }

  // ========= useEffect Socket-io (get creditsData from back instantly)  =========
  // non scalable ??? => rajouter 1 par 1 les setState
  useSocketio(setCreditsA, setCreditsB, setCreditsC);

  // ========= Fetch data for local state (on reload) =========
  // non scalable ??? => rajouter 1 par 1 les setState
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
          updateAlertState(type, false);
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
          updateAlertState(type, false);
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
          {alertA ? <Alert message="Crédit insuffisant : A" /> : null}
          {alertB ? <Alert message="Crédit insuffisant : B" /> : null}
          {alertC ? <Alert message="Crédit insuffisant : C" /> : null}
        </div>
      </div>
    </>
  );
}

export default App;
