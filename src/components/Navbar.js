import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore/lite';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { auth, db } from '../firebase';

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const signOutUser = async (e) => {
        e.preventDefault();
        await updateDoc( doc(db, 'users', user.uid), {
            isOnline: false
        } )
        await signOut(auth);
        navigate('/login');
    }
    return (
        <nav>
            <h3>
                <Link to="/"> Messenger </Link>
            </h3>
            <div>
                {
                    user 
                    ?
                        <form onSubmit={signOutUser}>
                            <button className='btn' type='submit'>Logout</button>
                        </form>
                    : 
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                }
                
            </div>
        </nav>
    );
}

export default Navbar;
