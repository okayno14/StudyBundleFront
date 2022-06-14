export const compare = (a,b)=>
{
	const lastNameA=a.lastName
	const lastNameB=b.lastName
	if(lastNameA>lastNameB)
		{return +1;}
	else if(lastNameA<lastNameB)
		{return -1;}
	else 
		{return 0;}
}