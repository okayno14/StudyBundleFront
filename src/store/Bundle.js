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
	}
}