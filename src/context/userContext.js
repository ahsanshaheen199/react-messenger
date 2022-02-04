import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const UserContext = createContext();

export const UserContextProvider = ( { children } ) => {
    const [user, setUser] = useState(null);
    useEffect( () => {
        const unsubscribe =  onAuthStateChanged( auth, currentUser => {
            setUser(currentUser)
        } )
        return () => {
            unsubscribe();
        };
    }, [] )
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}