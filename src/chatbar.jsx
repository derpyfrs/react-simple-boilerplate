import React, {Component} from 'react';

class ChatBar extends Component {

  onUserInput(e) {
    if(e.keyCode === 13 ) {
      this.props.sendMessage(e.target.value);
    }
  }

  render() {
    return (
        <div>
            <footer className="chatbar">
                  <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.user}/>
                   <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyUp={(e) => this.onUserInput(e)}/>
                </footer>
          </div>
      )
  }
}
export default ChatBar;