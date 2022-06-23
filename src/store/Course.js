export const Course =
{
	existsACE: (course, user)=>
	{
		const {courseACL_Set} = course
		let res =  courseACL_Set.find(ace=>
		{
			return ace.user.id === user.id
		})
		return res !==undefined
	},
	compare: (a,b)=>
	{
		if(a.name>b.name)
			{return +1;}
		else if(a.name<b.name)
			{return -1;}
		else 
			{return 0;}
	}
}