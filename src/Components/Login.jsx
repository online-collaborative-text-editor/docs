
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { TbUserHeart } from "react-icons/tb";
import { TbPasswordFingerprint } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
const Login = () => {

    const navigate = useNavigate();
    const HandleSubmit = (e) => {

        e.preventDefault();
        console.log('Form Submitted');
        if (e.target[0].value === 'admin' && e.target[1].value === 'admin') {
            navigate('/dashboard');
        }
    }

    return (
        <div className='wrapper'>
            <form onSubmit={HandleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required />
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
