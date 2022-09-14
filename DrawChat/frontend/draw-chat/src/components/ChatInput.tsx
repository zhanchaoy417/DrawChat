import React from 'react';

type ChatInputProps = {
    sendChatMessageCallback: any // Callback to send a message
};

type ChatInputState = {
    message: string // Message currently in the chat box
};

const defaultState = {
    message: "Chat"
};

class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
    constructor(props: any) {
        super(props);

        this.state = { message: "" };

        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChange(event: any) {
        this.setState({ message: event.target.value });
    }

    sendMessage(event: any) {
        event.preventDefault();
        const message = this.state.message;
        this.props.sendChatMessageCallback(message);
        this.setState({ message: "" });
    }

    render() {
        return(
            <div id="chat-input">
              <form onSubmit={ this.sendMessage }>
                <label>
                  Chat:
                  <input type="text" value={ this.state.message } onChange={ this.handleChange } />
                </label>
                <input type="submit" value="Send" />
              </form>
            </div>
        );
    }
}

export default ChatInput;