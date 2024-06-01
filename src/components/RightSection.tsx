'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/RightSection.module.css';
import chatgptlogo2 from '@/assets/chatgptlogo2.png';
import nouserlogo from '@/assets/nouserlogo.png';
import Image from 'next/image';
import { getAIResponse } from '../components/app';
import { DeleteOutline, LightMode, SendOutlined } from '@mui/icons-material';

const RightSection = () => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const savedMessages = localStorage.getItem('allMessages');
            return savedMessages ? JSON.parse(savedMessages) : [];
        }
        return [];
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem('allMessages');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const sendMessage = async () => {
        setIsSent(false);
        const userMessage = message;

        // Tambahkan pesan pengguna ke allMessages
        let newAllMessages = [...allMessages, {
            role: "user",
            parts: [{ text: userMessage }]
        }];
        setAllMessages(newAllMessages);
        localStorage.setItem('allMessages', JSON.stringify(newAllMessages));
        setMessage(''); // Bersihkan input pesan

        let responseMessage = '';
        try {
            responseMessage = await getAIResponse(userMessage);
        } catch (error) {
            console.error('Error getting AI response:', error);
            responseMessage = 'Sorry, there was an error processing your request.';
        }
        
        // Tambahkan respons AI ke allMessages
        newAllMessages = [...newAllMessages, {
            role: "model",
            parts: [{ text: responseMessage }]
        }];
        setAllMessages(newAllMessages);
        localStorage.setItem('allMessages', JSON.stringify(newAllMessages));
        setIsSent(true); // Menandakan bahwa pesan telah terkirim dengan sukses
    };

    const renderMessage = (msg) => {
        // Ganti karakter baris baru (\n) dengan tag <br>
        let textWithBreaks = msg.replace(/\n/g, '<br>');

        // Ganti **teks bold** dengan tag <strong>
        textWithBreaks = textWithBreaks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Ganti *teks italic* dengan tag <em>
        textWithBreaks = textWithBreaks.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return textWithBreaks;
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    return (
        <div className={styles.rightSection}>
            <div className={styles.rightin}>
                <div className={styles.chatgptversion}>
                    <p className={styles.text1}>Mika</p>
                </div>
                {allMessages.length > 0 ? (
                    <div className={`${styles.messages} ${styles.scrollbarStyles}`}>
                        {allMessages.map((msg, index) => (
                            <div key={index} className={styles.message}>
                                <Image src={msg.role === 'user' ? nouserlogo : chatgptlogo2} width={50} height={50} alt="" />
                                <div className={styles.details}>
                                    <h2>{msg.role === 'user' ? 'You' : 'CHATGPT Bot'}</h2>
                                    <p dangerouslySetInnerHTML={{ __html: renderMessage(msg.parts[0].text) }} />
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className={`${styles.nochat} ${allMessages.length === 0 && styles.hidden}`}>
                        <div className={styles.s1}>
                            <div className={styles.greeting}><h1 className={styles.greet}>Halo Fatkhan,</h1><br /></div>
                            <div className={styles.sapa}><h1 className={styles.coba}>Apa yang bisa kubantu hari ini?</h1></div>
                        </div>
                        <div className={styles.s2}>
                            <div className={styles.suggestioncard}>
                                <h2>Recommend activities</h2>
                                <p>psychology behind decision-making</p>
                            </div>
                            <div className={styles.suggestioncard}>
                                <h2>Recommend activities</h2>
                                <p>psychology behind decision-making</p>
                            </div>
                            <div className={styles.suggestioncard}>
                                <h2>Recommend activities</h2>
                                <p>psychology behind decision-making</p>
                            </div>
                            <div className={styles.suggestioncard}>
                                <h2>Recommend activities</h2>
                                <p>psychology behind decision-making</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.bottomsection}>
                    <div className={styles.ketikkontener}>
                        <div className={styles.ketikkonten}>
                            <div className={styles.ketikarea}>
                                <textarea 
                                    id="inputcet" 
                                    placeholder='Ketik...' 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Untuk mencegah input baris baru (newline) saat Enter ditekan
                                            sendMessage();
                                        }
                                    }}
                                    required
                                ></textarea>
                                <SendOutlined 
                                    className={styles.img} 
                                    onClick={sendMessage} 
                                    disabled={!isSent || !message.trim()}
                                />
                            </div>
                            <div className={styles.ketikontrol}>
                                <LightMode className={styles.img} alt="Light" />
                                <DeleteOutline className={styles.img} alt="Delete" />
                            </div>
                        </div>
                        <p className={styles.note}>Mika hanyalah asisten kesehatan, untuk mendapatkan diagnosa dan perawatana yang tepat datanglah ke dokter.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSection;
