import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Tile, ResetButton, Clicks } from './components';

export default function run_memory(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

/*
* This class contains and handles the Memory Game state. This version keeps
* track of the handled clicks for the game.
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
*                is clicked.
*
* Color Scheme:
*   Green - found
*   Red - selected
*   Black - hidden
*/
class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    //let tiles = this.setUpTiles();
    this.channel = props.channel;
    this.state = ({
      tiles: [ ],
      clicks: 0,
      prevTile: null,
      locked: false
    });
  }

  //Method sets up tiles for a new game of memory constrained to values
  //and sets initial values of found and selected to false.
  //
  //returns a list of tile objects defining a new game
  setUpTiles() {
    let letters = [
    'A', 'A',
    'B', 'B',
    'C', 'C',
    'D', 'D',
    'E', 'E',
    'F', 'F',
    'G', 'G',
    'H', 'H'];

    letters = _.shuffle(letters);
    let tiles = _.map(letters, (value, ii) => {
      return {
        key: ii,
        value: value,
        found: false,
        selected: false
      }
    });

    return tiles;
  }

  //On click handler that updates the game according to the current state and
  //currently selected card. If all tiles are found the game will not update
  //until restart button is hit. If the game is locked, the game will not update.
  updateGame(newState) {
    /*this.channel.push("move", {})
        .receive("ok", console.log("received"));*
    if (this.state.locked) {
      return;
    }

    if (this.allTilesFound()) {
      return;
    }

    let clicks = this.state.clicks + 1;
    let updatedTiles = this.updateTiles(loc);
    let prevTile = this.state.prevTile === null ? loc : null;

    this.setState({
      tiles: updatedTiles,
      clicks: clicks,
      prevTile: prevTile
    });*/
    this.setState({
      newState
    });

  }

  move(loc) {
    this.channel.push("move", { move: loc })
        .receive("ok", this.updateGame.bind(this));
  }

  //Returns true if all cards are found, false otherwise.
  allTilesFound() {
    let allFound = true;
    _.each(this.state.tiles, (tile) => {
      if (!tile.found) {
        allFound = false;
      }
    });
    return allFound;
  }

  //Updates tiles according to currently selected card and the current state of
  //the game. Implements delay of game when match is not found.
  //
  //returns an updated version of the tiles' state depending on selection
  updateTiles(loc) {
    let updatedTiles = this.state.tiles;
    updatedTiles[loc].selected = true;
    let prevTile = this.state.prevTile;
    if (prevTile !== null) {
      if (updatedTiles[loc].value === updatedTiles[prevTile].value
        && updatedTiles[loc].key !== updatedTiles[prevTile].key) {
        updatedTiles[loc].found = true;
        updatedTiles[prevTile].found = true;
      } else {
        this.setState({
          locked: true
        });
        _.delay(() => {
          updatedTiles[loc].selected = false;
          updatedTiles[prevTile].selected = false;
          this.setState({
            tiles : updatedTiles,
            locked: false
          });
        }, 1000);
      }
    }
    return updatedTiles;
  }

  //Resets game to initial conditions.
  resetGame() {
    let tiles = this.setUpTiles();
    this.setState({
      tiles: tiles,
      prevTile: null,
      clicks: 0,
      locked: false
    });
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
