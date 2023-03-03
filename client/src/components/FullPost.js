import {useState, useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import Post from './Post';

function FullPost({user}) {
    const [rootPost, setRootPost] = useState({})
    const [postComments, setPostComments] = useState({})
    const {id} = useParams()

    useEffect(() => {
        fetch("/api/post/" + id, {mode: "cors"})
        .then(response => response.json())
        .then(json => {
            setRootPost(json.root)
            setPostComments(json.comments)
        })
    }, [id])

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper">
                <div className="col s6"> <h3 className="white-text">{rootPost.title}</h3> </div>
                <div className="col s6"> 
                    <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <ul>
                <li key={rootPost._id} > <Post full={true} user={user} post={rootPost} ></Post> </li>
                <ul className="comments">
                    {Object.values(postComments).map((comment) => <li key={comment._id} > <Post full={true} comment={true} post={comment} user={user} ></Post> </li> )}
                </ul>
            </ul>
        </div>
    )
    
 }

 export default FullPost