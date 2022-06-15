import { saveAs } from 'file-saver'
let href
if(window.location.port==="3000")
{
	href = document.getElementsByName("API")[0].getAttribute("content")
}
else
{
	href = window.location.href.substring(0,window.location.href.length-1)
}
const URI = href
console.log(URI)


const ajax = (method, func, resolve, reject, body, isJSON=true)=>
{
	const xhr = new XMLHttpRequest()
	xhr.open(method, func)
	if(isJSON)
	{
		xhr.setRequestHeader('Content-Type', 'application/json');
	}
	xhr.withCredentials = true;
	
	if(body!==null)
	{
		xhr.send(body)
	}
	else
	{
		xhr.send()
	}
	
	xhr.onload=()=>
	{
		if(xhr.status !== 200)
		{
			reject(Error(xhr.statusText))
			return
		}
		resolve(JSON.parse(xhr.responseText).data)
	}
	xhr.onerror=(err)=>reject(Error(err))
}

export const login = (body)=>
{
	return new Promise((resolve,reject)=>
	{
		ajax("PUT",URI+"/user/login",resolve, reject,JSON.stringify(body))
	})
}

export const logout = () =>{return 1+1}

export const me = () =>
{
	return new Promise((resolve,reject)=>
	{
		ajax("GET", URI+"/user/me", resolve,reject)
	})
}

export const getCoursesByOwner = (id) =>
{
	return new Promise((resolve,reject)=>
	{
		ajax("GET",URI+"/course/owner/"+id,resolve,reject)
	})
}

export const getCourseByGroup = (id) =>
{
	return new Promise((resolve,reject)=>
	{
		ajax("GET", URI+"/course/group"+id, resolve,reject)
	})
}

export const getGroupStudents = (id) =>
{
	return new Promise((resolve,reject)=>
	{
		ajax("GET", URI+"/user/group/students/"+id, resolve, reject)
	})
}

export const getBundles = (courseID, userID) =>
{
	let req =URI+"/bundle/"+courseID+"/"+userID
	console.log("INFO. API. getBundles. Request:"+req)
	return new Promise((resolve,reject)=>
	{
		ajax("GET", req, resolve, reject)
	})
}

export const sendBundle = (zip, id) =>
{
	return new Promise((resolve, reject)=>
	{
		let body = new FormData()
		body.append("uploaded_bundle",zip)
		ajax("POST", URI+"/bundle/upload/"+id,resolve,reject,body,false)
	})
}

export const downloadBundle = (id) =>
{
	let req = URI+"/bundle/download/"+id
	const dummy = document.createElement('a');
	dummy.href = req;
	document.body.appendChild(dummy);
	dummy.click();
	dummy.remove()
}

export const cancelBundle = (id) =>
{
	let req = URI+"/bundle/cancel/"+id
	return new Promise((resolve,reject)=>
	{
		ajax("PUT",req,resolve,reject)
	})
}

export const acceptBundle = (id)=>
{
	let req = URI+"/bundle/accept/"+id
	return new Promise((resolve,reject)=>
	{
		ajax("PUT",req,resolve,reject)
	})
}

export const eptifyBundle = (id)=>
{
	let req = URI+"/bundle/"+id
	return new Promise((resolve,reject)=>
	{
		ajax("DELETE", req,resolve,reject)
	})
}