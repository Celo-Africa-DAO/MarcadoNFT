import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  getAllNFTs,
  isWallectConnected,
  getEtheriumContract,
} from "./Blockchain.services";
import Alert from './Components/Alert'
import CreateNFT from './Components/CreateNFT'
import Footer from './Components/Footer'
import LandingPage from "./Components/LandingPage"
import Loading from './Components/Loading'
import MyList from './Components/MyList'
import NavBar from "./Components/NavBar"
import ShowNFT from './Components/ShowNFT'
import UpdateNFT from './Components/UpdateNFT'
import { getGlobalState } from './store'

const App = () => {
  const connectedAccount = getGlobalState('connectedAccount')
  useEffect(async() => {
    await isWallectConnected()
    await getAllNFTs()
    await getEtheriumContract()
  }, [])
  
  return (
    <>
        <div className="min-h-screen">
          <NavBar/>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/my-list" element={<MyList />} />
            </Routes>
            <CreateNFT/>
            <UpdateNFT/>
            <ShowNFT/>
          <Footer/>
          <Loading/>
          <Alert/>       
        </div>

    </>
 
  )
}

export default App
