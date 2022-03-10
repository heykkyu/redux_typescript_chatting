import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ChatViewData} from "../../utils/dummyData";
import { getTimeToFull, getTimeToShort, getTimeBetweenMin }  from "../../moduels/date";
import { useContextState, useContextDispatch } from '../../moduels/context';

const BubbleWrap = styled.div`
  padding: 10px 20px;
  height: calc(100% - 120px);
  min-height: calc(100% - 120px);
  overflow: auto;
  margin-bottom: 40px;
`
const BubbleText = styled.div<{sender_type: string}>`
  padding: 7px 0;
  display: flex;
  flex-direction: ${(props) => props.sender_type === 'admin' && "row-reverse"}; 
  align-items: flex-end;
  p {
    &:nth-child(1) {
      max-width: 70%;
      padding: 12px 15px;
      border-radius: 12px;
      font-size: 14px;
      box-shadow: 0 2px 4px 0 lightgray;
      font-weight: bold;
      margin: 0;
      line-height: 20px;
      background-color: ${(props) => props.sender_type === 'admin' ? "#5b36ac" : "#fff"}; 
      color: ${(props) => props.sender_type === 'admin' ? "#fff" : "#363a42"};

    }
    &:nth-child(2) {
      margin: 0 8px 5px 8px;
      font-size: 12px;
      line-height: 14px;
      color: #363a42;
      opacity: .4;
      font-weight: 500;

    }
  }
 
`

const BubbleDate = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  color: #363a42;
  opacity: .4;
  font-weight: 500;
  position: relative;
  margin: 15px 0;
  &:before, &:after {
    content: "";
    width: calc(50% - 60px);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 1px;
    background: #e6e6eb;
    z-index: 1;
  }
  &:after {
    left: unset;
    right: 0;
  }
  span {
    z-index: 2;
  }
`

interface ChatViewDataType {
  chat_id: number,
  sender_type: string,
  user_name: string,
  send_message_type: string,
  send_message: string,
  send_time: string,
}

const ChatView = () => {
  const state = useContextState();
  const dispatch = useContextDispatch();
  const loadView = () => dispatch({ type: 'LOAD_CHAT_VIEW' });
  const showBubbleTextTime = (index:number, currentChat:ChatViewDataType, nextChat: ChatViewDataType) => {
    if ((index < state.chatView.length-1)
        && (currentChat.sender_type === nextChat.sender_type) 
        && getTimeBetweenMin(currentChat.send_time, nextChat.send_time)) {
      return false;
    } else {
      return getTimeToShort(currentChat.send_time);
    }
  }

  useEffect(() => {
    loadView();
  }, [])

  return (
    <BubbleWrap>
      {state.chatView?.map((chat, index) => {
        return (
          <div
            key={chat.chat_id}
          >
            <BubbleText
              sender_type={chat.sender_type}
            >
              <p>{chat.send_message}</p>
              <p>{showBubbleTextTime(index, chat, state.chatView[index+1])}</p>
            </BubbleText>
            {(index !== 0 && getTimeToFull(chat.send_time) !== getTimeToFull(state.chatView[index-1].send_time)) && (
              <BubbleDate>
                <span>{getTimeToFull(chat.send_time)}</span>
              </BubbleDate>
            )}
          </div>
        )
      })}
    </BubbleWrap>
  );
}

export default ChatView;
 