export const actionTypes = 
{
	LOGIN:"LOGIN",
	MOVE_TO_BUNDLE:"MOVE_TO_BUNDLE",
	GET_MY_COURSES:"GET_MY_COURSES",
	FETCH_GROUP:"FETCH_GROUP",
	GET_BUNDLES:"GET_BUNDLES",
	PICK_BUNDLE:"PICK_BUNDLE",
	SEND_BUNDLE:"SEND_BUNDLE",
	CANCEL_PICKED:"CANCEL_PICKED",
	ACCEPT_PICKED:"ACCEPT_PICKED"
}

export const actions = dispatcher =>
({
	login(user) 
	{
		let obj = 
		{
			type:actionTypes.LOGIN,
			currentUser: user
		}
		dispatcher.handleAction(obj)
	},
	
	moveToBundle()
	{
		let obj = 
		{
			type:actionTypes.MOVE_TO_BUNDLE
		}
		dispatcher.handleAction(obj)
	},

	getMyCourses(arr)
	{
		const obj = 
		{
			type:actionTypes.GET_MY_COURSES,
			myCourses:arr
		}
		dispatcher.handleAction(obj)
	},

	fetchGroup(group)
	{
		const obj = 
		{
			type:actionTypes.FETCH_GROUP,
			group:group
		}
		dispatcher.handleAction(obj)
	},

	getBundles(bundlesArr)
	{
		const obj = 
		{
			type:actionTypes.GET_BUNDLES,
			data:bundlesArr
		}
		dispatcher.handleAction(obj)
	},

	pickBundle(bundleID)
	{
		const obj = 
		{
			type:actionTypes.PICK_BUNDLE,
			data:bundleID
		}
		dispatcher.handleAction(obj)
	},

	sendBundle(resp)
	{
		const obj = 
		{
			type:actionTypes.SEND_BUNDLE,
			data:resp
		}
		dispatcher.handleAction(obj)
	},
	
	cancelPicked()
	{
		const obj=
		{
			type:actionTypes.CANCEL_PICKED
		}
		dispatcher.handleAction(obj)
	},

	acceptPicked()
	{
		const obj=
		{
			type:actionTypes.ACCEPT_PICKED
		}
		dispatcher.handleAction(obj)
	}
})