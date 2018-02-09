import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Tile, ResetButton, Clicks } from './components';

export default function run_memory(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = ({
      tiles: [ ],
      clicks: 0,
      prevTile: null,
      locked: false
    });

    this.channel.join()
      .receive("ok", this.updateGame.bind(this))
      .receive("error", resp => { console.log("Unable to join", resp); });
  }

  updateGame(newState) {
    console.log("Update Game", newState.game.tiles)
    this.setState(newState.game);

  }

  move(loc) {
    this.channel.push("move", { move: loc })
        .receive("ok", this.updateGame.bind(this));
  }


  //Resets game to initial conditions.
  resetGame() {
    this.channel.push("restart", {})
        .receive("ok", this.updateGame.bind(this));
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {
            _.map(this.state.tiles, (tile, ii) => {
              return (
                <Tile
                  key={ii}
                  loc={ii}
                  value={tile.value}
                  found={tile.found}
                  selected={tile.selected}
                  click={this.move.bind(this)} />
              )
            })
          }
        </div>
        <div className="row">
          <Clicks clickNum={this.state.clicks} />
          <ResetButton resetGame={this.resetGame.bind(this)} />
        </div>
      </div>
    );
  }
}
