import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Tile, ResetButton, Clicks } from './components';

export default function run_memory(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

/*
* This class renders the Memory Game state handled and provided by the channel.
* The game communicates via messages to update the state stored in the server.
* This version keeps track of the handled clicks for the game.
* State is composed of:
*  = tiles: list of tile objects
*    -> tile object has attributes:
*       - key: unique key
*       - value: value of card
*       - found: boolean if found or not
*       - selected: boolean if selected or not
*  = clicks: number of clicks in current game
*  = prevTile: keep track of each play if null first card selected otherwise
*              pair made
*  = locked: boolean false for game to re-render, otherwise don't re-render,
*            used for timeout of 1000ms to not count clicks during interval and
*            not change state during that interval
*
* This MemoryGame class uses functional components, found in file ./components,
* to render the current state, and update the current state.
*
* Design choices: if all tiles found, game won't re-render until restart Button
*                is clicked. If click on same card twice, will count clicks. If
*                a card that is found is selected, the card counts as a click &
*                a valid selection.
*
* Color Scheme:
*   Green - found
*   Red - selected
*   Black - hidden
*/
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

    //Joins channel and starts new game
    this.channel.join()
      .receive("ok", this.updateGame.bind(this))
      .receive("error", resp => { console.log("Unable to join", resp); });
  }


  //Callback function to update state when a new state is received through the
  //socket. If the game state is locked, it will send a message to unlock the
  //game after a period of 1000ms.
  updateGame(newState) {
    this.setState(newState.game);
    if (this.state.locked) {
      this.unlockGame.bind(this);
    }
  }

  //Unlocks game 1000ms after called.
  unlockGame() {
    _.delay(() => {
      this.channel.push("unlock", {})
          .receive("ok", this.updateGame.bind(this))
          .receive("error", resp => { console.log("Unable to unlock", resp); });
    }, 1000);
  }

  //Click handler function that sends a message to the server containing the
  //location of the most recently clicked tile. If the state is locked, does not
  //send message to avoid race conditions.
  move(loc) {
    if (this.state.locked) {
      return;
    }

    this.channel.push("move", { move: loc })
        .receive("ok", this.updateGame.bind(this))
        .receive("error", resp => { console.log("Unable to send move", resp); });
  }

  //Sends restart message to reset game to initial conditions.
  resetGame() {
    this.channel.push("restart", {})
        .receive("ok", this.updateGame.bind(this))
        .receive("error", resp => { console.log("Unable to reset game.", resp); });
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
