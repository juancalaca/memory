import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<App />, root);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    let letters = ['D', 'A', 'G', 'D', 'A', 'F', 'E', 'C', 'C', 'G', 'H', 'E', 'B', 'F', 'B', 'H'];
    letters = _.shuffle(letters);
    let tiles = _.map(letters, (value, ii) => {
      return {
        key: ii,
        value: value,
        found: false,
        selected: false
      }
    });

    this.state = ({
      tiles: tiles,
      clicks: 0,
      prevTile: null
    });
  }

  componentWillUpdate() {
    console.log('App is going to re-render');
  }

  componentDidUpdate() {
    let updatedTiles = this.updateTiles(loc);
    if(this.state.prevTile !== null) {
      console.log("inner if");
      this.sleep(1000);
      updatedTiles[ex].selected = false;
      updatedTiles[loc].selected = false;
    }
  }

  updateGame(loc) {
    console.log("clicked");
    let clicks = this.state.clicks + 1;
    let updatedTiles = this.updateTiles(loc);
    let prevTile = this.state.prevTile === null ? loc : null;
    let ex = this.state.prevTile;
    this.setStateHelper(updatedTiles, clicks, prevTile);

    //this.setState(this.state);
    //console.log(this.state);
  }

  setStateHelper(updatedTiles, clicks, prevTile) {
    this.setState({
      tiles: updatedTiles,
      clicks: clicks,
      prevTile: prevTile
    });
  }

  updateTiles(loc) {
    let updatedTiles = this.state.tiles;
    console.log(updatedTiles[loc]);
    console.log(updatedTiles[loc].selected);
    updatedTiles[loc].selected = true;
    console.log(updatedTiles[loc]);
    console.log(updatedTiles[loc].selected);
    let prevTile = this.state.prevTile;
    if (prevTile !== null) {
      if (updatedTiles[loc].value === updatedTiles[prevTile].value && updatedTiles[loc].key !== updatedTiles[prevTile].key) {
        updatedTiles[loc].found = true;
        updatedTiles[prevTile].found = true;
      } else {
        updatedTiles[loc].selected = false;
        updatedTiles[prevTile].found = false;
      }
    }

    return updatedTiles;
  }

  resetGame() {
    let letters = ['D', 'A', 'G', 'D', 'A', 'F', 'E', 'C', 'C', 'G', 'H', 'E', 'B', 'F', 'B', 'H'];
    letters = _.shuffle(letters);
    let tiles = _.map(letters, (value, ii) => {
      return {
        key: ii,
        value: value,
        found: false,
        selected: false
      }
    });
    this.setState({
      tiles: tiles,
      prevTile: null,
      clicks: 0
    });
  }

  /*incrementClicks() {
    this.setState({
      clicks: this.state.clicks + 1
    });
  }*/

  render() {
    return (
      <div className="container">
        <div className="row">
          {_.map(this.state.tiles, (tile, ii) => {
            return (<Tile
              key={ii}
              loc={ii}
              value={tile.value}
              found={tile.found}
              selected={tile.selected}
              click={this.updateGame.bind(this)}
              /> )
            })}
        </div>
        <div className="row">
          <Clicks clickNum={this.state.clicks}/>
          <ResetButton reset={this.resetGame.bind(this)}/>
        </div>
      </div>
    );
  }
}

class Tile extends React.Component {

  componentWillUpdate(nextState, nextProps) {
    if (!nextProps.selected) {
      this.sleep(1000);
    }
  }

  sleep(ms) {
    let now = Date.now();
    while(Date.now() - now < ms) {

    }
  }

  render() {  let loc = props.loc;
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
}

function ResetButton(props) {
  return (
    <button type="button" className="btn btn-primary col-6" onClick={props.reset} >
      Reset Game
    </button>
  );
}

function Clicks(props) {
  return (
    <div id="clicks" className="col">{"Total clicks: " + props.clickNum}</div>
  );
}
