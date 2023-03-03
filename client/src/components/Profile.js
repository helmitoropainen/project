import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function Profile({user, setLoggedIn, setUser}) {
    const [showTextField, setShowTextField] = useState(false)
    const [bio, setBio] = useState({})

    /* Log out user, clear user state, navigate back to home */
    const logOut = () => {
        fetch("/user/logout", {method: "POST"}, {mode: "cors"})
              .then(response => response.json())
              .then(json => {
                console.log(json)
                setLoggedIn(false)
                setUser({})
                routeChange()
              })
      }

    let navigate = useNavigate({}); 
    const routeChange = () => { 
        let path = "/home"
        navigate(path)
    }

    const handleChange = (e) => {
        setBio({[e.target.name]: e.target.value})
    }

    /* Edit user and update user bio */
    const submit = (e) => {
        e.preventDefault()
        fetch("/user/edit",{ 
            method: "post",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(bio)
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.user) {
                setShowTextField(false)
                user.bio = json.user.bio
                setUser(user)
            }
        })
    }

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper">
                <div className="col s6"> <h3 className="white-text">Profile</h3> </div>
                <div className="col s6"> 
                    <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <div className="form">
                <h4>{user.username}</h4>
                <p>Member since {new Date(user.createdAt).toDateString().slice(4)}</p>
                {user.bio ? <p>Bio: {user.bio}</p> : null}
                {showTextField ? <button className="btn" onClick={() => setShowTextField(false)}>Cancel</button> : <button className="btn" onClick={() => setShowTextField(true)}> {user.bio ? "Edit bio" : "Add bio"} </button>}
                {showTextField ? 
                <form onChange={handleChange} onSubmit={submit} id="bio">
                    <textarea style={{height: "200px", marginTop: "20px"}} name="bio" form="bio" required></textarea>
                    <input className="btn" type="submit" value="save"></input>
                </form> : null} 
                <br/> <br/>
                <button className="btn right-align" onClick={()=>logOut()}> Log out </button>
            </div>
        </div>
    )
}

 export default Profile