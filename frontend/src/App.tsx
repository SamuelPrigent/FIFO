// react
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
// style
import "./style/reset.css";
import "./style/App.css";
// assets
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
// socket
import io from "socket.io-client";
// components
import ActionButton from "./components/ActionButton";
import Alert from "./components/Alert";
import CreditSection from "./components/CreditSection";

function App() {
  const [queue, setQueue] = useState<string[]>([]);
  const [creditsA, setCreditsA] = useState<number | string | null>(null);
  const [creditsB, setCreditsB] = useState<number | string | null>(null);
  const [creditsC, setCreditsC] = useState<number | string | null>(null);
  const [alertA, setAlertA] = useState<boolean>(false);
  const [alertB, setAlertB] = useState<boolean>(false);
  const [alertC, setAlertC] = useState<boolean>(false);

  // ============ Request functions ============

  interface CreditData {
    _id: string;
    name: string;
    number: number;
    maxNumber: number;
    __v: number;
  }

  // fetch data return data
  async function fetchCreditsData(name: string): Promise<CreditData> {
    return fetch(`http://localhost:${PORT}/api/credits/${name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json() as Promise<CreditData>;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
  }

  // function putCreditsData(name: string, number: number, version: number) {
  function putCreditsData(
    name: string,
    number: number,
    version: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(`http://localhost:${PORT}/api/credits/${name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: number, __v: version }),
      })
        .then((response) => {
          if (!response.ok) {
            reject(new Error("Network response was not ok"));
          }
          return response.json();
        })
        .then((data) => {
          if (data && "number" in data) {
            eval(`setCredits${name}(${number})`);
            // console.log(`Credits ${name} (updated) =>`, data.number);
          }
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          reject(error);
        });
    });
  }

  // ============================

  function resetQueue() {
    setQueue([]);
  }

  function deleteCredits() {
    console.clear();
    putCreditsData("A", 0, -1);
    putCreditsData("B", 0, -1);
    putCreditsData("C", 0, -1);
  }

  function resetCredits() {
    console.clear();
    putCreditsData("A", 5, -1);
    putCreditsData("B", 5, -1);
    putCreditsData("C", 5, -1);
  }

  function addInQueue(actionType: string) {
    setQueue((previousQueue) => [...previousQueue, actionType]);
  }

  // Mise en forme de la queue en composant
  function QueueListComponent({ queue }: { queue: string[] }) {
    return (
      <div className="queueListComponent">
        {queue.map((item, index) => (
          <React.Fragment key={index}>
            <div className="taskContainer">
              {index !== 0 && <span className="arrowQueue"> -&gt; </span>}
              <span className={`task${item}`}>{item}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  QueueListComponent.propTypes = {
    queue: PropTypes.arrayOf(PropTypes.string),
    map: PropTypes.string,
  };

  // ====== Fetch data for local state (on reload + every 25sec) ======
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

    // ======== Get data via Socket ========
    const socket = io(`http://localhost:${PORT}`); // socket.io écoute l'url du back
    // Ecoute "creditsUpdated" depuis le back
    socket.on("creditsUpdated", (data) => {
      // console.log(data.message);
      if (data.creditsA) {
        setCreditsA(`${data.creditsA}`);
      }
      if (data.creditsB) {
        setCreditsB(`${data.creditsB}`);
      }
      if (data.creditsC) {
        setCreditsC(`${data.creditsC}`);
      }
    });

    // ======== Demontage composant  ========
    return () => {
      socket.disconnect(); // Déconnexion du serveur de sockets
    };
  }, []);
  //

  // ============ Interval 1sec // Execute les actions ============
  useEffect(() => {
    // Action (fetch data in Database before -1)
    async function executeActionByType(type: string) {
      try {
        const creditsData = await fetchCreditsData(`${type}`); // get data : fetchCreditsData("A")
        const databaseCredits = creditsData.number; // get : data.number // check via database
        if (databaseCredits > 0) {
          putCreditsData(`${type}`, databaseCredits - 1, creditsData.__v) // Update Database with data
            .then(() => {
              if (type === "A") {
                setCreditsA(databaseCredits - 1); // PUT réussis ==> update local state
              }
              if (type === "B") {
                setCreditsB(databaseCredits - 1); // PUT réussis ==> update local state
              }
              if (type === "C") {
                setCreditsC(databaseCredits - 1); // PUT réussis ==> update local state
              }
            })
            .catch(async () => {
              console.log(`Credits ${type} (retry-update)`);
              const updatedCreditsData = await fetchCreditsData(`${type}`);
              putCreditsData(
                `${type}`,
                updatedCreditsData.number - 1,
                updatedCreditsData.__v
              );
              if (type === "A") {
                setCreditsA(databaseCredits - 1); // PUT réussis ==> update local state
              }
              if (type === "B") {
                setCreditsB(databaseCredits - 1); // PUT réussis ==> update local state
              }
              if (type === "C") {
                setCreditsC(databaseCredits - 1); // PUT réussis ==> update local state
              }
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
        // console.log(queue);
        // console.clear();
        const nextActionInQueue = queue[0]; // Get the next "action" (ex : "A")
        // --- Execute l'action
        executeActionByType(nextActionInQueue);
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
              <QueueListComponent queue={queue} />
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
