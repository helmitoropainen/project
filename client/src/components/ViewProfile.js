import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function ViewProfile() {
    const [userData, setUserData] = useState({})
    const {id} = useParams()

    /* Fetch user data from url parameter */
    useEffect(() => {
        if(id) {
            fetch("/user/info/" + id, {mode: "cors"})
            .then(response => response.json())
            .then(json => {
            setUserData(json)
        })
        }
    }, [id])

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper">
                <div className="col s6"> <h3 className="white-text">Profile</h3> </div>
                <div className="col s6"> 
                    <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <div className="form">
                <h4>{userData.username}</h4>
                <p>Member since {new Date(userData.createdAt).toDateString().slice(4)}</p>
                {userData.bio ? <p>Bio: {userData.bio}</p> : null}
            </div>
        </div>
    )
}

 export default ViewProfile