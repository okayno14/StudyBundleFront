import { actionTypes } from "../render/action/Actions"
import { windows } from "../render/Render"
import {login, logout, me} from "../API"

export class Store
{
	constructor(render)
	{
		this.render = render
		this.actionType_exec = []
		
		this.snapshot = 
		{
			currentWindow: windows.START
		}

		if(document.cookie !== undefined)
		{
			let prom = me()
			
			prom.then((result)=>
			{
				this.snapshot = {
					...this.snapshot,
					currentWindow:windows.CHOICE,
					currentUser:result
				}
				this.render.render(this.snapshot)
			})

			prom.catch((err)=>
			{
				document.cookie = ""
				this.render.render(this.snapshot)
			})
			
		}

		this.loginExec = this.loginExec.bind(this)
		this.moveToBundleExec = this.moveToBundleExec.bind(this)
		this.getMyCoursesExec = this.getMyCoursesExec.bind(this)
		this.fetchGroupExec = this.fetchGroupExec.bind(this)
		this.add(actionTypes.LOGIN, this.loginExec)
		this.add(actionTypes.MOVE_TO_BUNDLE, this.moveToBundleExec)
		this.add(actionTypes.GET_MY_COURSES, this.getMyCoursesExec)
		this.add(actionTypes.FETCH_GROUP, this.fetchGroupExec)
	}
	
	add(key, func)
	{
		var arr = [...this.actionType_exec, {key:key, func:func}]
		this.actionType_exec = arr
	}

	dispatch(action)
	{
		let {type} = action
		var entry = this.actionType_exec.filter((entry)=>entry.key === type)[0]
		entry.func(action)
		this.render.render(this.snapshot)
	}

	loginExec(action)
	{
		const {type,..._state} = action
		this.snapshot = 
		{
			...this.snapshot,
			currentWindow: windows.CHOICE,
			..._state
		}
	}

	moveToBundleExec(action)
	{
		this.snapshot=
		{
			...this.snapshot,
			currentWindow: windows.BUNDLE_MANAGE
		}
	}

	getMyCoursesExec(action)
	{
		const{type,..._state} = action
		this.snapshot=
		{
			...this.snapshot,
			..._state
		}
	}

	fetchGroupExec(action)
	{
		const{type,...group} = action
		const{groupsFetched} = this.snapshot
		
		let arr = []
		if(groupsFetched === undefined)
		{
			arr = [...arr,group]
		}
		
		else
		{
			arr = [...groupsFetched,group]
		}

		this.snapshot =
		{
			...this.snapshot,
			groupsFetched:arr
		}
		console.log("INFO. STORAGE. Action executed: "+type)
	}

	getState(){return this.snapshot}
}