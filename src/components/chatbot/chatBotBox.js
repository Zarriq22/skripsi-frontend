import { Component } from "react";
import loadingChat from '../../assets/gif/loading.gif'
import httpRequest from "../../plugin/httpRequest";

class ChatBotBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showChatbot: false,
            chatbotMessages: [],
            chatbotInput: '',
            showLoadingChat: false,
            adminOnline: false,
            quickQuestions: [
                "Apa saja metode pembayaran yang tersedia?",
                "Bagaimana cara melacak pesanan saya?",
                "Apakah ada promo atau diskon saat ini?",
                "Berapa lama pengiriman biasanya?"
            ],
            chatHistory: []
        }
    }

    componentDidMount() {
        this.getChatHistory();
    }

    getChatHistory = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        try {
           const res = await httpRequest(process.env.REACT_APP_BASE_URL, `chat/history/${userData.user.id}`, 'GET');

            const messages = res.history.flatMap(item =>
                item.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            );

            this.setState({ 
                chatHistory: res.history,
                chatbotMessages: messages 
            });
        } catch (error) {
            console.error(error);
        }
    }

    showChatbot = () => {
        this.setState(
            prevState => ({ showChatbot: !prevState.showChatbot }),
            () => {
                if (this.state.showChatbot) {
                    this.scrollChatbot();
                }
            }
    );
    }

    sendChatbotMessage = async () => {
        const newMessage = this.state.chatbotInput;
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (!newMessage) return;
    
        const updatedMessages = [
            ...this.state.chatbotMessages,
            { role: 'user', content: newMessage }
        ];
    
        this.setState({ 
            chatbotMessages: updatedMessages, 
            chatbotInput: '',
            showLoadingChat: true
        });

        await httpRequest(process.env.REACT_APP_BASE_URL, `chat`, 'GET')
    
        try {
            const res = await(httpRequest(process.env.REACT_APP_BASE_URL, `chat`, 'POST', {
                values: {
                    userId: userData.user.id,
                    message: updatedMessages
                }
            }))
    
            const reply = res.reply;
    
            this.setState({
                chatbotMessages: [...updatedMessages, reply],
                showLoadingChat: false
            });
            this.scrollChatbot();
        } catch (err) {
            console.error(err);
        }
    }

    scrollChatbot = () => {
        setTimeout(() => {
            const container = document.querySelector('.chat-container');
            if (container) container.scrollTop = container.scrollHeight;
        }, 100);
    }

    handleKeyDownChatbot = (e) => {
        if (e.key === 'Enter') {
            this.sendChatbotMessage();
            this.scrollChatbot();
        }
    }

    render() {
        // const { chatHistory, chatbotMessages } = this.state
        // const messages = chatHistory.flatMap(item =>
        //     item.messages.map(msg => ({
        //         role: msg.role,
        //         content: msg.content
        //     }))
        // );
        // if (messages) {
        //     chatbotMessages.push(...messages)
        // }
        // console.log(chatbotMessages)
        return (
            <>
                {this.state.showChatbot && (
                    <div style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '30px',
                        width: '300px',
                        height: '400px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 999
                    }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Chatbot</span>
                                <span style={{ cursor: 'pointer' }} onClick={() => this.setState({ showChatbot: false })}>✖️</span>
                            </div>
                            <div className="chat-container" style={{  height: '63%', maxHeight: '63%', overflowY: 'auto', padding: '12px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '12px' }}>
                                {this.state.chatbotMessages.map((msg, index) => (
                                    <div key={index} style={{
                                        textAlign: msg.role === 'user' ? 'right' : 'left',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            backgroundColor: msg.role === 'user' ? '#4caf50' : '#ffffff',
                                            color: msg.role === 'user' ? '#fff' : '#000',
                                            maxWidth: '70%'
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {this.state.showLoadingChat && (
                                    <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            backgroundColor: '#f0f0f0',
                                            color: '#000'
                                        }}>
                                            <img 
                                                src={loadingChat} 
                                                alt="Loading..." 
                                                style={{ width: '20px', height: '20px' }} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ position: 'absolute', bottom: '10%', width: '100%', padding: '0 10px 10px 10px', display: 'flex', gap: '6px' }}>
                                <div className="quick-questions">
                                    {this.state.quickQuestions.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => this.setState({ chatbotInput: item }, () => this.sendChatbotMessage())}
                                            style={{
                                                padding: '6px 10px',
                                                backgroundColor: '#e0e0e0',
                                                border: 'none',
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {item}
                                        </button>
                                    ))}

                                </div>
                            </div>
                            <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex', position: 'absolute', bottom: '0', width: '100%' }}>
                                <input
                                    type="text"
                                    value={this.state.chatbotInput}
                                    onChange={(e) => this.setState({ chatbotInput: e.target.value })}
                                    onKeyDown={this.handleKeyDownChatbot}
                                    placeholder="Ketik pesan..."
                                    style={{ flex: 1, marginRight: '8px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                                />
                                <button onClick={this.sendChatbotMessage} style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px' }}>Kirim</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default ChatBotBox