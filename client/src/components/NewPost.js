import {Link, useNavigate} from "react-router-dom"
import { useState } from "react"

function NewPost({user}) {

    const [postData, setPostData] = useState({})
    const [error, setError] = useState({})

    const submit = (e) => {
        e.preventDefault()
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
                if (json.message === "Post created") routeChange()
                else setError(json)
            })
    }

    let navigate = useNavigate({}); 
    const routeChange = (id) => { 
        let path = "/home/"
        navigate(path)
    }

    const handleChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <div className="row teal lighten-3 valign-wrapper">
                <div className="col s6"> <h3 className="white-text">New post</h3> </div>
                <div className="col s6"> 
                <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <div className="form">
                <form onSubmit={submit} onChange={handleChange} id="newpost">
                    <input type="text" name="title" placeholder="Title" required></input>
                    <br/>
                    <br/>
                    <label htmlFor="content" >Content</label>
                    <textarea placeholder="Content" style={{height: "200px"}} name="content" form="newpost" required></textarea>
                    <input className="btn" type="submit" value="Post" ></input>
                </form>
                {error.message ? <p>{error.message}: Only logged in users can post</p> : ""}
            </div>
        </div>
    )
}

export default NewPost