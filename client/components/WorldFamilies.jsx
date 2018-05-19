/*
    ./client/components/WorldFamilies.jsx
*/
import React from 'react';
import io from 'socket.io-client';

/* imported component */
import UserInputForm from './UserInputForm.jsx';
import Images from './Images.jsx';
import AudioController from './AudioController.jsx';

/* imported functions */
// import { subscribeToTimer } from '../helper/subscribeToTimer.js';

class WorldFamilies extends React.Component {

  state = {
    isPlayerWaiting: false,
    hasGameStarted: false,
    currentGame: null,
    player: '',
    currentTimeDate: '',
    socket: null,
    isAnswerRight: null,
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // don't rerender if currentGame is changing
  //   return nextState.currentGame !== this.state.currentGame // Don't re-render if name is equal
  // }

  componentDidMount() {

  }

  setHasGameStarted = (boolean) => {
    this.setState({
      hasGameStarted: boolean,
    });
  }

  setIsPlayerWaiting = (boolean) => {
    this.setState({
      isPlayerWaiting: boolean,
    });
  }

  wait = () => {

    const socket = io('localhost:3000')

    this.setState({ socket });

    this.setIsPlayerWaiting(true)

    socket.on('onWait', (data) => {
      console.count('Send Current Game To Client');
      // set the state of this component to the currentGame
      // emitted from the express server
      this.setState({ currentGame: data.currentGame })
      console.log('# players in game: ', data.currentGame.player_count + '/2');
    }) // socket.on('Send Current Game To Client')

    socket.on('onStartGame', (data) => {
      this.setState({ currentGame: data.currentGame })
      this.setState({ player: data.player })
      console.log('# players in game: ', data.currentGame.player_count + '/2');
      console.log('game is starting!');
      this.startGame();
    }) // socket.on('start game')

    socket.on('onDisconnect', () => {
      this.setHasGameStarted(false);
      this.setIsPlayerWaiting(true);
    }) // socket.on('onDisconnect')

  }

  startGame = () => {
    this.setIsPlayerWaiting(false);
    this.setHasGameStarted(true);
  }

  onAnswer = (answer, random_highlight) => {

    if (answer === random_highlight) {
      this.setState({ isAnswerRight: true });

    } else if (answer === random_highlight) {
      this.setState({ isAnswerRight: true });

    } else {
      this.setState({ isAnswerRight: false });

    }

  }

  render() {
    const { isPlayerWaiting, hasGameStarted, player, socket, isAnswerRight } = this.state;
    // console.log('Has game started?', hasGameStarted);
    console.log('Rendering current game:', this.state.currentGame);
    console.log('I am', player.role);

    // const { role } = this.props;
    return (
      <div className="WorldFamilies">

        { hasGameStarted ? <div>
          <Images player_role={player.role} socket={socket} onAnswer={this.onAnswer}/>
          <AudioController player_role={player.role} socket={socket}/>
          {/* <p>{this.state.currentTimeDate}</p> */}
        </div> : <div>
          <UserInputForm wait={this.wait} />
        </div> }

        { isPlayerWaiting && <div>
          <p>Waiting for another player to start the game &nbsp;
            <img
              src="https://zippy.gfycat.com/SkinnySeveralAsianlion.gif"
              height="20"
              width="20"
            />
          </p>
        </div> }

        { isAnswerRight === true &&
          <p>Answer is correct!</p>
        }
        { isAnswerRight === false && <p>Wrong!</p> }

      </div>
    );
  }

}

export default WorldFamilies;
