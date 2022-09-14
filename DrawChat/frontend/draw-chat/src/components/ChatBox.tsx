import React from 'react';

type ChatBoxProps = {
    chatMessages: string[]
};

const defaultState = {
    chatMessages: []
};

class ChatBox extends React.Component<ChatBoxProps, {}> {

    constructor(props: any) {
        super(props);
    };

    handleMessage = (message: string) => {
        this.props.chatMessages.push(message);
    };

    render() {
        let content = [];
        for(let i = 0; i < this.props.chatMessages.length; i++) {
            content.push(<div><p>{ this.props.chatMessages[i] }</p><hr /></div>);
        }

        return (
            <div className="chat-box-content">
                { content }
            </div>
        );
    }
}

export default ChatBox;