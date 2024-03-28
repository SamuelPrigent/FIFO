// react
import React, { useState } from "react";
import PropTypes from "prop-types";
// style
import "./reset.css";
import "./App.css";
// assets
import credit from "./assets/credit.svg";
import reset from "./assets/reset.svg";
import reset2 from "./assets/reset2.svg";

function App() {
  const [queue, setQueue] = useState([]);
  // crédits
  const [creditsA, setCreditsA] = useState(100);
  const [creditsB, setCreditsB] = useState(100);
  const [creditsC, setCreditsC] = useState(100);

  // add specific action in queue
  function addInQueue(actionType) {
    console.log(actionType);
    setQueue((previousQueue) => [...previousQueue, actionType]);
  }

  function resetCredits() {
    setCreditsA(100);
    setCreditsB(100);
    setCreditsC(100);
  }

  function resetQueue() {
    setQueue([]);
  }

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

  // généré les crédits par rapport au crédits max
  // const maxCreditsA = 100
  // const maxCreditsB = 100
  // const maxCreditsC = 100

  // setTimer actions
  // setTimer 15 sec - éxécuter l'action suivante
  // setTimer 15min - recalculer le nombre de crédits ?

  return (
    <>
      <div className="navBar">
        <div className="appTitle">Waalaxy</div>
        <div className="creditSection">
          <div>Type A /</div>
          <div>{creditsA}</div>
          <img src={credit} className="creditSvg" />
        </div>
        <div className="creditSection">
          <div>Type B /</div>
          <div>{creditsB}</div>
          <img src={credit} className="creditSvg" />
        </div>
        <div className="creditSection">
          <div>Type C /</div>
          <div>{creditsC}</div>
          <img src={credit} className="creditSvg" />
        </div>
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

          <div className="sectionContainer">
            <div className="queueTitleSection">
              <div className="titleElement">{"Actions suivante"}</div>
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
    </>
  );
}

export default App;
