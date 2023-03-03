import {Link, useNavigate, useParams} from "react-router-dom"
import { useState } from "react"

function NewComment({user}) {

    const [postData, setPostData] = useState({})
    const [error, setError] = useState({})
                
    const {id} = useParams()

    /* Create new comment and navigate back to post, if not logged in then show error */
    const submit = (e) => {
        e.preventDefault()
        postData["parentPost"] = id
        fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(postData),
            mode: "cors"
        })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.message === "Post created") routeChange(id)
                else setError(json)
            })
    }

    let navigate = useNavigate({}); 
    const routeChange = (id) => { 
        let path = "/post/" + id
        navigate(path)
    }

    const handleChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper">
                <div className="col s6"> <h3 className="white-text">New comment</h3> </div>
                <div className="col s6"> 
                <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <div className="form">
                <form onSubmit={submit} onChange={handleChange} id="newpost">
                    <label htmlFor="content" >Content</label>
                    <textarea placeholder="Content" style={{height: "200px"}} name="content" form="newpost" required></textarea>
                    <input className="btn" type="submit" value="Comment" ></input>
                </form>
                {error.message ? <p>{error.message}: Only logged in users can comment</p> : ""}
            </div>
        </div>
    )
}

export default NewComment