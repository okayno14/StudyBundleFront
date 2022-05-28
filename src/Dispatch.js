export class Dispatch
{
	constructor()
	{
		this.store = {}
	}
	
	handleAction(action)
	{
		console.log("INFO. DISPATCHER. Dispatching action:", action.type)
		this.dispatch(action)
	}
	
	dispatch(action)
	{
		this.store.dispatch(action)
	}

	setStore(store)
	{
		this.store=store
	}
}