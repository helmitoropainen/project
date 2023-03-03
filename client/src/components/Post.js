import {useState, useEffect} from "react"
import {Link} from "react-router-dom"

function Post({full, post, comment, user}) {
    const [userData, setUserData] = useState({})
    const [voteData, setVoteData] = useState({ups: 0, downs: 0})
    const [error, setError] = useState({})

    useEffect(() => {
        if (post.votes) {
            setVoteData({
                ups: post.votes.filter(item => item.vote).length,
                downs: post.votes.filter(item => !item.vote).length
            })
        }
        if(post.user) {
            fetch("/user/info/" + post.user, {mode: "cors"})
            .then(response => response.json())
            .then(json => {
                setUserData(json)
            })
        }
    }, [post])

    const vote = (e, vote) => {
        if(post._id) {
            e.stopPropagation()
            let payload = { vote: vote, post: post._id }
            fetch("/api/vote", {
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
                if (json.post) {
                    setVoteData({
                        ups: json.post.votes.filter(item => item.vote).length,
                        downs: json.post.votes.filter(item => !item.vote).length
                    })
                } else setError(json)
            })
        }
    }

    return (
        <div className="card-panel hoverable">
            <div className="right-align">
                <p><span onClick={(e)=>vote(e, true)} >🔼</span> {voteData.ups-voteData.downs} <span onClick={(e)=>vote(e, false)} >🔽</span></p>
            </div>
            <div>
                <p className="left-align">{full ? post.content : post.title}</p>
            </div>
            <div className="right-align">
                <p>{!comment ? "Posted by" : "Comment by"} <Link onClick={(e)=>e.stopPropagation()}to={ user.id === userData._id ? "/profile" : "/profile/user/" + userData._id} className="teal-text">{userData.username}</Link></p>
                <p>Last updated {new Date(post.updatedAt).toString().slice(0,21)}</p>
                <Link to={"/comment/" + post._id} className={full && !comment ? "btn" : "hide"} >Reply</Link>
                {user.id === userData._id & full ? <Link to={(comment ? "/edit/comment/" : "/edit/post/") + post._id} style={{marginLeft: "10px"}} className="btn" >Edit</Link> : null}
                {error.message ? <p>{error.message}: Only logged in users can vote</p> : ""}
            </div>
        </div>
    )
}

 export default Post