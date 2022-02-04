import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { auth } from "../firebase";

export const UserContext = createContext();

export const UserContextProvider = ( { children } ) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const unsubscribe = onAuthStateChanged( auth, currentUser => {
            setUser(currentUser)
            setLoading(false);
        } )

        return () => {
            unsubscribe()
        }
    }, [] )

    if( loading ) {
        return <Loading />
    }

    return (<UserContext.Provider value={{ user,loading , setUser }}>{children}</UserContext.Provider>);
}