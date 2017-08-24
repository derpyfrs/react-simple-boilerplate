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
  }


  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.addEventListener('messageObject', (data) => {
      // console.log(data)
    })

    // this.socket.onmessage = (event) => {
    //   let userMessage = JSON.parse(event.data);
    //   this.setState.push(userMessage);
    //   // code to handle incoming message
    // }
    this.socket.addEventListener('open', () => {
        // this.socket.send('it works');
    });
    this.socket.onmessage = (event) => {
      const newMessages = this.state.messages;
      const oldUser = this.state.currentUser;
      const messageObject = JSON.parse(event.data);

      if (messageObject.type == 'username') {
        this.setState({ currentUser: messageObject.username });
      } else if (messageObject.type == 'message') {
        this.setState({messages: newMessages});
        newMessages.push(messageObject);
      }
    };
    // this.socket.onUserChange = (event) => {
    //   const newMessages = this.state.messages;
    //   const newUsers = this.state.currentUser;
    //   const messageObject = JSON.parse(event.data);
    //   newMessages.push(messageObject);

    //   this.setState({messages: newMessages, currentUser: newUsers});
    // };
  }

  sendName(text) {
    const newUser = {id: this.index, username: text, type: 'username'};
    this.socket.send(JSON.stringify(newUser));
  }

  sendMessage(text) {
    const newMessage = {id: this.index, username: this.state.currentUser, content: text, type: 'message'};
    this.socket.send(JSON.stringify(newMessage));
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
