
import { TbUserHeart } from "react-icons/tb";
import { TbPasswordFingerprint } from "react-icons/tb";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted');
        //the url of the post request :http://localhost:8080/api/auth/register 
        //{
        // "username": "nour",
        //   "password": "password" 
        //} 
        const data = {
            username: e.target[0].value,
            password: e.target[1].value,

        };
        console.log(data);
        if (e.target[1].value === e.target[2].value) {
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
            navigate('/');
        } else {
            console.log('Passwords do not match');
        }
    }
    return (
        <div className='wrapper'>
            <form action="POST" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required />
                    <TbUserHeart className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <TbPasswordFingerprint className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" required />
                    <TbPasswordFingerprint className='icon' />
                </div>

                <button type="submit">Register</button>

            </form>
        </div>
    );

}
export default SignUp;