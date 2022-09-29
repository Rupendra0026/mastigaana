import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
function App() {
  // required credentials
  const CLIENT_ID="b777e27e4120459594e0507d0aedfefe";
  const REDIRECT_URI="http://localhost:3000";
  const AUTH_ENDPOINT= "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE="token";
  // usestates
  const [token,setToken]=useState("");
  const [searchkey,setSearchkey]=useState("");
  const [artistdata,setArtistdata]=useState([""]);
  // function for searching the data
  // here async is mentionted because the input has to be taken from the user...
  const searchArtists=async (e)=>{
    e.preventDefault();
    const{data}=await axios.get("https://api.spotify.com/v1/search",{
      headers:{
        Authorization:`Bearer ${token}`
      },
      params:{
        q:searchkey,
        type:"artist"
      }
    })
    console.log(data);
    setArtistdata(data.artists.items);
  }
  // creating a token and storing it in a localstorage this is for login logout
   // this token is generate from the url
  useEffect(()=>{
    const hash=window.location.hash;
    let token=window.localStorage.getItem("token");
    if(!token && hash){
      token=hash.substring(1).split("&").find(elem=>elem.startsWith("access_token")).split("=")[1];
      // console.log(token);
      window.location.hash="";
      window.localStorage.setItem("token",token);
      
    }
    setToken(token);
  },[]);
  // in the logout function the created token will be deleted from the local storage
  const logout=()=>{
    setToken("");
    setArtistdata([""])
    window.localStorage.removeItem("token");
  }
  return (
    <div className='whole'>
      <div className='mainhome'>
      <h1>Masti Gaana</h1>
      {
        !token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>login to spotify</a>
        :console.log("done")
      }
      {
        token?
        <form onSubmit={searchArtists}>
          <input type="text" onChange={(e)=>setSearchkey(e.target.value)}/>
          <button type="submit">search</button>
          <br />
          <div className='logout'>
          <button onClick={logout}>logout</button>
          </div>
        </form>
        :<h2>please login to explore</h2>
      }
      <div className='artistedit'>
        {
          artistdata.map((x)=>{
            return(
              <>
              <h3 key={x.id}>{x.name}</h3>
             {/* {x.images.length() ?<img src={x.images[0].url} alt=""/>: <div>no image</div>} */}
              </>
            )
          })
        }
      </div>
    </div>
    </div>
  );
}

export default App;
