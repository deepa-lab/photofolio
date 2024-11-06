import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebaseInit';
import { collection, onSnapshot, query, where, doc, deleteDoc, getDocs } from 'firebase/firestore';
import styles from './ImagesList.module.css';
import ImageForm from './ImageForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageCarousel from './ImageCarousel';
import Spinner from 'react-spinner-material';

const ImagesList = ({ album, setShowDetails, setShow, show, showDetails, images, setImages }) => {
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Store selected image for the carousel
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedImages, setSelectedImages] = useState(images); // Filtered images based on search
  const [showCarousel, setShowCarousel] = useState(false); // For showing the carousel
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!album) return; // Ensure there is an album before fetching images

    const getData = () => {
      try{
        setLoading(true)
      
      const q = query(collection(db, 'images'), where('albumId', '==', album.id));
      const unsub = onSnapshot(q, (snapshot) => {
        const images = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(images);
        setSelectedImages(images); // Update the selected images
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
  }, [album, setImages]);

  async function handleDelete(id, e) {
    try {
      e.stopPropagation();
      await deleteDoc(doc(db, 'images', id));
      setTitle('');
      setUrl('');
      toast.success('Image deleted successfully!');
      setShowForm(false)

    } catch (err) {
      toast.error(err.message);
    }
  }

  const debounceTimeout = useRef(null); // Ref to store timeout ID for debounce

  // Custom debounce function
  const debounce = (func, delay) => {
    // If there is a timeout already running, clear it
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      func();
    }, delay);
  };

  // Function to handle the search
  const handleSearch = async () => {
    try {
      if (!search.trim()) {
        setSelectedImages(images); // Reset to all images when search is empty
        return;
      }

      const q = query(
        collection(db, 'images'),
        where('title', '==', search.trim()),
        where('albumId', '==', album.id) // Make sure the albumId matches the selected album
      );

      const querySnapshot = await getDocs(q);
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSelectedImages(results); // Update the selected images with the search results
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong, please try again.');
    }
  };

  // useEffect to call the debounced search function whenever the search term changes
  useEffect(() => {
    if (search) {
      debounce(handleSearch, 500); // Debounce with 500ms delay
    }
  }, [search]); // Only run when 'search' state changes

  return (
    <>
     {loading && <Spinner radius={120} color={"#333"} stroke={2} visible={true} />}
      <div className={styles.container}>
        {!show && showDetails && showForm && (
          <ImageForm
            album={album}
            setImages={setImages}
            edit={edit}
            setEdit={setEdit}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            title={title}
            url={url}
            setTitle={setTitle}
            setUrl={setUrl}
            setShowForm={setShowForm}
          />
        )}
        <div className={styles.header}>
          <span onClick={() => setShowDetails(false)}>
            <img
              src="https://mellow-seahorse-fc9268.netlify.app/assets/back.png"
              alt="back"
              className={styles.img}
            />
          </span>
          <div className={styles.albumHeading}>
            {images?.length === 0 ? (
              <h1>No images in the album</h1>
            ) : (
              <h1 className={styles.heading}>Images in {album.name}</h1>
            )}
          </div>

          {showSearch && (
            <input
              type="text"
              value={search}
              placeholder="Search..."
              className={styles.inputSearch}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {selectedImages?.length > 0 || search.length > 0 ? (
            showSearch ? (
              <img
                src="https://mellow-seahorse-fc9268.netlify.app/assets/clear.png"
                alt="clear"
                className={styles.clear}
                onClick={() => {
                  setShowSearch(false);
                  setSearch('');
                  setSelectedImages(images); // Reset to all images
                }}
              />
            ) : (
              <img
                src="https://mellow-seahorse-fc9268.netlify.app/assets/search.png"
                className={styles.search}
                onClick={() => setShowSearch(true)}
              />
            )
          ) : null}

          {!showForm ? (
            <button
              className={styles.albumAdd}
              onClick={() => {
                setShowForm(true);
                setShowDetails(true);
                setShow(false);
                setEdit(false);
              }}
            >
              Add image
            </button>
          ) : (
            <button
              className={styles.cancel}
              onClick={() => {
                setShowForm(false);
                setShow(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {selectedImages?.length > 0 && (
          <div className={styles.imagesList}>
            {selectedImages?.map((image, i) => (
              <div
                className={styles.imageContainer}
                onClick={() => {
                  setSelectedImage(image);
                  setShowCarousel(true); // Show the carousel for selected image
                }}
                key={image.id}
              >
                <img
                  src={image.url}
                  alt={image.description || 'Image'}
                  className={styles.image}
                />
                <div className={styles.actions}>
                  <img
                    src="https://mellow-seahorse-fc9268.netlify.app/assets/edit.png"
                    alt="edit"
                    className={styles.edit}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(true);
                      setShowForm(true);
                      setSelectedImage(image);
                      setTitle(image.title);
                      setUrl(image.url);
                    }}
                  />
                  <img
                    src="https://mellow-seahorse-fc9268.netlify.app/assets/trash-bin.png"
                    alt="delete"
                    className={styles.delete}
                    onClick={(e) => handleDelete(image.id, e)}
                  />
                </div>
                <p>{image.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Conditionally render carousel */}
        {showCarousel && selectedImage && (
          <ImageCarousel
            images={images}
            index={images.findIndex((img) => img.id === selectedImage.id)}
            setShowCarousel={setShowCarousel}
            showCarousel={showCarousel}
          />
        )}
      </div>
    </>
  );
};

export default ImagesList;
