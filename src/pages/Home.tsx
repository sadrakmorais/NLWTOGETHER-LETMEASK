import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import {Button} from '../components/Button'
import {useHistory} from 'react-router-dom'
import {database} from '../services/firebase'


import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth'
import { FormEvent,useState } from 'react'


export function Home(){
  
  const history = useHistory();
  const {signInWithGoogle,user}= useAuth()
  const [roomCode,setRoomCode] = useState('')
  
  async function handleCreateRoom(){
 
     if(!user){
       await signInWithGoogle()
     }
      history.push('/rooms/new')
    }
   
  async function handleJoinRoom(event:FormEvent){
   event.preventDefault()
 if(roomCode.trim() === ''){
   return;
   }
   const roomRef = await database.ref(`rooms/${roomCode}`).get()

   if(!roomRef.exists()){
     alert('Essa sala não existe!')
     return
   }

   history.push(`rooms/${roomCode}`)
  }

  return(
    <div id="page-auth" >
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
      
             <strong>Crie salas de Q&amp;A ao-vivo</strong> 
             <p>Tire dúvidas da sua audiência em tempo real.</p>     
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo" />
        
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="LogoGoogle" />
            Crie sua sala com o google
          </button>
          <div className="separator"> ou entre em uma sala</div>
          <form action="" onSubmit={handleJoinRoom}>
            <input type="text" 
            placeholder="Digite o código da sala"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}