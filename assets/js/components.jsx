import React from 'react';

export default function Tile(props) {
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
    <div className={"card " + cardStyle} onClick={() => props.click(loc)} style={{"margin": "5px", "height": "75px", "width": "75px", "textAlign": "center", "verticalAlign": "center", "lineHeight": "75px"}} >
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
