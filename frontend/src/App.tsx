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

  // reset queue
  function resetQueue() {
    setQueue([]);
    // setAlertA(false);
    // setAlertB(false);
    // setAlertC(false);
  }

  // reset crédits and delete credits -- only for dev mode
  function deleteCredits() {
    console.clear();
    // ==== Reset A --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/A`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 0 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits A (updated) =>", data.number);
        setCreditsA(0); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    // ==== Reset B --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/B`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 0 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits B (updated) =>", data.number);
        setCreditsB(0); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    // ==== Reset C --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/C`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 0 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits C (updated) =>", data.number);
        setCreditsC(0); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function resetCredits() {
    console.clear();
    // ==== Reset A --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/A`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 5 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits A (updated) =>", data.number);
        setCreditsA(5); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    // ==== Reset B --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/B`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 5 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits B (updated) =>", data.number);
        setCreditsB(5); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    // ==== Reset C --- update BDD + state local ====
    fetch(`http://localhost:${PORT}/api/credits/C`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: 5 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Credits C (updated) =>", data.number);
        setCreditsC(5); // Maj state local
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // add action in queue
  function addInQueue(actionType: string) {
    setQueue((previousQueue) => [...previousQueue, actionType]);
  }

  // mets en forme visuellement la queue actuelle
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

  // ====== (Execute 1x - on reload) ======
  useEffect(() => {
    function fetchDataForLocalState() {
      // console.log("Fetch DATA");
      // == Credit A
      fetch(`http://localhost:${PORT}/api/credits/A`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Set data -> state
          // console.log("Credit A:", data.number);
          setCreditsA(data.number); // --- ERREUR ---- prend le dessus sur le generate
        })
        .catch((error) => {
          setCreditsA("-");
          console.error("There was a problem with the fetch operation:", error);
        });
      // == Credit B
      fetch(`http://localhost:${PORT}/api/credits/B`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Set data -> state
          // console.log("Credit B data:", data);
          setCreditsB(data.number);
        })
        .catch((error) => {
          setCreditsB("-");
          console.error("There was a problem with the fetch operation:", error);
        });
      // == Credit C
      fetch(`http://localhost:${PORT}/api/credits/C`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Set data -> state
          // console.log("Credit C data:", data);
          setCreditsC(data.number);
        })
        .catch((error) => {
          setCreditsC("-");
          console.error("There was a problem with the fetch operation:", error);
        });
    }
    fetchDataForLocalState();
    // ======= (Fetch every 15s) =======
    const intervalId = setInterval(fetchDataForLocalState, 15000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  //

  // ============ Interval 15sec // Execute les actions ============
  useEffect(() => {
    // Action (re-check if i have enough credit)
    async function actionA() {
      try {
        // GET pour récup les données les plus récentes de la base de données
        const responseGet = await fetch(
          `http://localhost:${PORT}/api/credits/A`
        );
        if (!responseGet.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await responseGet.json();
        // Données récupérées depuis la base de données
        const databaseCreditsA = data.number;
        if (databaseCreditsA > 0) {
          // Update BDD with good data
          const responsePut = await fetch(
            `http://localhost:${PORT}/api/credits/A`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ number: databaseCreditsA - 1 }),
            }
          );
          if (!responsePut.ok) {
            throw new Error("Network response was not ok");
          }
          // Mettre à jour l'état local avec la nouvelle valeur des crédits
          setCreditsA(databaseCreditsA - 1);
          console.log("Credits A (updated) =>", databaseCreditsA - 1);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    async function actionB() {
      try {
        // GET pour récup les données les plus récentes de la base de données
        const responseGet = await fetch(
          `http://localhost:${PORT}/api/credits/B`
        );
        if (!responseGet.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await responseGet.json();
        // Données récupérées depuis la base de données
        const databaseCreditsB = data.number;
        if (databaseCreditsB > 0) {
          // Update BDD with good data
          const responsePut = await fetch(
            `http://localhost:${PORT}/api/credits/B`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ number: databaseCreditsB - 1 }),
            }
          );
          if (!responsePut.ok) {
            throw new Error("Network response was not ok");
          }
          // Mettre à jour l'état local avec la nouvelle valeur des crédits
          setCreditsB(databaseCreditsB - 1);
          console.log("Credits B (updated) =>", databaseCreditsB - 1);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    async function actionC() {
      try {
        // GET pour récup les données les plus récentes de la base de données
        const responseGet = await fetch(
          `http://localhost:${PORT}/api/credits/C`
        );
        if (!responseGet.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await responseGet.json();
        // Données récupérées depuis la base de données
        const databaseCreditsC = data.number;
        if (databaseCreditsC > 0) {
          // Update BDD with good data
          const responsePut = await fetch(
            `http://localhost:${PORT}/api/credits/C`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ number: databaseCreditsC - 1 }),
            }
          );
          if (!responsePut.ok) {
            throw new Error("Network response was not ok");
          }
          // Mettre à jour l'état local avec la nouvelle valeur des crédits
          setCreditsC(databaseCreditsC - 1);
          console.log("Credits C (updated) =>", databaseCreditsC - 1);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    function executeAction(type: string) {
      if (type === "A") {
        actionA();
      }
      if (type === "B") {
        actionB();
      }
      if (type === "C") {
        actionC();
      }
    }

    function checkCreditForAction(type: string) {
      if (type === "A" && creditsA !== null) {
        if (typeof creditsA === "number" && creditsA > 0) {
          return true;
        } else {
          // alerte
          console.log("Crédit insuffisant: A");
          setAlertA(true);
          return false;
        }
      }
      if (type === "B") {
        if (typeof creditsB === "number" && creditsB > 0) {
          return true;
        } else {
          console.log("Crédit insuffisant: B");
          setAlertB(true);
          return false;
        }
      }
      if (type === "C") {
        if (typeof creditsC === "number" && creditsC > 0) {
          return true;
        } else {
          console.log("Crédit insuffisant: C");
          setAlertC(true);
          return false;
        }
      }
    }

    function nextAction() {
      // Check if "action" waiting in queue
      if (queue.length > 0) {
        // -- console.log
        console.clear();
        // console.log(queue);
        const type = queue[0]; // Get the next "action" (ex : "A")
        const haveCredit = checkCreditForAction(type); // Check if we have crédits for this "action"
        // --- Execute l'action
        if (haveCredit) {
          executeAction(type); // execute "action"
          setQueue((previousQueue) => previousQueue.slice(1)); // retire l'action (éxécuté) du tableau
        } else {
          setQueue((previousQueue) => previousQueue.slice(1)); // retire l'action (non éxécuté) du tableau
        }
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
      if (creditsA === 0 && queue.includes("A")) {
        console.log("Remove A from queue");
        const newQueue = queue.filter((item) => item !== "A");
        setQueue(newQueue);
      }
      if (creditsB === 0 && queue.includes("B")) {
        console.log("Remove B from queue");
        const newQueue = queue.filter((item) => item !== "B");
        setQueue(newQueue);
      }
      if (creditsC === 0 && queue.includes("C")) {
        console.log("Remove C from queue");
        const newQueue = queue.filter((item) => item !== "C");
        setQueue(newQueue);
      }
    }
    // => Inverval (15s) - 1s
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
        {/* only for dev mode */}
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
      {/* fin main container */}
    </>
  );
}

export default App;
