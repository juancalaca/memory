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
    let tiles = _.map(letters, (value) => {
      return {
        value: value,
        found: false,
        selected: false
      }
    });

    this.state = ({
      tiles: tiles,
      turn: 0,
      clicks: 0,
      prevTile: null
    });
  }

  updateGame(loc) {
    this.incrementClicks();
    this.state.tiles[loc].selected = true;
    if (this.state.prevTile == null) {
      this.state.prevTile = this.state.tiles[loc];
    } else {
      if (this.state.prevTile.value === this.state.tiles[loc].value) {
        this.state.prevTile.found = true;
        this.state.tiles[loc].found = true;
      }
      this.state.prevTile.selected = false;
      this.state.tiles[loc].selected = false;
      this.state.prevTile = null;
    }
    this.setState(this.state);
    console.log(this.state);
  }

  resetGame() {

  }

  incrementClicks() {
    this.setState({
      clicks: this.state.clicks + 1
    });
  }

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

/*function CreateTiles(props) {
  let tiles = _.map(props.text, (xx, ii) => {
     return <div key={ii} style={tileStyle}>{xx + " " + ii}</div>;
     });
    return (
      <div style={containerStyle}>
        {tiles}
      </div>
    );
}*/

function Tile(props) {
  let loc = props.loc;
  let cardStyle;
  if (props.selected) {
    cardStyle = "bg-danger";
  } else if (props.found) {
    cardStyle = "bg-success";
  } else {
    cardStyle = "bg-dark";
  }

  return (
    <div className={"col-3 card " + cardStyle} key={loc} onClick={() => props.click(loc)} >
      <div>
        {props.value}
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
