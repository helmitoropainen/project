import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

function Register() {

    const [userData, setUserData] = useState({})
    const [error, setError] = useState({})

    /* Create new user and show possible errors */
    const submit = (e) => {
        e.preventDefault()
        fetch("/user/register", {
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
                if (json.success) {
                    routeChange()
                } else setError(json)
            })

    }

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    let navigate = useNavigate({}); 
    const routeChange = () => { 
        let path = "/login"
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
                    <input className="btn" type="submit" value="Register"></input>
                </form>
                {error.message ? <p>{error.message}</p> : null}
            </div>
        </div>
    )
}

 export default Register