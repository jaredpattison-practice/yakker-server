import React from 'react';
import ClientConnection from './lib/subscriber.js';
import Publisher from './lib/publisher.js';

const Q = new Publisher();
const TrollClient = new ClientConnection('troll');


class Troll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedInput: '',
      words: [],
    };
  
    TrollClient.subscribe('message', payload => {
      this.updateWords(payload);
    })
  }

  updateWords = word => {
    if(this.state.words.length >= 15) {
      this.state.words.shift();
    }
    this.setState({words: [ ...this.state.words, word]});
  };

  handleSubmit = event => {
    event.preventDefault();
    Q.publish('troll', 'message', this.state.typedInput)
  };

  handleNewWords = event => {
    event.preventDefault();
    this.setState({ typedInput: event.target.value });
  };

  render() {
    const listItem = this.state.words.map((word, idx) =>
    <li key={idx}>{word}</li>
    );

    return (
      <>
        <ul>{listItem}</ul>
        <h2>{this.state.words[this.state.words.length - 1]}</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            name="typedInput"
            placeholder="New Words"
            onChange={this.handleNewWords}
          />
        </form>
      </>
    );
  }
}



export default Troll;
