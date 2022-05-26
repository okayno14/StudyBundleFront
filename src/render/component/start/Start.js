import {React} from 'react'
import * as API from '../../../API'
import './index.css'

export const Start = (props)=>
<div>
	<h2>Login Form</h2>
		<div className="IMG_Container">
			<img src="logo192.png" alt="Avatar" className="Avatar"/>
		</div>
		<div className="Container">
			<label htmlFor="email"><b>Username</b></label>
			<input type="text" placeholder="Enter Username" name="email" required/>
			
			<label htmlFor="pass"><b>Password</b></label>
			<input type="password" placeholder="Enter Password" name="pass" required></input>
			
			<button type="submit" onClick={()=>
				{
					let {actions} = props
					
					const body = 
					{ 
						email: document.getElementsByName("email")[0].value,
						pass: document.getElementsByName("pass")[0].value
					}
					
					API.login(body).then((result)=>
					{
						actions.login(result)
					})

				}}>
				Login
			</button>
		</div>
</div>	
