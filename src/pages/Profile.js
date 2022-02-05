import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import Camera from '../components/svg/Camera';
import Delete from '../components/svg/Delete';
import { UserContext } from '../context/userContext';
import { db, storage } from '../firebase';

const Profile = () => {
    const { user } = useContext(UserContext);
    const [img, setImg] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const deleteImage = async () => {
        try {
            const confirm = window.confirm("Delete avatar?");
            if (confirm) {
                await deleteObject(ref(storage, currentUser.avatarPath));
        
                await updateDoc(doc(db, "users", currentUser.uid), {
                    avatar: "",
                    avatarPath: "",
                });

                setCurrentUser({...currentUser,avatar: "", avatarPath: ""})
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect( () => {
        const userDoc = async () => {
            const docSnap = await getDoc( doc( db, 'users', user.uid ) );
            if(  docSnap.exists() ) {
                setCurrentUser(docSnap.data())
            }
        }
        userDoc();
    } ,[] )
    useEffect(() => {
        const userDoc = async () => {
            const docSnap = await getDoc( doc( db, 'users', user.uid ) );
            if(  docSnap.exists() ) {
                setCurrentUser(docSnap.data())
            }
        }
        if( img ) {
            const uploadImage = async () => {
                try {
                    if( currentUser.avatarPath ) {
                        await deleteObject( ref( storage, currentUser.avatarPath ) )
                    }
                    const imgRef = ref(storage, `avatar/${new Date().getTime()}-${img.name}`)
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL( ref( storage, snap.ref.fullPath ) );

                    await updateDoc(doc(db,'users', user.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath
                    })

                    setCurrentUser( { ...currentUser, avatar: url,
                        avatarPath: snap.ref.fullPath } )

                    setImg('')
                    
                } catch( error ) {
                    console.log(error);
                }
                
            }
            uploadImage();
        }
        userDoc();
    }, [img]);
    
    return currentUser && (
        <section>
            <div className='profile_container'>
                <div className='img_container'>
                    <img src={currentUser?.avatar ? currentUser.avatar : 'http://via.placeholder.com/300'} alt="avatar" />
                    <div className='overlay'>
                        <div>
                            <label htmlFor="photo">
                                <Camera />
                            </label>
                            {
                                currentUser.avatar ? <Delete deleteImage={deleteImage} /> : null
                            }
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                id="photo"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </div>
                    </div>
                </div>
                <div className='text_container'>
                    <h3>{currentUser.name}</h3>
                    <p>{currentUser.email}</p>
                    <hr/>
                    <small>Joined on: {currentUser.createdAt.toDate().toDateString()}</small>
                </div>
            </div>
        </section> 
    );
};

export default Profile;
