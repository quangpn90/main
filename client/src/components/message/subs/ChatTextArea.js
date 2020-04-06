import React, { useState } from 'react';

const ChatTextArea = props => {
  return (
    <React.Fragment>
      <div className='chat-typing-container'>
        <div className='row'>
          <div className='col-9'>
            <textarea
              className='form-control chat-editor'
              placeholder='enter message...'
              rows='2'
              disabled={props.selected_convo === ''}
            />
          </div>
          <div className='col-3'>
            <button
              className='btn chat-send-btn'
              disabled={props.selected_convo === ''}
            >
              Send
            </button>
            <span className='press-enter'>or press enter</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatTextArea;