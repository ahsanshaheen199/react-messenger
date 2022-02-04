import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore/lite';
import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { auth, db } from '../firebase';

const Login = () => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        loading: false,
        error: ''
    });
    const navigate = useNavigate();

    const changeFormData = ( e ) => {
        setFormData( { 
            ...formData, 
            [e.target.name]: e.target.value 
        } )
    }

    const submitLoginForm = async ( e ) => {
        e.preventDefault();
        setFormData( { ...formData, loading: true } );
        if( ! formData.email || ! formData.password ) {
            setFormData({...formData, error: 'All fields are required!'})
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword( auth, formData.email, formData.password );
            await updateDoc( doc( db, 'users', userCredential.user.uid ), {
                isOnline: true
            });
            navigate('/', { replace: true });
        } catch ( error ) {
            setFormData({...formData, error: error.message, loading: false})
        }
    }

    return (
        <>
            {
                user && (
                    <Navigate to="/" replace={true} />
                )
            }
            <section>
                <h3>Log into your account</h3>
                <form className='form' onSubmit={submitLoginForm}>
                    <div className='input_container'>
                        <label htmlFor='name'>Email Address</label>
                        <input 
                            type="email" 
                            name='email'
                            value={formData.email} 
                            onChange={ changeFormData }
                        />
                    </div>
                    <div className='input_container'>
                        <label htmlFor='name'>Password</label>
                        <input 
                            type="password" 
                            name='password'
                            value={formData.password} 
                            onChange={ changeFormData }
                        />
                    </div>
                    {
                        formData.error && <p className='error'>{formData.error}</p>
                    }
                    <div className='btn_container'>
                        <button disabled={formData.loading} className='btn'>
                            {
                                formData.loading ? 'Logging in....' : 'Login'
                            }
                        </button>
                    </div>
                </form>
            </section>    
        </>
    );
};

export default Login;