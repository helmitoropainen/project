import {Link, useNavigate, useParams} from "react-router-dom"
import { useState, useEffect } from "react"

function EditComment() {
    const [postData, setPostData] = useState({})
    const {id} = useParams()

    /* Fetch post data from url parameter */
    useEffect(() => {
        if(id) {
            fetch("/api/content/post/" + id, {mode: "cors"})
            .then(response => response.json())
            .then(json => {
            setPostData(json)
        })
        }
    }, [id])

    /* Edit post and navigate back to post on success */
    const submit = (e) => {
        e.preventDefault()
        let payload = {}
        payload["edit"] = {title: postData.title, content: postData.content}
        payload["post"] = id
        console.log(payload)
        fetch("/api/edit",{ 
            method: "post",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.success) {
                routeChange(id)
            }
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
                <div className="col s6"> <h3 className="white-text">Edit post</h3> </div>
                <div className="col s6"> 
                <Link className="btn" to="/home">Home</Link>
                </div>
            </div>
            <div className="form">
                <form onSubmit={submit} onChange={handleChange} id="newpost">
                <input type="text" name="title" value={postData.title} required></input>
                    <br/>
                    <br/>
                    <label htmlFor="content" >Content</label>
                    <textarea value={postData.content} style={{height: "200px"}} name="content" form="newpost" required></textarea>
                    <input className="btn" type="submit" value="Save" ></input>
                </form>
                <br/>
                <button className="btn" onClick={()=>routeChange(id)}>Cancel</button>
            </div>
        </div>
    )
}

export default EditComment