export class Dispatch
{
	constructor()
	{
		this.store = {}
	}
	
	handleAction(action)
	{
		console.log('dispatching action:', action.type)
		this.dispatch(action)
	}
	
	dispatch(action)
	{
		this.store.dispath(action)
	}

	setSlot(store)
	{
		this.store=store
	}
}