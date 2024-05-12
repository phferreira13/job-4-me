import React from "react";
import "./Message.css";

function Message(props: {message: string, user: string, isBot: boolean}) {
    const { message, user, isBot } = props;

    function convertToHtmlFormattedText(text: string) {
        return text.replace(/\n/g, "<br />");
    }

    return (
        <div className="message">
            <h3 className={isBot ? "master-header" : "player-header"}>{user}</h3>
            <p dangerouslySetInnerHTML={{__html: convertToHtmlFormattedText(message)}} className={isBot ? "master-content" : "player-content" }/>
        </div>
    );
}

export default Message;