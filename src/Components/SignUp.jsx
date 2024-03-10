
import { TbUserHeart } from "react-icons/tb";
import { TbPasswordFingerprint } from "react-icons/tb";
import { MdOutlineAlternateEmail } from "react-icons/md";
const SignUp = () => {
    return (
        <div className='wrapper'>
            <form action="">
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
                <div className="input-box">
                    <input type="email" placeholder="Email" required />
                    <MdOutlineAlternateEmail className='icon' />

                </div>
                <button type="submit">Register</button>

            </form>
        </div>
    );

}
export default SignUp;