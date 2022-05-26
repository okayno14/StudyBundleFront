import { actionTypes } from "../render/action/Actions"
import { windows } from "../render/Render"

export class Store
{
	constructor(render)
	{
		this.render = render
		this.actionType_exec = []
		this.add(actionTypes.LOGIN, this.loginExec)
		this.state = 
		{
			currentWindow: windows.START
		}
	}
	
	add(key, func)
	{
		var arr = [...this.actionType_exec, {key:key, func:func}]
		this.actionType_exec = arr
	}

	dispatch(action)
	{
		let {actionType} = action
		var entry = this.actionType_exec.filter((entry)=>entry.type === actionType)[0]
		entry.func(action)
		this.render.render(this.state)
	}

	loginExec(action)
	{
		const {type,..._state} = action
		this.state = {...this.state,..._state}
	}

	getState(){return this.state}
}