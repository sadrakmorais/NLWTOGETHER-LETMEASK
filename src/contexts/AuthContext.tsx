
import {createContext, ReactNode, useState, useEffect} from 'react'
import {firebase,auth} from '../services/firebase'
type User ={
  id:string;
  name:string;
  avatar:string;
}
type AuthContextType ={
  user:User | undefined;
  signInWithGoogle:()=>Promise<void>;
}
export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps ={
  children:ReactNode;
}
export function AuthContextProvider(props: AuthContextProviderProps){
  
  const [user,setUser] = useState<User>()

//função para não perder os dados do usuario caso ele saia ou dê um f5
  useEffect(()=>{
    //BOA PRATICA, sempre que tiver um event listener ,retornar uma função para
    //para de ouvir no final do useEffect
    const unsubscribe = auth.onAuthStateChanged(user=>{
      if (user){
        const {displayName, photoURL,uid} = user
        if(!displayName || !photoURL){
          throw new Error('Missing information from google account')
        }

        setUser({
          id:uid,
          name:displayName,
          avatar: photoURL
        })
      }
    })
    //aqui estamos parando de ouvir no final do useEffect
    return()=>{
      unsubscribe()
    }
  },[])
async function signInWithGoogle(){

  const provider = new firebase.auth.GoogleAuthProvider()

  const result = await auth.signInWithPopup(provider)
    
      if(result.user){
        const {displayName, photoURL,uid} = result.user
        if(!displayName || !photoURL){
          throw new Error('Missing information from google account')
        }

        setUser({
          id:uid,
          name:displayName,
          avatar: photoURL
        })

      }
   
   
}

  return(
<AuthContext.Provider value={{user, signInWithGoogle}}>
{props.children}
</AuthContext.Provider>
  )
}