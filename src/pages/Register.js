import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
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

    const submitRegisterForm = async ( e ) => {
        e.preventDefault();
        setFormData( { ...formData, loading: true } );
        if( ! formData.name || ! formData.email || ! formData.password ) {
            setFormData({...formData, error: 'All fields are required!'})
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await setDoc( doc( db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: formData.name,
                email: formData.email,
                isOnline: false,
                createdAt: Timestamp.fromDate( new Date() )
            } );
            setFormData({
                name: '',
                email: '',
                password: '',
                loading: false,
                error: ''
            })
            navigate('/login');
        } catch ( error ) {
            setFormData({...formData, error: error.message, loading: false})
        }
    }

    return (
        <section>
            <h3>Create an account</h3>
            <form className='form' onSubmit={submitRegisterForm}>
                <div className='input_container'>
                    <label htmlFor='name'>Name</label>
                    <input 
                        id='name' 
                        type="text" 
                        name='name' 
                        value={formData.name} 
                        onChange={ changeFormData } 
                    />
                </div>
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
                            formData.loading ? 'Creating....' : 'Register'
                        }
                    </button>
                </div>
            </form>
        </section>    
    );
};

export default Register;
