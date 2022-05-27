export const actionTypes = 
{
	LOGIN:"LOGIN",
	MOVE_TO_BUNDLE:"MOVE_TO_BUNDLE",
	GET_MY_COURSES:"GET_MY_COURSES"
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
	}
})