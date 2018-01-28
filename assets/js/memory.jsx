import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
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
      prevTile: null,
      locked: false
    });
  }

  updateGame(loc) {
    if (this.state.locked) {
      return;
    }


    let clicks = this.state.clicks;
    if (!allTilesFound) {
      clicks = clicks + 1;
    }
    let updatedTiles = this.updateTiles(loc);
    let prevTile = this.state.prevTile === null ? loc : null;
    this.setState({
      tiles: updatedTiles,
      clicks: clicks,
      prevTile: prevTile,
    });

    //this.setState(this.state);
    //console.log(this.state);
  }

  allTilesFound() {
    _.each(this.state.tiles, (tile) => {
      if (!tile.found) {
        return false;
      }
    });
    return true;
  }

  updateTiles(loc) {
    let updatedTiles = this.state.tiles;
    updatedTiles[loc].selected = true;
    let prevTile = this.state.prevTile;
    if (prevTile !== null) {
      if (updatedTiles[loc].value === updatedTiles[prevTile].value && updatedTiles[loc].key !== updatedTiles[prevTile].key) {
        updatedTiles[loc].found = true;
        updatedTiles[prevTile].found = true;
      } else {
        this.state.locked = true;
      _.delay(() => {
        console.log("delay");
        updatedTiles[loc].selected = false;
        updatedTiles[prevTile].selected = false;
        this.setState({
          tiles : updatedTiles,
          locked: false
        })
      }, 1000);
      console.log("end delay");
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

function Tile(props) {
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
