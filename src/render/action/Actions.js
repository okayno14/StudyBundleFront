export const actionTypes = 
{
	LOGIN:"LOGIN"
}

export const actions = dispatcher =>
({
	login(user) 
	{
		let obj = 
		{
			type:actionTypes.LOGIN,
			currentuser: user
		}
		dispatcher.handleAction(obj)
	}
})