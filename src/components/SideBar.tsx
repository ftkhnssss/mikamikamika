'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/LeftSection.module.css';
import { assets } from '../assets/assets';
import { Add, ChatBubbleOutline, HelpOutline, History, Menu, MoreVert, Settings } from '@mui/icons-material';


const SideBar = () => {

  const[extended,setExtended] = useState(false)

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <Menu onClick={()=>setExtended(prev=>!prev)} className={`${styles.menu} ${styles.img}`} alt="Menu Icon"/>
        <div className={styles.newChat}>
          <Add className={styles.img} alt="Plus Icon"/>
          {extended?<p>New Chat</p>:null}
        </div>
        {extended?
        <div className={styles.recent}>
          <p className={styles.recentTitle}>Recent</p>
          <div className={styles.recentEntry}>
            <ChatBubbleOutline className={styles.img}  alt="Message Icon" />
            <p>Kaki Sakit Setelah ...</p>
          </div>
        </div>
        :null}
      </div>
      <div className={styles.bottom}>
        <div className={`${styles.bottomItem} ${styles.recentEntry}`}>
          <HelpOutline className={styles.img} alt="Question Icon" />
          {extended?<p>Bantuan</p>:null}
        </div>
        <div className={`${styles.bottomItem} ${styles.recentEntry}`}>
          <History className={styles.img} alt="History Icon" />
          {extended?<p>Aktifitas</p>:null}
        </div>
        <div className={`${styles.bottomItem} ${styles.recentEntry}`}>
          <Settings className={styles.img} alt="Setting Icon" />
          {extended?<p>Pengaturan</p>:null}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
