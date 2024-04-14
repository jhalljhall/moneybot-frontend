import React, { useMemo, useState } from 'react';
import { useManualServerSentEvents } from '@/hooks/useManualServerSentEvents';
import DOMPurify from 'dompurify';

const ChatComponent: React.FC = () => {
    const [messageText, setMessageText] = useState("What's on your mind?");
    const {
        messages,
        startFetching,
        stopFetching
    } = useManualServerSentEvents('https://8000-harrismachi-dpfastapiop-ha84ayw1hju.ws-us110.gitpod.io/api/v1/openai/chat_model', {message: messageText});

    const combinedMessages = useMemo(() => {
        const safeHTML = DOMPurify.sanitize(messages.join('').replace(/\n\n/g, '<br /><br />'));
        return safeHTML;
    }, [messages]);

    return (
        <div className="max-w-md mx-auto my-10 space-y-4">
            <button onClick={startFetching} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                Start Streaming
            </button>
            <button onClick={stopFetching} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300">
                Stop Streaming
            </button>
            <div className="mt-4 p-2 bg-gray-100 rounded shadow" dangerouslySetInnerHTML={{__html: combinedMessages}} />
        </div>
    );
};
