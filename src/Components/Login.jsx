
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { TbUserHeart } from "react-icons/tb";
import { TbPasswordFingerprint } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
//impoer local storage 

const Login = () => {

    const navigate = useNavigate();
    const handleSubmit = (e) => {

        e.preventDefault();
        console.log('Form Submitted');
        //http://localhost:8080/api/auth/login 
        //send post request to the server with username and password 
        /* if (e.target[1].value === e.target[2].value) {
            fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log('User Created');
                } else {
                    console.log('User Not Created');
                }
            }); 
            //redirect to the dashboard page 
            navigate('/dashboard');
        } else {
            console.log('Passwords do not match');
} */
        const data = {
            username: e.target[0].value,
            password: e.target[1].value,
        };
        console.log(data);
        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log('User Logged In');
                response.json().then(data => {
                    console.log("response data is:", data);
                    localStorage.setItem('token', data.accessToken);
                    localStorage.setItem('username', document.getElementById('username').value);
                    navigate('/dashboard', { state: { username: document.getElementById('username').value } });

                    // TODO: at logout, remove the token and username from local storage
                });

            } else {
                console.log('User Not Logged In');
            }
        }).catch(error => {
            console.error('Error:', error);
        });






    }
    /* */
    return (
        <div className='wrapper'>
            <form action="POST" onSubmit={handleSubmit} >
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required id="username" />
                    <TbUserHeart className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <TbPasswordFingerprint className='icon' />
                </div>
                <button type="submit" >Login</button>
                <div className='register-link'>
                    {/* <p>Don't have an account? <Link to="/signup">Register</Link></p> */}
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
