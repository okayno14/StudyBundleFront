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
	}
}