
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { jwtDecode } from "jwt-decode";
import styles from '../styles/home.module.css';
import Link from 'next/link';
import DataService from "../services/data.service";

// RCE CSS
import 'react-chat-elements/dist/main.css'
import { MessageList } from 'react-chat-elements';
import { Input } from 'react-chat-elements';
import { Button } from 'react-chat-elements'

export default function Home() {

  const [localState, setLocalState] =  useState([]);
  const [inputValue, setInputValue] =  useState({});
  const [currentStream, setCurrentStream] =  useState("");
  const [prompts, setPrompts] = useState([]);
  useEffect(() => {
    const geChatFromLocalStorage = () => {
      const chatData = localStorage.getItem('moneybot');
      if (chatData) {
        setLocalState(chatData);
      }
    };
    setPrompts([
      {"prompt":"What is revenue?"},
      {"prompt":"What is cashflow?"},
      {"prompt":"What is a dividend?"},
      {"prompt":"What is compounding interest?"}
    ]);

    geChatFromLocalStorage();
  }, []);
  useEffect(() => {
    localStorage.setItem('moneybot', currentStream);
  }, [currentStream]);

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
 
  const handlePrompt = (e) => {
    let ls = localState;
    ls.push({
      position: 'right',
      type: 'text',
      text: inputValue,
      date: new Date(),
    });
    ls.push({
      position: 'left',
      type: 'text',
      text: "...",
      date: new Date(),
    });
    setLocalState(ls);
    setCurrentStream("...");
    
    DataService
      .sendData({
        data: inputValue,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // "Authorization":"Bearer " + globalState.user.user_id
        }
      })
      .then(async (resp) => {
          if(resp != undefined){
            
              let data = resp.data.split("_");
              let str = "";
              for(let i = 0; i < data.length; i++){
                if(data[i] != ""){
                  let m = JSON.parse(data[i]);
                  if(m){
                    console.log(m.message);
                    str = str + m.message;
                  }
                }
              }
              let ls = localState;
              ls[ls.length - 1] = {
                position: 'left',
                type: 'text',
                text: str,
                date: new Date(),
              };
              sleep(2000);
              setCurrentStream(str)
              setLocalState(ls);
            
          }
      })
      .catch((error) => {
          // Handle the error here
          console.error('An error occurred:', error);
          setCurrentStream('An error occurred:', error);
      })
      .finally(() => {
          // Code to run regardless of success or failure
          console.log('Set Data request completed');
          // let ls = localState;
          // ls[ls.length - 1] = {
          //   position: 'left',
          //   type: 'text',
          //   text: currentStream,
          //   date: new Date(),
          // };
          // setLocalState(ls);
      });
  }

  const inputClear = () => {};

  const handleLogout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT_USER' });
    router.push('/');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const chooseFromChoices = (num) => {
    console.log(prompts);
    console.log(prompts[num]);
    let str = prompts[num].prompt;    
    setInputValue(str);
    setCurrentStream("")
  };


  return (
    <>
      <main className={`${styles.main}`}>

        <div>

          <div className="container">
            <div className="row">
              <div className="col-12 col-md-3">
                <button onClick={()=> chooseFromChoices(1)}>Say Hello</button>
              </div>
              <div className="col-12 col-md-3">
                <button onClick={()=> chooseFromChoices(2)}>Say Hello2</button>
              </div>
              <div className="col-12 col-md-3">
                <button onClick={()=> chooseFromChoices(3)}>Say Hello3</button>
              </div>
              <div className="col-12 col-md-3">
                <button onClick={()=> chooseFromChoices(4)}>Say Hello4</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                  
                <MessageList
                  className='message-list'
                  lockable={true}
                  toBottomHeight={'100%'}
                  dataSource={localState} />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Input
                  placeholder='Type here...'
                  multiline={true}
                  value={inputValue}
                  onChange={handleInputChange}
                  rightButtons={<Button color='white' backgroundColor='black' text='Send' onClick={handlePrompt} />}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
