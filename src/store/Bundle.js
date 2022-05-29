export const Bundle  = 
{
	existsACE: (bundle, user)=>
	{
		const {bundleACLSet} = bundle
		let res =  bundleACLSet.find(ace=>
		{
			return ace.user.id === user.id
		})
		return res !==undefined
	}
}