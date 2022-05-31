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
			currentWindow: windows.START,
			currentUser: undefined,
			pickedBundle: undefined,
			bestMatchBundle: undefined,
			groupsFetched: [],
			myCourses: [],
			myBundles: []
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
		this.getBundlesExec = this.getBundlesExec.bind(this)
		this.pickedBundleExec = this.pickedBundleExec.bind(this)
		this.sendBundleExec = this.sendBundleExec.bind(this)
		this.add(actionTypes.LOGIN, this.loginExec)
		this.add(actionTypes.MOVE_TO_BUNDLE, this.moveToBundleExec)
		this.add(actionTypes.GET_MY_COURSES, this.getMyCoursesExec)
		this.add(actionTypes.FETCH_GROUP, this.fetchGroupExec)
		this.add(actionTypes.GET_BUNDLES, this.getBundlesExec)
		this.add(actionTypes.PICK_BUNDLE, this.pickedBundleExec)
		this.add(actionTypes.SEND_BUNDLE,this.sendBundleExec)
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
		console.log("INFO. STORAGE. Action executed: "+type)
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
		let b = action.myCourses
		let a = this.snapshot.myCourses

		this.snapshot=
		{
			...this.snapshot,
			myCourses: this.concatWithSingleID(a,b)
		}
	}

	getBundlesExec(action)
	{
		const {data} = action
		this.snapshot=
		{
			...this.snapshot,
			myBundles:data
		}
	}

	fetchGroupExec(action)
	{
		const{type,group} = action
		const{groupsFetched} = this.snapshot
		
		this.snapshot =
		{
			...this.snapshot,
			groupsFetched: this.concatWithSingleID(groupsFetched,[group])
		}
	}

	pickedBundleExec(action)
	{
		const{data} = action
		
		this.snapshot = 
		{
			...this.snapshot,
			pickedBundle:data
		}
	}

	sendBundleExec(action)
	{
		const {data} = action
		const {arr,percent} = data
		let {myBundles} = this.snapshot
		const b1 = arr[0]
		let b2 = arr[1]
		b2 = 
		{
			...b2,
			percent:percent
		}
		
		let bundlesFiltered = myBundles.map(elem=>
		{
			if(elem.id===b1.id)
			{
				return b1
			}
			return elem
		})

		this.snapshot = 
		{
			...this.snapshot,
			pickedBundle:b1,
			bestMatchBundle:b2,
			myBundles:bundlesFiltered
		}
	}

	getState(){return this.snapshot}

	containsID(arr, id)
	{
		let res = arr.find(elem=>(elem.id===id))
		return res!==undefined
	}

	concatWithSingleID(a,b)
	{
		b.map((elem)=>
		{
			if(!this.containsID(a,elem.id))
			{
				a = [...a,elem]
			}
		})
		return a
	}


}