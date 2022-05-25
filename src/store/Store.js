import { actionTypes } from "../render/action/Actions"
import { windows } from "../render/Render"

export class Store
{
	constructor(render)
	{
		this.render = render
		this.state = 
		{
			currentWindow: windows.START
		}
		this.actionType_exec = []
		this.add(actionTypes.LOGIN,this.loginExec)
	}
	
	add(key, func)
	{
		var arr = [...this.actionType_exec, {key:key, func:func}]
		this.actionType_exec = arr
	}

	dispatch(action)
	{
		let {actionType} = action
		var entry = this.actionType_exec.filter((entry)=>entry.type === actionType)
		entry.func(action)
		this.render.render(this.state)
	}

	loginExec(action)
	{

	}
}