import React, { Component } from 'react';

class Chat extends Component {
    state = {
        value: ''
    }

    render() { 
        return (
            <React.Fragment>
                <div className="chat-wrapper">
                    <div className="chat-header">Contact Support Chat #{ this.props.chatId }</div>
                    <div className="chat-body">
                        { this.props.messages.map((v, i) => {
                            return <React.Fragment key={i}>
                                        <b>{v.split('@')[0]}</b>{v.split('@')[1]}
                                        <br/>
                                    </React.Fragment>;
                        })}
                    </div>
                    <div className="chat-footer">
                        <input value={ this.state.value } onInput={(e) => this.setState({value: e.target.value})} type="text"/>
                        <button onClick={ () => {this.props.sendMessageHandler(this.state.value); this.setState({value: ''})} }>Send</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default Chat;