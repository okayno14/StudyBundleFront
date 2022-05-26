import { actionTypes } from "../render/action/Actions"
import { windows } from "../render/Render"

export class Store
{
	constructor(render)
	{
		this.render = render
		this.actionType_exec = []
		
		this.state = 
		{
			currentWindow: windows.START
		}
		this.loginExec = this.loginExec.bind(this)
		this.moveToBundleExec = this.moveToBundleExec.bind(this)
		this.add(actionTypes.LOGIN, this.loginExec)
		this.add(actionTypes.MOVE_TO_BUNDLE, this.moveToBundleExec)
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
		this.render.render(this.state)
	}

	loginExec(action)
	{
		const {type,..._state} = action
		this.state = 
		{
			...this.state,
			currentWindow: windows.CHOICE,
			..._state
		}
	}

	moveToBundleExec(action)
	{
		this.state=
		{
			...this.state,
			currentWindow: windows.BUNDLE_MANAGE
		}
	}

	getState(){return this.state}
}