import {Start} from './component/start/Start'
import {Choice} from './component/choice/Choice'
import {Bundle} from './component/bundle_manage/Bundle'
import ReactDOM from 'react-dom/client'
import React from 'react'
export const windows =
{
	START:"START",
	BUNDLE_MANAGE:"BUNDLE",
	COURSE_MANAGE:"COURSE",
	USER_MANAGE:"USER",
	CHOICE:"CHOICE"
}

export class Render
{
	constructor(actions)
	{
		this.actions=actions
		this.root = ReactDOM.createRoot(document.getElementById('root'))
		this.window_render = []

		this.add(windows.START,Start)
		this.add(windows.CHOICE,Choice)
		this.add(windows.BUNDLE_MANAGE, Bundle)
	}

	render(snapshot)
	{
		const {currentWindow} = snapshot
		const window_render_entry = this.window_render.filter((entry)=>entry.key===currentWindow)
		let Elem = window_render_entry[0].func
		let p = 
		{
			snapshot:snapshot,
			actions:this.actions
		}
		this.root.render
		(
			<React.StrictMode>
				<Elem {...p}/>
			</React.StrictMode>
		)
	}

	getActions()
	{
		return this.actions
	}

	add(key, func)
	{
		var arr = [...this.window_render, {key:key, func:func}]
		this.window_render = arr
	}
}
