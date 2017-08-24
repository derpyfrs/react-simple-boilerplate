import React, {Component} from 'react';
import ChatBar from './chatbar.jsx';
import NavBar from './NavBar.jsx';
import MessageList from './MessageList.jsx';

const chattyData = {
  currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [
    { id: "1",
      username: "Bob",
      content: "Has anyone seen my marbles?",
    },
    { id: "2",
      username: "Anonymous",
      content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
    }
  ]
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: chattyData.currentUser.name,
      messages: chattyData.messages
    };
    this.index = 4;
  }


  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.addEventListener('open', () => {
        // this.socket.send('it works');
    });
    this.socket.addEventListener('newMessage', (event) => {
      console.log('Got a message');
      console.log(event.data);
      const newMessages = this.state.messages;
      const messageObject = JSON.parse(event.data);
      newMessages.push(messageObject);
      this.setState({messages: newMessages});
    });
    console.log("componentDidMount <App />");

  }
  sendMessage(text) {
    const newMessage = {id: this.index, username: this.state.currentUser, content: text};
    const newMessages = this.state.messages.concat([newMessage]);
   this.socket.send(JSON.stringify(newMessages));
   console.log('sent')
  }
  render() {
    return (
      <div>
        <NavBar/>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} sendMessage={text => this.sendMessage(text)}/>
      </div>
    );
  };
}

export default App;
