import {Start} from './component/Start'
import ReactDOM from 'react-dom/client'
import React from 'react'
export const windows =
{
	START:"START",
	BUNDLE_MANAGE:"BUNDLE",
	COURSE_MANAGE:"COURSE",
	USER_MANAGE:"USER"
}

export class Render
{
	constructor(actions)
	{
		this.actions=actions
		this.root = ReactDOM.createRoot(document.getElementById('root'))
		this.window_render = [{key:windows.START,func:Start},
								{key:windows.BUNDLE_MANAGE},
								{key:windows.COURSE_MANAGE},
								{key:windows.USER_MANAGE}
							]
		
		
	}

	render(state)
	{
		const {currentWindow} = state
		const window_render_entry = this.window_render.filter((entry)=>entry.key===currentWindow)
		let Elem = window_render_entry[0].func
		this.root.render
		(
			<React.StrictMode>
				<Elem props = {state}/>
			</React.StrictMode>
		)
	}

	start()
	{
		const window_render_entry = this.window_render.filter((entry)=>entry.key===windows.START)
		let Elem = window_render_entry[0].func
		this.root.render
		(
			<React.StrictMode>
				<Elem />
			</React.StrictMode>
		)
	}

	getActions()
	{
		return this.actions
	}
}
