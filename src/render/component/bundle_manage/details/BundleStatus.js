import {Component, createRef} from 'react'
import * as API from '../../../../API'
import {Course} from '../../../../store/Course'
import { Bundle } from '../../../../store/Bundle'
import * as JSZip from 'jszip/dist/jszip';

import './index.css'

const Circle = (props)=>
{
	if(props.loading)
	{
		return <span className='Loader' hidden={false}/>
	}
	else return null
}

const StatusText = (props)=>
{
	var text=""
	const{bundle}=props
	if(bundle===undefined)
	{
		text=props.defaultText
	}
	else
	{
		if(bundle.id !== -1)
		{
			text = bundle.folder
			text = text.replaceAll("/"," ")
		}
		if(bundle.percent !== undefined)
		{
			text = text + " Сходство = "+bundle.percent+"%"
		}
		
		if(bundle.id !== -1)
		{
			switch (bundle.state)
			{
				case "ACCEPTED": 
					text = text + " ✔️"
					break
				case "EMPTY":
					text = text + " 📝"
					break
				case "CANCELED":
					text = text + " ⛔"
					break
			}
		}
	}
	return <span>
		<div>
			<label>{props.name}</label>
		</div>
		<textarea
		className='Status' 
		readOnly={true}
		cols={text.length}
		value = {text}
		background-color="grey">
		</textarea>
	</span>
	
}


export class BundleStatus extends Component
{
	constructor(props)
	{
		super(props)
	
		const{pickedBundle,bestMatchBundle} = this.props.snapshot

		this.state = 
		{	
			loading:false,
			test:1
		}

		this.uploadRef = createRef()
	}

	isUploadEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot
		
		if(pickedBundle===undefined)
		{
			return false
		}
		
		let f = Bundle.existsACE(pickedBundle,currentUser.id)
		let course = myCourses.find(elem=>elem.id === pickedBundle.courseID)
		f = f || Course.existsACE(course,currentUser) 
		f = f && pickedBundle.state !== "ACCEPTED" 
				
		return f
	}

	isDownloadEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot

		if(pickedBundle===undefined)
		{
			return false
		}

		let f = Bundle.existsACE(pickedBundle,currentUser.id)
		let course = myCourses.find(elem=>elem.id === pickedBundle.courseID)
		f = f || Course.existsACE(course,currentUser) 
		f = f && pickedBundle.state !== "EMPTY"
		return f
	}

	isCancelEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot

		if(pickedBundle===undefined)
		{
			return false
		}

		let course = myCourses.find(elem=>elem.id === pickedBundle.courseID)
		let f = Course.existsACE(course,currentUser) 
		f = f && pickedBundle.state == "ACCEPTED"
		return f
	}

	isAcceptEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot

		if(pickedBundle===undefined)
		{
			return false
		}

		let course = myCourses.find(elem=>elem.id === pickedBundle.courseID)
		let f = Course.existsACE(course,currentUser) 
		f = f && pickedBundle.state == "CANCELED"
		return f
	}

	uploadHandler({target})
	{
		const {files} = target
		const {pickedBundle} = this.props.snapshot
		let zipFile = new JSZip().folder("src")
		
		console.log("INFO.BundleStatus.uploadHandler. User picked bundle.id = "+pickedBundle.id)

		for(let i=0;i<files.length;i++)
		{
			let file =files[i]
			let path = "src/"
			let format = file.name.match(".[a-z]+$")[0]
			if(format === ".doc" || format === ".docx")
			{
				path=""
			}

			zipFile.file(path+files[i].name,files[i]) 
		}
		
		this.setState({loading:true})
		
		zipFile.generateAsync({type:"blob"}).then(
		blob=>
		{
			console.log("INFO.BundleStatus.uploadHandler. Bundle packed. Sending it to API.")
			let p = API.sendBundle(blob,pickedBundle.id)
			p.then((result)=>
			{
				console.log("INFO.BundleStatus.uploadHandler.Received answer from API")
				this.setState({loading:false})
				this.props.actions.sendBundle(result)
				this.resetUpload()
			})
			p.catch((err)=>
			{
				this.setState({loading:false})
				this.resetUpload()
			})
		},
		(err)=>
		{
			this.resetUpload()
		})

	}

	resetUpload()
	{
		this.uploadRef.current.value=""
	}

	downloadHandler()
	{
		const {pickedBundle} = this.props.snapshot
		console.log("TRACE. BundleStratus. downloadHandler. User requested bundle.id="+pickedBundle.id)
		if(pickedBundle!==undefined)
		{
			API.downloadBundle(pickedBundle.id)
		}
	}

	cancelHandler()
	{
		const {pickedBundle} = this.props.snapshot
		if(pickedBundle!==undefined)
		{
			console.log("TRACE. BundleStatus. cancelHandler. User cancelled manually bundle.id="+pickedBundle.id)
			let p = API.cancelBundle(pickedBundle.id)
			p.then((res)=>
			{
				this.props.actions.cancelPicked()	
			})
			p.catch((reason)=>
			{
				console.log("ERROR. BundleStatus. cancelHandler. Server denied request")
			})
		}
	}

	acceptHandler()
	{
		const {pickedBundle} = this.props.snapshot
		const {actions} = this.props
		if(pickedBundle!==undefined)
		{
			console.log("TRACE. BundleStatus. acceptHandler. User accepted manually bundle.id="+pickedBundle.id)
			let p = API.acceptBundle(pickedBundle.id)
			p.then((res)=>
			{
				actions.acceptPicked()
			})
			p.catch((reason)=>
			{
				console.log("ERROR. BundleStatus. acceptHandler. Server denied request")
			})
		}
	}

	render()
	{
		return (
			<div>
				<div>
					
					<span>
						<StatusText 
						bundle = {this.props.snapshot.pickedBundle} 
						name={"Информация"} 
						defaultText="здесь может быть ваш бандл"/>
					</span>
					
					<span>
						<input
						className="ButtonWithPic" 
						type="file" 
						name="file"
						multiple={true}
						disabled={!this.isUploadEnabled()}
						onChange = {(e)=>{this.uploadHandler(e)}}
						ref={this.uploadRef}>
						</input>
					</span>
					<span>
						<button
						className="ButtonWithPic"
						disabled={!this.isDownloadEnabled()}
						onClick={()=>{this.downloadHandler()}}>
							<img src='download.png'></img>
						</button>
					</span>
					<span>
						<button 
						className="ButtonWithPic"
						disabled={!this.isCancelEnabled()}
						onClick={()=>{this.cancelHandler()}}
						>
							<img src='cancel.png'></img>
						</button>
					</span>
					<span>
						<button 
						className="ButtonWithPic" 
						disabled={!this.isAcceptEnabled()}
						onClick={()=>{this.acceptHandler()}}>
							<img src='check-mark.png'></img>
						</button>
					</span>
					<span>
						<Circle {...this.state}/>
					</span>
					
				</div>
				
				<div>
					<span>
						<StatusText 
						bundle = {this.props.snapshot.bestMatchBundle} 
						name={"Результат операции"}
						defaultText="здесь может быть результат вызванной вами операции"/>
					</span>
				</div>
			</div>
		)
	}
}