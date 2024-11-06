import React from 'react';
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <div className={styles.logo}><img className={styles.img} src="https://mellow-seahorse-fc9268.netlify.app/assets/logo.png"/><span>PhotoFolio</span></div>
    </div>
  )
}

export default Navbar