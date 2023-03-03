import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {useState, useEffect} from 'react';
import ShowPosts from './components/ShowPosts';
import FullPost from './components/FullPost';
import NewPost from './components/NewPost';
import EditPost from './components/EditPost';
import NewComment from './components/NewComment';
import EditComment from './components/EditComment';
import Show404 from './components/Show404';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Profile from './components/Profile';
import ViewProfile from './components/ViewProfile';
import 'materialize-css/dist/css/materialize.min.css'
import { Buffer } from 'buffer';

function App() {

  const [user, setUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)

  /* Check if auth token is valid and save user state on every page refresh */
  useEffect(() => {
    fetch("/user/check", {method: "POST", mode: "cors"})
    .then(response => response.json())
    .then(json => {
      if(json.token) {
        setLoggedIn(true)
        let user = JSON.parse(Buffer.from(json.token.split(".")[1], "base64").toString())
        setUser(user)
      } else {
        setLoggedIn(false)
        setUser({})
      }
    })
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<ShowPosts loggedIn={loggedIn} user={user} ></ShowPosts>}></Route>
          <Route path="/post/:id" element={<FullPost loggedIn={loggedIn} user={user} ></FullPost>}></Route>
          <Route path="/post/new" element={<NewPost user={user}></NewPost>}></Route>
          <Route path="/comment/:id" element={<NewComment user={user} ></NewComment>}></Route>
          <Route path="/edit/comment/:id" element={<EditComment></EditComment>}></Route>
          <Route path="/edit/post/:id" element={<EditPost></EditPost>}></Route>
          <Route path="/login" element={<LogIn setLoggedIn={setLoggedIn} setUser={setUser} ></LogIn>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          {loggedIn ? <Route path="/profile" element={<Profile user={user} setLoggedIn={setLoggedIn} setUser={setUser} ></Profile>}></Route> : null}
          <Route path="/profile/user/:id" element={<ViewProfile></ViewProfile>}></Route>
          <Route path='*' exact={true} element={<Show404></Show404>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
