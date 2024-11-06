import React, { useEffect } from 'react'
import styles from "./ImageForm.module.css"
import { db } from '../firebaseInit';
import { collection, addDoc, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ImageForm = ({album, setImages, edit, setEdit, selectedImage, setSelectedImage, title, url, setTitle, setUrl, setShowForm}) => {
 

  const getData = () => {
    const unsub = onSnapshot(collection(db, 'images'), (snapshot) => {
      const images = snapshot.docs.map((doc) => ({

        id: doc.id,
        ...doc.data(),
      }));
      setImages(images); // Set the albums here
    });
    return unsub; // Return the unsubscribe function
  };
  async function handleSubmit(e){
    e.preventDefault();
    if(!title || !url) return
    console.log('submit')
    let docRef;
    if(!selectedImage){
    docRef = await addDoc(collection(db, "images"), {
        title,
        url,
        albumId: album.id
      });
      
    }else{
      docRef = doc(db, "images", selectedImage.id);

      await updateDoc(docRef, {
        title,
        url,
        albumId: album.id
      });

    }
   
      toast.success(`Image ${selectedImage?.id ? 'updated' : 'added'} successfully!`);
      getData();
    // console.log("Document written with ID: ", docRef.id);
    setTitle("");
    setUrl("");
    setShowForm(false)
   
      
  } 
  function handleClear(e){
      e.preventDefault();
      setTitle("");
      setUrl("");
    
  } 

  // useEffect(()=>{
  //   getData()
  // }, [])
  return (
    <div className = {styles.albumForm}><h1>{edit ? `Update image ${selectedImage.title}`: `Add image to ${album.name}`}</h1>
    <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder='Title' value={title} onChange={(e)=>{setTitle(e.target.value)}} required/>
        <input type="text" placeholder='Image URL' value={url} onChange={(e)=>{setUrl(e.target.value)}} required/>
        <div className={styles.buttons}><button className={styles.clear} onClick={(e)=>handleClear(e)}>Clear</button>
        <button type='submit'>{edit ? 'Update' : 'Add'}</button></div>
    </form>
    {/* <ToastContainer /> */}
    </div>
  )
}

export default ImageForm