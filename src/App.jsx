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
      messages: chattyData.messages,
      oldName: 'null'
    };
  }

  sendName(text) {
    this.setState({oldName: this.state.currentUser});
    this.setState({currentUser: text});
    const newUser = {id: this.index, username: text, content: this.state.currentUser, type: 'postNotification'};
    this.socket.send(JSON.stringify(newUser));
  }

  sendMessage(text) {
    const newMessage = {id: this.index, username: this.state.currentUser, content: text, type: 'postMessage'};
    this.socket.send(JSON.stringify(newMessage));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');

    this.socket.onmessage = (event) => {
      const oldMessages = this.state.messages;
      // const oldName = this.state.currentUser;
      const messageObject = JSON.parse(event.data);
      console.log(messageObject.content);
      if (messageObject.type === 'incomingNotification') {
        this.setState({
          messages: oldMessages.concat({ content: messageObject.content + " changed their username to " + messageObject.username}),
          currentUser: messageObject.username
        });
      } else if (messageObject.type === 'incomingMessage') {
        this.setState({messages: oldMessages.concat(messageObject)});
      }
    };
  }



  render() {
    return (
      <div>
        <NavBar/>
        <MessageList messages={this.state.messages}/>
        <ChatBar  user={this.state.currentUser}
                  sendMessage={text => this.sendMessage(text)}
                  sendName={text => this.sendName(text)}/>
      </div>
    );
  };
}

export default App;
