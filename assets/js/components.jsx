import React from 'react';

//Functional component that renders a tile using the props and handles the click
//events.
export function Tile(props) {
  let loc = props.loc;
  let cardStyle;
  let value = props.value;
  if (props.selected && !props.found) {
    cardStyle = "bg-danger";
  } else if (props.found) {
    cardStyle = "bg-success";
  } else {
    cardStyle = "bg-dark";
    value= " ";
  }

  return (
    <div className="col-3" >
      <div className={"tile card " + cardStyle} onClick={() => props.click(loc)}>
        {value}
      </div>
    </div>
  );
}

//Functional component renders a button that handles clicks with the purpose of
//restarting the game.
export function ResetButton(props) {
  return (
    <button type="button" className="btn btn-primary col-6" onClick={props.resetGame}>
      Reset Game
    </button>
  );
}

//Functional component that renders the number of clicks done in the current
//game session. 
export function Clicks(props) {
  return (
    <div id="clicks" className="col">
      {"Total clicks: " + props.clickNum}
    </div>
  );
}
