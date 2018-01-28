import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Tile, ResetButton, Clicks } from './components';

export default function run_memory(root) {
  ReactDOM.render(<MemoryGame />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    let tiles = this.setUpTiles();
    this.state = ({
      tiles: tiles,
      clicks: 0,
      prevTile: null,
      locked: false
    });
  }

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

  updateGame(loc) {
    if (this.state.locked) {
      return;
    }
    let clicks = this.state.clicks;
    if (!this.allTilesFound()) {
      clicks = clicks + 1;
    }
    let updatedTiles = this.updateTiles(loc);
    let prevTile = this.state.prevTile === null ? loc : null;
    this.setState({
      tiles: updatedTiles,
      clicks: clicks,
      prevTile: prevTile
    });

  }

  allTilesFound() {
    let allFound = true;
    _.each(this.state.tiles, (tile) => {
      if (!tile.found) {
        allFound = false;
      }
    });
    return allFound;
  }


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
        this.state.locked = true;
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
                  click={this.updateGame.bind(this)} />
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
