import {React} from 'react'
import { api } from '../../../index'

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
					const xhr = new XMLHttpRequest()
					let uri = "http://"+api+"/user/login"
					xhr.open('PUT', uri,true)
					console.log("Открыт запрос. Метод:"+"PUT "+"URI:"+ uri)
					
					xhr.setRequestHeader('Content-Type', 'application/json');
					xhr.send(JSON.stringify(body))
					
					xhr.onload=()=>
					{
						if(xhr.status !== 200)
						{
							console.trace("Запрос отменён\n"+xhr.responseText)
							return
						}
						console.trace("Запрос принят\n"+xhr.responseText)
						actions.login(JSON.parse(xhr.responseText).data)
					}

					xhr.onerror=()=>
					{
						console.trace("Ошибка запроса\n"+xhr.responseText)
					}

				}}>
				Login
			</button>
		</div>
</div>	
