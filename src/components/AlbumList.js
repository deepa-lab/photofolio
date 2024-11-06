import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInit';
import styles from './AlbumList.module.css';
import { collection, onSnapshot } from 'firebase/firestore';
import AlbumForm from './AlbumForm';
import ImagesList from './ImagesList';
import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';


const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = () => {
      try{
      setLoading(true)
      const unsub = onSnapshot(collection(db, 'albums'), (snapshot) => {
        const albums = snapshot.docs.map((doc) => ({
  
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(albums); // Set the albums here
      });
      return unsub; // Return the unsubscribe function
    }catch(err){
      toast.error('Something went wrong!');
    }finally{
      setLoading(false)
    }
    };
    
    const unsubscribe = getData(); // Call getData to start listening for updates
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setShowDetails(true);
  };
  return (
    <>
    {loading && <Spinner radius={120} color={"#333"} stroke={2} visible={true} />}
    {show && !showDetails && <AlbumForm/>}
    {showDetails && selectedAlbum && <ImagesList album={selectedAlbum} setShowDetails={setShowDetails} showDetails = {showDetails} setShow={setShow} show={show} images={images} setImages={setImages}/>}
    {!showDetails && (<div className={styles.albumList}>
      <div className={styles.albumHeader}>
        <h3>Your albums</h3>
        {!show ? <button className={styles.albumAdd} onClick={()=>{setShow(true)}}>Add album</button>
        : <button className={styles.cancel} onClick={()=>{setShow(false)}}>Cancel</button>}
      </div>
      <div className={styles.albumContent}>
        {albums.map(album => (
          <div key={album.id} className={styles.album} onClick={() => handleAlbumClick(album)}>
            <img src="https://mellow-seahorse-fc9268.netlify.app/assets/photos.png"/>
            <span>{album?.name}</span>
          </div>
        ))}
      </div>
      
    </div>)}
    
    </>
  );
};

export default AlbumList;
