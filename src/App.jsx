import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'Anon',
      messages: [],
      usercount: 0
    };
  }

  sendName(text) {
    this.setState({currentUser: text});
    const newUser = {
      id: this.index,
      username: text,
      oldusername: this.state.currentUser,
      type: 'postNotification'
    };
    this.socket.send(JSON.stringify(newUser));
  }

  sendMessage(text) {
    const newMessage = {
      id: this.index,
      username: this.state.currentUser,
      content: text,
      type: 'postMessage'
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onmessage = (event) => {
      const oldMessages = this.state.messages;
      const messageObject = JSON.parse(event.data);
      if (messageObject.type === 'incomingNotification') {
        this.setState({
          messages: oldMessages.concat({
            type: messageObject.type,
            id: messageObject.id,
            content: messageObject.oldusername + " changed their username to " + messageObject.username
          })
        });
      } else if (messageObject.type === 'incomingMessage') {
        this.setState({messages: oldMessages.concat(messageObject)});
      } else if (messageObject.type === 'count') {
        this.setState({usercount: messageObject.userCount})
      }
    };
  }



  render() {
    return (
      <div>
        <NavBar usercount={this.state.usercount}/>
        <MessageList messages={this.state.messages}/>
        <ChatBar  user={this.state.currentUser}
                  sendMessage={text => this.sendMessage(text)}
                  sendName={text => this.sendName(text)}/>
      </div>
    );
  };
}

export default App;
