import { Component } from "react";
import httpRequest from "../../plugin/httpRequest";
import loadingChat from '../../assets/gif/loading.gif'
import Button from "../../components/ui/Button";

class CustomerService extends Component {
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

        const lastVisit = localStorage.getItem('lastChatbotVisit');
        const now = new Date().getTime();

        // 24 jam = 86400000 ms
        if (!lastVisit || now - lastVisit > 86400000) {
            this.setState(prevState => ({
                chatbotMessages: [
                    ...prevState.chatbotMessages,
                    { role: 'assistant', content: 'Halo! Ada yang bisa saya bantu hari ini?' }
                ]
            }), () => {
                this.scrollChatbot();
            });

            localStorage.setItem('lastChatbotVisit', now);
        }
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
                chatbotMessages: messages,
                 
            }, () => this.scrollChatbot());
        } catch (error) {
            console.error(error);
        }
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
    
        try {
            const res = await(httpRequest(process.env.REACT_APP_BASE_URL, `chat`, 'POST', {
                values: {
                    userId: userData.user.id,
                    message: [{ role: 'user', content: newMessage }]
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

    deleteChat = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        await httpRequest(process.env.REACT_APP_BASE_URL, `chat/history/${userData.user.id}`, 'DELETE');
        this.getChatHistory();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="bg-white">
                    <div className="pb-3 font-bold text-2xl flex items-center justify-between">
                        <span>Customer Service</span>
                        <Button 
                            text="Hapus Chat"
                            cssClass="btn-danger text-sm"
                            onClick={() => this.deleteChat()}
                        />
                    </div>
                    <div>
                        <div className="chat-container px-[12px] pt-[12px]" style={{ overflowY: 'auto', background: '#f0f0f0', borderRadius: '8px', marginBottom: '12px' }}>
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
                                            style={{ width: '60px', height: '60px' }} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full pb-2">
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
                    <div>
                        <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex', width: '100%' }}>
                            <input
                                type="text"
                                value={this.state.chatbotInput}
                                onChange={(e) => this.setState({ chatbotInput: e.target.value })}
                                onKeyDown={this.handleKeyDownChatbot}
                                placeholder="Ketik pesan..."
                                style={{ flex: 1, marginRight: '8px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                            <button onClick={this.sendChatbotMessage} style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Kirim</button>
                        </div>
                    </div>
                </div>
                {/* <div className="">
                    <div style={{ 
                        backgroundColor: '#fff',
                        padding: '10px', 
                        borderBottom: '1px solid #ccc', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        justifyContent: 'space-between' 
                    }}>
                        <span>Customer Service</span>
                    </div>
                    <div style={{  }}>
                        <div className="chat-container px-[12px] pt-[12px]" style={{ height: 'calc(100vh - 330px)', overflowY: 'auto', background: '#f0f0f0', borderRadius: '8px', marginBottom: '12px' }}>
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
                        <div style={{ width: '100%', padding: '0 10px 10px 10px', display: 'flex', gap: '6px' }}>
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
                        <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex', width: '100%' }}>
                            <input
                                type="text"
                                value={this.state.chatbotInput}
                                onChange={(e) => this.setState({ chatbotInput: e.target.value })}
                                onKeyDown={this.handleKeyDownChatbot}
                                placeholder="Ketik pesan..."
                                style={{ flex: 1, marginRight: '8px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                            <button onClick={this.sendChatbotMessage} style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Kirim</button>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

export default CustomerService