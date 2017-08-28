import React, {Component} from 'react';

class ChatBar extends Component {

  onUserInput(e) {
    if(e.keyCode === 13 ) {
      this.props.sendMessage(e.target.value);
    }
  }

  onUserInputName(n) {
    if(n.keyCode === 13 ) {
      this.props.sendName(n.target.value);
    }
  }
  render() {
    return (
      <div>
        <footer className="chatbar">
          <input className="chatbar-username" placeholder="Your Name (Optional)" onKeyDown={(n) => this.onUserInputName(n)}/>
          <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={(e) => this.onUserInput(e)}/>
        </footer>
      </div>
    )
  }
}
export default ChatBar;