import React, { useState } from 'react';
import {  BsFileEarmarkArrowUp, BsPlayFill } from 'react-icons/bs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import userSix from '../../images/user/Graident-Ai-Robot-1.png';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Plugin pour gérer les liens
import DefaultLayout from '../../layout/DefaultLayout';

const ECommerce: React.FC = () => {

    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const apiKey = 'AIzaSyDGhKHN__SdqQsHC7xWY-APWxOcVkuG-N4'; // Remplacez par votre clé API réelle
    const genAI = new GoogleGenerativeAI(apiKey);

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async () => {
        if (!userInput) return;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model.generateContentStream([userInput]);

            const chat = model.startChat({
                history: [
                    ...chatHistory.map(message => ({
                        role: message.role,
                        parts: [{ text: message.text }],
                    })),
                ],
                generationConfig: {
                    maxOutputTokens: 200,
                },
            });

            const msg = userInput;
            const result4 = await chat.sendMessage(msg);
            const response2 =  result4.response;
            const text = response2.text();

            setChatHistory(prevHistory => [
                ...prevHistory,
                { role: "user", text: msg },
                { role: "model", text: text },
            ]);

            // Clear user input after submission
            setUserInput('');

        } catch (error) {
            console.error(error);
            setChatHistory(prevHistory => [
                ...prevHistory,
                { role: "user", text: 'Oops! Something went wrong. Try again later.' },
            ]);
        }
    };

    return (
        <DefaultLayout>
            <div className="h-full flex flex-col">
                <div className="flex-1">
                    <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
                   
                <div className="mb-4 flex flex-col items-center justify-center">
                <img src={userSix}  className=' rounded-full  w-40 h-40' />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Comment puis-je vous aider ?</h4>
                </div>
                        <div>
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`p-4 rounded-lg shadow ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-700'}`}>
                                        <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="  w-9/12 bg-gray-100 p-6 rounded-b-lg shadow flex items-center fixed bottom-0  ">
                    <input 
                        type="text"
                        placeholder="Type your question here..."
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={(event) => event.key === 'Enter' && handleSubmit() && setUserInput('')}
                        className="flex-1 p-4 rounded-lg border border-gray-300 focus:outline-none  "
                    />
                    <button onClick={handleSubmit} className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none">
                        <BsPlayFill className="text-2xl" />
                    </button>
                    <label htmlFor="file-upload" className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none">
                        <BsFileEarmarkArrowUp className="text-2xl" />
                    </label>
                    <input id="file-upload" type="file" className="hidden" />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ECommerce;
