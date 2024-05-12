import React from "react";
import "./Message.css";

function Message(props: {message: string, user: string, timestamp?: Date}) {
    const { message, user, timestamp } = props;

    function convertToHtmlFormattedText(text: string) {
        return text.replace(/\n/g, "<br />");
    }

    return (
        <div className="message">
            <h3>{user}</h3>
            <p dangerouslySetInnerHTML={{__html: convertToHtmlFormattedText(message)}} />
        </div>
    );
}

export default Message;