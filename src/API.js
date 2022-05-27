const URI = document.getElementsByName("API")[0].getAttribute("content")

export const login = (body)=>
{
	return new Promise((resolve,reject)=>
	{
		const xhr = new XMLHttpRequest()
		xhr.open('PUT',URI+"/user/login",true)
		
		
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(body))

		xhr.onload=()=>
		{
			let resp = xhr.responseText
			if(xhr.status !== 200)
			{
				reject(Error(resp))
				return
			}
			resolve(JSON.parse(resp).data)
			console.trace(document.cookie)
		}

		xhr.onerror=(err)=>reject(Error(err))
	})	
}

export const getCoursesByOwner = (id) =>
{
	return new Promise((resolve, reject)=>{
		const xhr = new XMLHttpRequest()
		xhr.open('GET', URI+"/course/owner/"+id)

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.withCredentials = true;
		xhr.send()

		xhr.onload=()=>
		{
			let resp = xhr.responseText
			if(xhr.status !== 200)
			{
				reject(Error(resp))
				return
			}
			resolve(JSON.parse(resp).data)
		}

		xhr.onerror=(err)=>reject(Error(err))
	})
}