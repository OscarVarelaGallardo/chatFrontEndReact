import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Chat.css';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const URL_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYxrGd7g7xDtL4M27L6JUzwZgIehkyhjQzXg&s";

const Message = ({ message, setMessage, messages, setMessages }) => {
    const [haveMessage, setHaveMessage] = useState(messages.length > 0);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);


    useEffect(() => {

        //si abri el puerto 8080
        socketRef.current = io('https://3.145.17.236:8080');

        socketRef.current.on('message', (newMessage) => {
            const { msg } = newMessage;
            newMessage = msg;
            //:TODO Validar los socket id para generar un chatRoom

            console.log("New Message", newMessage);

            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, [setMessages]);

    useEffect(() => {
        setHaveMessage(messages.length > 0);
    }, [messages]);

    const handleSubmitFile = (e) => {
        e.preventDefault();
        setLoading(true);
        if (e.target.files) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = (e) => {
                console.log(e.target.result);
                socketRef.current.emit('file', e.target.result);

            };
            //Send File
            setTimeout(() => {
                setLoading(false);
            }, 15000);

        }


    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.keyCode === 13 || e.type === 'click') {
            if (message.length === 0) return
            socketRef.current.emit('message', message);
            setMessage('');
        }
    };

    return (
        <>
            <div className='container-chat'>
                <div className="container-close">

                </div>
                <div className='date-message'>
                    <p className='date-text'>Hoy</p>
                </div>
                {
                    loading && <div className='message loading'>
                        <p className='message-loading'>Cargando...</p>
                    </div>
                }
                <div className='container-messages'>
                    {haveMessage ? messages.map((message, index) => (
                        <div key={index} className='message'>
                            <img src={URL_IMAGE} alt='profile'
                                style={{ width: '60px', height: '50px', borderRadius: '50%' }}
                                className='profile-image' />
                            <div className='message-text'>
                                <p className='message-text'>
                                    <span className='message-name'>PSWA</span>
                                    {`Mensaje: ${message}`}

                                    <span className='message-time'>
                                        {`Hora:${new Date().getHours() + ':' + new Date().getMinutes()}`}
                                    </span>

                                </p>
                            </div>
                        </div>
                    )) : <div className='message'>
                        <p className='message-text'>¡Hola! Escribe un mensaje para comenzar ...</p>
                    </div>}
                </div>


            </div>
            <div className='container-input'>
                <input type='text' className='input-message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Escribe un mensaje'
                    onKeyUp={(event) => { event.keyCode === 13 ? handleSubmit(event) : null }}
                />
                <FontAwesomeIcon icon={faFile}
                    className='icon-file'
                    onClick={() => document.getElementById('file').click()}
                />
                <input type='file' id='file' style={{ display: 'none' }}
                    onChange={handleSubmitFile}
                />

                <FontAwesomeIcon icon={faCaretRight}
                    className='icon-send'
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default Message;