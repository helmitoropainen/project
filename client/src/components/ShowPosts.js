import {useState, useEffect} from "react"
import {Link, useNavigate} from "react-router-dom"
import Post from './Post';

function ShowPosts({loggedIn, user}) {
    const [postData, setPostData] = useState({})

    useEffect(() => {
        fetch("/api/post/list", {mode: "cors"})
        .then(response => response.json())
        .then(json => {
            setPostData(json.reverse())
        })
    }, [])

    let navigate = useNavigate({}); 
    const routeChange = (id) => { 
        let path = "/post/" + id
        navigate(path)
    }

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper" style={{padding: "20px"}}>
                <div className="col m6 s0"> <h3 className="white-text hide-on-small-only">All posts</h3> </div>
                <div className="col m6 s12"> 
                    <Link className="btn" to="/post/new">New post</Link>
                    {loggedIn ? <Link style={{marginLeft: "10px"}} className="btn" to="/profile">Profile</Link> : <Link style={{marginLeft: "10px"}} className="btn" to="/login">Log in</Link> }
                </div>
            </div>
            <ul>
                {Object.values(postData).map((post) => <li onClick={() => routeChange(post._id)}key={post._id} > <Post full={false} post={post} user={user} ></Post> </li>)}
            </ul>
        </div>
    )
    
 }

 export default ShowPosts