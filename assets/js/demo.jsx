import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<App />, root);
}

/*class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { side: props.side };
  }

  toggle(side) {
    var side = +!this.state.side;
    this.setState({side: side});
  }

  render() {
    var toggle = this.toggle.bind(this);
    return (
      <div className="row">
        <Side show={this.state.side == 0} toggle={toggle} />
        <div className="col">
          &nbsp;
        </div>
        <Side show={this.state.side == 1} toggle={toggle} />
      </div>
    );
  }
}

function Side(params) {
  if (params.show) {
    return (
      <div id="side-0" className="side col" onMouseOver={ () => params.toggle() }>
        <Button onClick={ () => alert("cheater") }>Click Me LOL</Button>
      </div>
    );
  }
  else {
    return (
      <div id="side-0" className="side col">
        &nbsp;
      </div>
    );
  }
}*/

// App state for Hangman is:
// {
//    word: String    // the word to be guessed
//    guesses: String // letters guessed so far
// }
//
// A TodoItem is:
//   { name: String, done: Bool }


/*class HangmanGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "elephant",
      guesses: "",
    };
  }

  wordLetters() {
    return this.state.word.split("");
  }

  guessLetters() {
    return _.uniq(this.state.guesses.split(""));
  }

  badGuessLetters() {
    let goods = this.wordLetters();
    let bads = [];
    this.guessLetters().forEach( (gg) => {
      if (!goods.includes(gg)) {
        bads.push(gg);
      }
    });
    return bads;
  }

  setGuesses(ev) {
    let input = $(ev.target);
    let st1 = _.extend(this.state, {
      guesses: input.val(),
    });
    this.setState(st1);
  }

  render() {
    return (
      <div className="row">
        <div className="col-6">
          <Word root={this} />
        </div>
        <div className="col-6">
          <Lives root={this} />
        </div>
        <div className="col-6">
          <Guesses root={this} />
        </div>
        <div className="col-6">
          <GuessInput guess={this.setGuesses.bind(this)} />
        </div>
      </div>
    );
  }
}

function Word(params) {
  let root = params.root;

  let guesses = root.guessLetters();
  let letters = _.map(root.wordLetters(), (xx, ii) => {
    let text = guesses.includes(xx) ? xx : "_";
    return <span style={{padding: "1ex"}} key={ii}>{text}</span>;
  });

  return (
    <div>
      <p><b>The Word</b></p>
      <p>{letters}</p>
    </div>
  );
}

function Lives(params) {
  return <div>
    <p><b>Guesses Left:</b></p>
    <p>{10 - params.root.badGuessLetters().length}</p>
  </div>;
}

function Guesses(params) {
  return <div>
    <p><b>Letters Guessed</b></p>
    <p>{params.root.guessLetters().join(" ")}</p>
  </div>;
}

function GuessInput(params) {
  return <div>
    <p><b>Type Your Guesses</b></p>
    <p><input type="text" onChange={params.guess} /></p>
  </div>;
}*/

class App extends React.Component {
  constructor(props) {
    super(props);
    let letters = ['D', 'A', 'G', 'D', 'A', 'F', 'E', 'C', 'C', 'G', 'H', 'E', 'B', 'F', 'B', 'H'];
    let tiles = _.map(letters, (value) => {
      return {
        value: {value},
        found: false,
        selected: false
      }
    });

    this.state = ({
      tiles: tiles,
      turn: 0,
      clicks: 0,
    });
  }

  updateGame(loc, turn) {

  }

  resetGame() {

  }

  incrementClicks() {
    this.setState({
      clicks: this.state.clicks++
    });
  }

  render() {
    return (
      <div>
        {this.state.tiles.map((tile) => {
          return (<Tile
            value={tile.value}
            found={tile.found}
            selected={tile.selected}
            onClick={this.updateGame.bind(this)}
            /> )
          })}
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
  return (
    <div className={"tile " + this.props.found + " " + this.props.selected} >
      {this.props.value}
    </div>
  );
}

function ResetButton(props) {
  return (
    <button id="reset" onClick={this.props.reset} >
      Reset Game
    </button>
  );
}

function Clicks(props) {
  return (
    <div id="clicks">{this.props.clickNum}</div>
  );
}
