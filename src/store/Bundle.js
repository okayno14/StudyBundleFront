export const BundleState= 
{
	EMPTY:"EMPTY",
	ACCEPTED:"ACCEPTED",
	CANCELED:"CANCELED"
}


export const Bundle  = 
{
	existsACE: (bundle, userID)=>
	{
		const {bundleACLSet} = bundle
		let res =  bundleACLSet.find(ace=>
		{
			return ace.user.id === userID
		})
		return res !==undefined
	},

	changeState: (bundle, state)=>
	{
		let legalStates = Object.keys(BundleState)
		let res = legalStates.find(elem=>elem===state)
	
		if(res!==null)
		{
			return {...bundle, state:res}
		}
		return bundle
	},

}