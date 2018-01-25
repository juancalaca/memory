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
    let tiles = _.map(letters, (value) => {
      return {
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

  updateGame(loc) {
    this.incrementClicks();
    this.state.tiles[loc].selected = true;

    if (this.state.prevTile == null) {
      this.setState({
        prevTile: loc;
      })
      return;
    } else {
      if (this.state.prevTile.value === this.state.tiles[loc].value) {
        this.state.prevTile.found = true;
        this.state.tiles[loc].found = true;
      }
      this.state.prevTile.selected = false;
      this.state.tiles[loc].selected = false;
      this.state.prevTile = null;
    }

    //this.setState(this.state);
    //console.log(this.state);
  }

  resetGame() {
    let letters = ['D', 'A', 'G', 'D', 'A', 'F', 'E', 'C', 'C', 'G', 'H', 'E', 'B', 'F', 'B', 'H'];
    letters = _.shuffle(letters);
    let tiles = _.map(letters, (value) => {
      return {
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
        <Clicks clickNum={this.state.clicks}/>
        <ResetButton reset={this.resetGame.bind(this)}/>
      </div>
    );
  }
}

function Tile(props) {
  let loc = props.loc;
  let cardStyle;
  let value = props.value;
  if (props.selected) {
    cardStyle = "bg-danger";
  } else if (props.found) {
    cardStyle = "bg-success";
  } else {
    cardStyle = "bg-dark";
  }

  return (
    <div className={"col-3 card " + cardStyle} key={loc} onClick={() => props.click(loc)} style={{width: "100"}} >
      <div>
        {value}
      </div>
    </div>
  );
}

function ResetButton(props) {
  return (
    <button type="button" className="btn btn-primary" onClick={props.reset} >
      Reset Game
    </button>
  );
}

function Clicks(props) {
  return (
    <div id="clicks">{props.clickNum}</div>
  );
}
