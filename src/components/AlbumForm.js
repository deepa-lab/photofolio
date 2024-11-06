import React from 'react'
import styles from "./AlbumForm.module.css";
import { useState } from 'react';
import { db } from '../firebaseInit';
import { collection, addDoc } from "firebase/firestore"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlbumForm = () => {
    const [name, setName]= useState("")

  async function handleSubmit(e){
    e.preventDefault();
    if(!name) return
    console.log('submit')
    const docRef = await addDoc(collection(db, "albums"), {
        name
      });
      if(docRef.id) {
        toast.success("Album created successfully!");
      // console.log("Document written with ID: ", docRef.id);
      setName("");
      }
  }  
  return (
    <div className = {styles.albumForm}><h1>Create an album</h1>
    <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder='Album name' value={name} onChange={(e)=>{setName(e.target.value)}} required/>
        <button className={styles.clear} onClick={(e)=>{e.preventDefault(); setName("")}}>Clear</button>
        <button type='submit'>Create</button>
    </form>
    <ToastContainer />
    </div>
  )
}

export default AlbumForm