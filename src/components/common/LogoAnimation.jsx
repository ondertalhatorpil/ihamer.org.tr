import React from 'react';
import styles from './LogoAnimation.module.css';

// Yeni tam logonuzu içe aktarın
import tamLogo from '../../assets/tam logo.png'; 

const LogoAnimation = () => {
  return (
    <div className={styles.animationWrapper}>
      <img 
        src={tamLogo} 
        alt="İHAMER Logo" 
        className={styles.fullLogo} 
      />
    </div>
  );
};

export default LogoAnimation;