export const actionTypes = 
{
	LOGIN:"LOGIN"
}

export const actions = dispatcher =>
({
	login(username, pass) 
	{
		let obj = 
		{
			type:actionTypes.LOGIN,
			username,
			pass
		}
		dispatcher.handleAction(obj)
	}
})