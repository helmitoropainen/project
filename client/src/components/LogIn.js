import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Buffer} from 'buffer'

function LogIn({setLoggedIn, setUser}) {

    const [userData, setUserData] = useState({})
    const [error, setError] = useState({})

    /* On succesful login save user data and navigate to home, otherwise show error */
    const submit = (e) => {
        e.preventDefault()
        fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData),
            mode: "cors"
        })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.token) {
                    setLoggedIn(true)
                    let user = JSON.parse(Buffer.from(json.token.split(".")[1], "base64").toString())
                    setUser(user)
                    routeChange()
                } else setError(json)
            })

    }

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    let navigate = useNavigate({}); 
    const routeChange = (id) => { 
        let path = "/home"
        navigate(path)
    }

    return (
        <div>
            <div style={{padding: 20}}className="teal lighten-3 right-align">
                <Link className="btn" to="/home">Home</Link>
            </div>
            <div className="form">
                <form onSubmit={submit} onChange={handleChange}>
                    <input type="text" name="username" placeholder="Username"></input>
                    <input type="password" name="password" placeholder="Password"></input>
                    <input className="btn" type="submit" value="Log in"></input>
                </form>
                {error.message ? <p>{error.message}</p> : null}
                <br></br>
                <p>No account?</p>
                <Link className="btn" to="/register">Register</Link>
            </div>
        </div>
    )
}

 export default LogIn