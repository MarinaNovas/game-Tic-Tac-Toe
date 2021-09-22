import React from 'react';
/* import './App.css'; */
import './css/app.css';

function calculateWinner(squares) {
  const combinations = [
    [0, 1, 2,'crossLine__horizontal crossLine__horizontal-top'],
    [3, 4, 5,'crossLine__horizontal crossLine__horizontal-center'],
    [6, 7, 8,'crossLine__horizontal crossLine__horizontal-bottom'],
    [0, 4, 8,'crossLine__oblique crossLine__oblique-top-bottom'],
    [2, 4, 6,'crossLine__oblique crossLine__oblique-bottom-top'],
    [0, 3, 6,'crossLine__vertical crossLine__vertical-left'],
    [1, 4, 7,'crossLine__vertical crossLine__vertical-center'],
    [2, 5, 8,'crossLine__vertical crossLine__vertical-right']
  ];

  for (let combination of combinations) {
    let [a, b, c, style] = combination;
    if (squares[a] === squares[b] && squares[b]===squares[c]){
      if(squares[a]!=='') return {winner:squares[a],styles:style};
    }
  }
  return {winner:null,styles:null};
}

class CrossLine extends React.Component{
  constructor(props){
    super(props);
    this.audio = new Audio('cross-out.mp3');
  }
  render(){
    if(this.props.styles!== null) this.audio.play();
    return(
      <div className={"crossLine "+this.props.styles}></div>
    );
  }
}

class Canvas extends React.Component{
  render(){
    
    return(
      <canvas className="canvas"></canvas>
    );
  }
}

class BtnImg extends React.Component {
  render() {
    return (
      <img src={this.props.imgSrc} alt="" />
    );
  }
}

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleButton = this.handleButton.bind(this);
  }
  handleButton(e) {
    this.props.onclick(this.props.value)
  }

  render() {
    let imgSrc = (this.props.state === '') ? '' : (this.props.state === 1) ? 'tic.png' : 'tac.png';
    return (
      <button className="square" onClick={this.handleButton}>
        <BtnImg state={this.props.state} imgSrc={imgSrc} />
      </button>
    );
  }
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderSquare = this.renderSquare.bind(this);
  }
  renderSquare(i) {
    let history, index;
    if (this.props.parentState.pointer === -1) {
      index = this.props.parentState.movementsHistiry.length - 1;
    } else {
      index = this.props.parentState.pointer;
    }
    history = this.props.parentState.movementsHistiry[index];
    let currentState = history[i];

    return <Square value={i} state={currentState} onclick={this.props.onclick} />
  }

  render() {
    return (
      <div className="game__board">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
        <CrossLine styles={this.props.styles}/> 
      </div>
    );
  }
}

class GameInfo extends React.Component {
  constructor(props) {
    super(props);
    this.renderListItem = this.renderListItem.bind(this);
    this.handlerButton = this.handlerButton.bind(this);
  }
  handlerButton(e) {
    if (!e.target.dataset.index) return;
    this.props.onclick(e.target.dataset.index);
  }
  renderListItem(index) {
    if (index === 0) {
      return (
        <li className="game__list-item" key={index}><button className="game__list-btn" data-index={index}>Go to game start!</button></li>
      );
    }
    return (
      <li  className="game__list-item" key={index}><button className="game__list-btn" data-index={index}>Go to move #{index}</button></li>
    );
  }
  render() {
    return (
      <div className="game__info">
        {this.props.winner===null && <h2 className="game__info-title">Next player: {this.props.player ? 'X' : '0'}</h2>}
        {this.props.winner===0 && <h2 className="game__info-title">Winner: 0</h2>}
        {this.props.winner===1 && <h2 className="game__info-title">Winner: X</h2>}

        <ul className="game__list" onClick={this.handlerButton}>
          {(Array(this.props.quantity).fill(0)).map((item, index) => this.renderListItem(index))}
        </ul>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.gameOverFlag = null;
    this.styles=null;
    this.state = {
      isNextX: true,
      movementsHistiry: [Array(9).fill('')],
      pointer: -1,
    };
    this.clickHendlerSquare = this.clickHendlerSquare.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }
  clickHendlerSquare(index) {
    if(this.gameOverFlag!==null && this.state.pointer === -1) return;
    let length = this.state.pointer === -1 ? this.state.movementsHistiry.length : (this.state.pointer + 1);
    let currentStateHistory = [].concat(this.state.movementsHistiry[length - 1]);
    let movementsHistiry = this.state.movementsHistiry.slice(0, length);
    if (currentStateHistory[index]!=='') return;
    currentStateHistory[index] = this.state.isNextX ? 1 : 0;
    movementsHistiry.push(currentStateHistory);
    let isNextX = !this.state.isNextX;
    let{winner, styles}=calculateWinner(currentStateHistory);
    this.gameOverFlag=winner;
    this.styles=styles;
    this.setState({ isNextX: isNextX, movementsHistiry: movementsHistiry, pointer: -1 });
  }

  jumpTo(index) {
    let currentPointer =  parseInt(index)===(this.state.movementsHistiry.length-1)?-1:parseInt(index);
    this.setState({ pointer: currentPointer, isNextX: index % 2 ? false : true });
  }

  render() {
    let appliedStyle;
    if(this.gameOverFlag!==null && this.state.pointer===-1){
      appliedStyle=this.styles;
    }else{
      appliedStyle=null;
    }
    return (
      <div className="game">
          <h1 className="game__title">Tic tac toe</h1>
          <Board onclick={this.clickHendlerSquare} parentState={this.state}  styles={appliedStyle}/>
          <GameInfo quantity={this.state.movementsHistiry.length} onclick={this.jumpTo} player={this.state.isNextX} winner={this.gameOverFlag}/>
      </div>
    );
  }
}

function App() {
  return <Game />;
}

export default App;
