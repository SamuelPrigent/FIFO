// react
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// style
import "./reset.css";
import "./App.css";
// assets
import credit from "./assets/credit.svg";
import reset2 from "./assets/reset2.svg";
import reset from "./assets/reset.svg"; // dev mode

function App() {
  //  queue
  const [queue, setQueue] = useState([]);
  // crédits
  const [creditsA, setCreditsA] = useState(20);
  const [creditsB, setCreditsB] = useState(20);
  const [creditsC, setCreditsC] = useState(20);
  // mounted
  const [mounted, setMounted] = useState(false);

  // généré les crédits par rapport au crédits max
  const maxCreditsA = 20;
  const maxCreditsB = 20;
  const maxCreditsC = 20;

  // reset queue
  function resetQueue() {
    setQueue([]);
  }

  // reset crédits -- dev mode
  function resetCredits() {
    setCreditsA(100);
    setCreditsB(100);
    setCreditsC(100);
  }

  // add action in queue
  function addInQueue(actionType) {
    setQueue((previousQueue) => [...previousQueue, actionType]);
  }

  // mets en forme visuellement la queue actuelle
  function QueueListComponent({ queue }) {
    return (
      <div className="queueListComponent">
        {queue.map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <span> -&gt; </span>}
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  QueueListComponent.propTypes = {
    queue: PropTypes.arrayOf(PropTypes.string),
    map: PropTypes.string,
  };

  // setTimer actions
  // setTimer 15 sec - éxécuter l'action suivante
  // setTimer 15min - recalculer le nombre de crédits

  // Exécution au premier rendu
  useEffect(() => {
    if (!mounted) {
      generateRandomCredits();
      setMounted(true); // Mettre à jour l'état pour indiquer que le composant est monté
    }

    // function actionA()
    // function actionB()
    // function actionC()

    // ==== Debut // Every 15sec ====
    function executeAction(type) {
      if (type === "A") {
        console.log("Execute: A");
        setCreditsA(creditsA - 1); // -1 crédit (A)
      }
      if (type === "B") {
        console.log("Execute: B");
        setCreditsB(creditsB - 1); // -1 crédit (B)
      }
      if (type === "C") {
        console.log("Execute: C");
        setCreditsC(creditsC - 1); // -1 crédit (C)
      }
    }

    function nextAction() {
      if (queue.length > 0) {
        // -- console.log
        console.clear();
        console.log(queue);
        // -- Execute l'action
        const type = queue[0];
        executeAction(type);
        // -- Remove premeir élément tableau
        setQueue((previousQueue) => previousQueue.slice(1));
      }
    }
    // ==== Fin // Every 15sec ====

    // ==== Debut // Every 15min ====
    function generateRandomPercentage(number) {
      // Calculer la plage de pourcentage
      const minPercentage = 0.8; // 80%
      const maxPercentage = 1; // 100%
      // Générer un pourcentage aléatoire dans la plage spécifiée
      const randomPercentage =
        Math.random() * (maxPercentage - minPercentage) + minPercentage;
      // Calculer le nombre aléatoire dans la plage spécifiée
      const randomNumber = Math.round(number * randomPercentage);
      return randomNumber;
    }

    function generateRandomCredits() {
      setCreditsA(generateRandomPercentage(maxCreditsA));
      setCreditsB(generateRandomPercentage(maxCreditsB));
      setCreditsC(generateRandomPercentage(maxCreditsC));
    }
    // ==== Fin // Every 15min ====

    // -- inverval
    const intervalIdNextAction = setInterval(nextAction, 3000); // every 3 sec : nextAction()
    const intervalIdRandomCredits = setInterval(generateRandomCredits, 100000); // every 100 sec : generateRandomCredits()
    // clear interval
    return () => {
      clearInterval(intervalIdNextAction);
      clearInterval(intervalIdRandomCredits);
    };
  }, [queue, creditsA, creditsB, creditsC, mounted]);

  return (
    <>
      <div className="navBar">
        <div className="appTitle">Waalaxy</div>
        <div className="creditsSection">
          <div className="creditSection">
            <div>A -</div>
            <div>{creditsA}</div>
            <img src={credit} className="creditSvg" />
          </div>
          <div className="creditSection">
            <div>B -</div>
            <div>{creditsB}</div>
            <img src={credit} className="creditSvg" />
          </div>
          <div className="creditSection">
            <div>C -</div>
            <div>{creditsC}</div>
            <img src={credit} className="creditSvg" />
          </div>
        </div>
        {/* only for dev mode */}
        <div className="resetCredit" onClick={() => resetCredits()}>
          <img src={reset} className="resetSvg" />
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
        </div>
      </div>
      {/* fin main container */}
    </>
  );
}

export default App;
