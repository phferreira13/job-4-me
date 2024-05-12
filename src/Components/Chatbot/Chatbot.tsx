import React, { Fragment, useState } from "react";
import "./Chatbot.css";
import { Box, Button, FormControlLabel, List, ListItem, Radio, RadioGroup, TextField } from "@mui/material";
import Message from "./Message/Message";
import { AccountCircle } from "@mui/icons-material";
import { ChatbotModel, MessageModel } from "../../Models/Chatbot.model";
import { MessageType } from "../../Enums/MessageType.enum";


function Chatbot() {
    const [apiKey, setApiKey] = useState('');
    const [messages, setMessages] = useState<MessageModel[]>([]); // [Message, Message, Message, ...
    const [inputValue, setInputValue] = useState(''); // [Message, Message, Message, ...
    const [chatbot] = useState<ChatbotModel>(new ChatbotModel('gemini-1.5-pro-latest'));
    const [lastBotMessage, setLastBotMessage] = useState<MessageModel | null>(null); // [Message, Message, Message, ...
    const [playerName, setPlayerName] = useState('Jogador'); // [Message, Message, Message, ...
    const [radioValue, setRadioValue] = useState('1'); // [Message, Message, Message, ...
    const [hideButton, sethideButton] = useState(false); // [Message, Message, Message, ...


    const iniciarChat = () => {
        const newApiKey = inputValue.trim();
        setApiKey(newApiKey);
        chatbot.init(newApiKey);
        sendMessage('Iniciar Chat', true)
    }
    

    const sendMessage = (message: string, hiddenMessage: boolean = false) => {
        sethideButton(true);
        if(chatbot !== null){            
            chatbot.chat?.sendMessage(message).then((res) => {
                const text = res.response.text();
                const newBotMessage = new MessageModel(text, true, 'Mestre');
                if(!hiddenMessage){

                    const newUserMessage = new MessageModel(message, false, playerName);
                    setMessages([...messages, newUserMessage, newBotMessage]);
                }
                else{
                    setMessages([...messages, newBotMessage]);
                }
                setLastBotMessage(newBotMessage);
                setInputValue('');
                sethideButton(false);
            });
        }
    }

    function getInputTypeByMessage(){
        const message = lastBotMessage;
        if(message === null){
            return null;
        }
        if(message.messageType === MessageType.Continue){
            return (
                <Button variant="contained" size="large" onClick={() => sendMessage('Continuar')}>Continuar</Button>
            )
        }
        else if(message.messageType === MessageType.SetName){
            return (
                <Fragment>
                    <TextField fullWidth id="input-with-sx" label="Selecione uma resposta" variant="filled" onChange={e => setInputValue(e.target.value.trim())}/>

                    {
                        !hideButton 
                        ? <Button variant="contained" size="large" onClick={() => {
                            setPlayerName(inputValue);
                            sendMessage(inputValue)
                        }}>Enviar</Button>
                        : <p>Carregando...</p>
                    }
                </Fragment>
            )
        }
        else if(message.messageType === MessageType.EnterText){
            return (
                <Fragment>
                    <TextField fullWidth id="input-with-sx" label="Selecione uma resposta" variant="filled" onChange={e => setInputValue(e.target.value.trim())}/>

                    {
                        !hideButton 
                        ? <Button variant="contained" size="large" onClick={() => sendMessage(inputValue)}>Enviar</Button>
                        : <p>Carregando...</p>
                    }

                </Fragment>
            )
        }
        else if(message.messageType === MessageType.SelectOption){
            return (
                <Fragment>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={radioValue}
                        onChange={e => setRadioValue(e.target.value)}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="Opção 1" />
                        <FormControlLabel value="2" control={<Radio />} label="Opção 2" />
                        <FormControlLabel value="3" control={<Radio />} label="Opção 3" />
                    </RadioGroup>
                    {
                        !hideButton 
                        ? <Button variant="contained" size="large" onClick={() => sendMessage(radioValue.toString())}>Enviar</Button>
                        : <p>Carregando...</p>
                    }
                </Fragment>
            )
        }
    }


    return (
        <div className="chat">
        <h1>RPG.Chat</h1>
        <div className="messages">
            <List>
                {
                    messages.map((message, index) => {
                        return (
                            <ListItem key={index} className={!message.isBot ? 'response' : ''}>
                                <Message user={message.userName!} message={message.content}></Message>
                            </ListItem>
                        );
                    })
                }
            </List>
        </div>
        <div>
            {apiKey === '' 
                ? <Fragment>
                    <TextField fullWidth id="input-with-sx" label="API Key" variant="filled" onChange={e => setInputValue(e.target.value.trim())} />
                    {!hideButton 
                        ? <Button disabled={hideButton} variant="contained" size="large" onClick={() => {
                            setApiKey(inputValue);
                            iniciarChat();
                            sethideButton(true);
                        }}>Definir API Key</Button>
                        : <p>Carregando...</p>
                    }
                    
                </Fragment>
                : getInputTypeByMessage()
                
            }            
            
        </div>
        </div>
    );
}

export default Chatbot;