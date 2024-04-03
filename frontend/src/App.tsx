// react
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
// style
import "./style/reset.css";
import "./style/App.css";
// assets
import credit from "./assets/credit.svg";
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode
import cross from "./assets/cross.svg"; // dev mode
//

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
            console.log(`Credits ${name} (updated) =>`, data.number);
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

  // ====== Fetch data for local state (on reload + every 10sec) ======
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
    //
    // ======= (Interval on Fetch every 25s) =======
    const intervalId = setInterval(fetchDataForLocalState, 25 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  //

  // ============ Interval 1sec // Execute les actions ============
  useEffect(() => {
    // Action (fetch data in Database before -1)
    async function actionA() {
      try {
        const creditsData = await fetchCreditsData("A"); // get data : fetchCreditsData("A")
        const databaseCreditsA = creditsData.number; // get : data.number // check via database
        if (databaseCreditsA > 0) {
          putCreditsData("A", databaseCreditsA - 1, creditsData.__v) // Update Database with data
            .then(() => {
              setCreditsA(databaseCreditsA - 1); // PUT réussis ==> update local state
            })
            .catch(async () => {
              console.log("Credits A (retry-update)");
              const updatedCreditsData = await fetchCreditsData("A");
              putCreditsData(
                "A",
                updatedCreditsData.number - 1,
                updatedCreditsData.__v
              );
              setCreditsA(updatedCreditsData.number - 1);
            });
        } else {
          setAlertA(true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    async function actionB() {
      try {
        const creditsData = await fetchCreditsData("B"); // get data : fetchCreditsData("B")
        const databaseCreditsB = creditsData.number; // get : data.number // check via database
        if (databaseCreditsB > 0) {
          putCreditsData("B", databaseCreditsB - 1, creditsData.__v) // Update Database with data
            .then(() => {
              setCreditsB(databaseCreditsB - 1); // PUT réussis ==> update local state
            })
            .catch(async () => {
              console.log("Credits B (retry-update)");
              const updatedCreditsData = await fetchCreditsData("B");
              putCreditsData(
                "B",
                updatedCreditsData.number - 1,
                updatedCreditsData.__v
              );
              setCreditsB(updatedCreditsData.number - 1);
            });
        } else {
          setAlertB(true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    async function actionC() {
      try {
        const creditsData = await fetchCreditsData("C"); // get data : fetchCreditsData("C")
        const databaseCreditsC = creditsData.number; // get : data.number // check via database
        if (databaseCreditsC > 0) {
          putCreditsData("C", databaseCreditsC - 1, creditsData.__v) // Update Database with data
            .then(() => {
              setCreditsC(databaseCreditsC - 1); // PUT réussis ==> update local state
            })
            .catch(async () => {
              console.log("Credits C (retry-update)");
              const updatedCreditsData = await fetchCreditsData("C");
              putCreditsData(
                "C",
                updatedCreditsData.number - 1,
                updatedCreditsData.__v
              );
              setCreditsC(updatedCreditsData.number - 1);
            });
        } else {
          setAlertC(true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    function executeAction(nextActionInQueue: string) {
      if (nextActionInQueue === "A") {
        actionA();
      }
      if (nextActionInQueue === "B") {
        actionB();
      }
      if (nextActionInQueue === "C") {
        actionC();
      }
    }

    function nextAction() {
      // Check if "action" waiting in queue
      if (queue.length > 0) {
        // console.log(queue);
        console.clear();
        const nextActionInQueue = queue[0]; // Get the next "action" (ex : "A")
        // --- Execute l'action
        executeAction(nextActionInQueue); // execute "action"
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
        console.log("Remove A from queue");
        const newQueue = queue.filter((item) => item !== "A");
        setQueue(newQueue);
      }
      if (queue[0] === "B" && creditsB === 0 && queue.includes("B")) {
        console.log("Remove B from queue");
        const newQueue = queue.filter((item) => item !== "B");
        setQueue(newQueue);
      }
      if (queue[0] === "C" && creditsC === 0 && queue.includes("C")) {
        console.log("Remove C from queue");
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
          <div className="creditSection">
            <div>A :</div>
            <div>{creditsA}</div>
            <img src={credit} className="creditSvg" />
          </div>
          <div className="creditSection">
            <div>B :</div>
            <div>{creditsB}</div>
            <img src={credit} className="creditSvg" />
          </div>
          <div className="creditSection">
            <div>C :</div>
            <div>{creditsC}</div>
            <img src={credit} className="creditSvg" />
          </div>
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
            <button
              className="buttonType"
              id="typeA"
              onClick={() => addInQueue("A")}
            >
              Type A
            </button>
            <button
              className="buttonType"
              id="typeB"
              onClick={() => addInQueue("B")}
            >
              Type B
            </button>
            <button
              className="buttonType"
              id="typeC"
              onClick={() => addInQueue("C")}
            >
              Type C
            </button>
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
          {alertA ? (
            <div className="alertText">{"Crédit insuffisant: A"}</div>
          ) : null}
          {alertB ? (
            <div className="alertText">{"Crédit insuffisant: B"}</div>
          ) : null}
          {alertC ? (
            <div className="alertText">{"Crédit insuffisant: C"}</div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
