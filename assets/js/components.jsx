import React from 'react';

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

export function ResetButton(props) {
  return (
    <button type="button" className="btn btn-primary col-6" onClick={props.reset} >
      Reset Game
    </button>
  );
}

export function Clicks(props) {
  return (
    <div id="clicks" className="col">{"Total clicks: " + props.clickNum}</div>
  );
}
