import React, { useEffect, useState } from 'react'
import ScrolltoBottom from 'react-scroll-to-bottom'

function Chat1({ socket, username, roomId }) {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])

    let sentMessage = async () => {
        if (currentMessage !== "") {
            let today = new Date()
            let timeStamp = new Intl.DateTimeFormat('en-us', { hour: '2-digit', minute: '2-digit' }).format(today)
            const messageData = {
                roomId: roomId,
                author: username,
                message: currentMessage,
                time: timeStamp
            }
            await socket.emit("send_message", messageData)
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("")

        }
    }
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
        socket.on("recive_user", (data) => {
            alert(`${data} is joined !!!`)
        })
        socket.on("left_user", (data) => {
            alert(`${data} is Left !!!`)
        })

    }, [socket])

    return (
        <>

            <div style={{ width: '358px' }} className='border border-2 shadow rounded-2  mb-5'>
                <div className='header d-flex  align-items-center bg-primary  text-white rounded-top-2  px-2 bg-success'>
                    <i className="fa-solid fa-circle text-danger fa-beat"></i>&nbsp;&nbsp;
                    <h5 className='mt-2'>Live Chat </h5>
                </div>
                <div className='ChatBody px-1 py-1' style={{ height: '500px' }} >
                    <ScrolltoBottom className='message-container'>
                        {
                            messageList.map((messageContent, index) => (
                                <>
                                    <div key={index} id={username === messageContent.author ? 'you' : 'other'}>
                                        <div className='message'>
                                            <div className='message-content'>
                                                <p id={username !== messageContent.author ? 'message-author' : 'none'}>{messageContent.author}</p>
                                                <p className='message-text btn btn-info rounded-pill px-4 '>
                                                    {messageContent.message}
                                                </p>
                                                <small className='message-meta'>{messageContent.time}</small>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))
                        }
                    </ScrolltoBottom>
                </div>
                <div className='footer d-flex'>
                    <input type="text" value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} placeholder='Write something...' className='form-control' onKeyPress={e => { e.key == 'Enter' && sentMessage() }} />
                    <button onClick={sentMessage} className='btn btn-success'><i className="fa-regular fa-paper-plane " ></i></button>
                </div>
            </div>
        </>
    )
}

export default Chat1