import {React} from 'react'
import './index.css'

export const Start = ()=>
{
	return(
		<div>
			<h2>Login Form</h2>

			<form action="" method="post">
				<div className="IMG_Container">
					<img src="logo192.png" alt="Avatar" className="Avatar"/>
				</div>
				<div className="Container">
					<label htmlFor="uname"><b>Username</b></label>
					<input type="text" placeholder="Enter Username" name="uname" required/>
					
					<label htmlFor="psw"><b>Password</b></label>
					<input type="password" placeholder="Enter Password" name="psw" required></input>
					
					<button type="submit">Login</button>
				</div>
			</form>
		</div>
	)
	
}





// export class Start extends Component
// {
// 	render(
// 		<h1>Hello, World</h1>
// 	)
// }