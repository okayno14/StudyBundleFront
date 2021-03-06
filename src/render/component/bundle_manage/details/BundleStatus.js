import {Component, createRef} from 'react'
import * as API from '../../../../API'
import {Course} from '../../../../store/Course'
import { Bundle, BundleState } from '../../../../store/Bundle'
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
		f = f && pickedBundle.state !== BundleState.ACCEPTED 
				
		return f
	}

	isBundleDownloadable(bundle)
	{
		const{currentUser, myCourses} = this.props.snapshot

		if(bundle===undefined)
		{
			return false
		}

		let f = Bundle.existsACE(bundle,currentUser.id)
		let course = myCourses.find(elem=>elem.id === bundle.courseID)
		f = f || Course.existsACE(course,currentUser) 
		f = f && bundle.state !== BundleState.EMPTY
		return f
	}
	
	isPickedDownloadable()
	{
		return this.isBundleDownloadable(this.props.snapshot.pickedBundle)
	}

	isBestMatchDownloadable()
	{
		return this.isBundleDownloadable(this.props.snapshot.bestMatchBundle)
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
		f = f && pickedBundle.state === BundleState.ACCEPTED
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
		f = f && pickedBundle.state == BundleState.CANCELED
		return f
	}

	isEmptifyEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot

		if(pickedBundle===undefined)
		{
			return false
		}

		let course = myCourses.find(elem=>elem.id === pickedBundle.courseID)
		let f = Course.existsACE(course,currentUser) 
		f = f && pickedBundle.state !== BundleState.EMPTY
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

	downloadBundle(bundle)
	{
		console.log("TRACE. BundleStratus. downloadHandler. User requested bundle.id="+bundle.id)
		if(bundle!==undefined)
		{
			API.downloadBundle(bundle.id)
		}
	}
	
	downloadPickedHandler()
	{
		this.downloadBundle(this.props.snapshot.pickedBundle)
	}

	downloadBestMatchHandler()
	{
		this.downloadBundle(this.props.snapshot.bestMatchBundle)
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

	emptifyHandler()
	{
		const {pickedBundle} = this.props.snapshot
		const {actions} = this.props
		if(pickedBundle!==undefined)
		{
			console.log("TRACE. BundleStatus. emptifyHandler. User cleaned manually bundle.id="+pickedBundle.id)
			let p = API.eptifyBundle(pickedBundle.id)
			p.then(res=>
			{
				actions.emptifyPicked()
			})
			p.catch(reason=>
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
						<Circle {...this.state}/>
					</span>
					<span>
						<button
						className="ButtonWithPic"
						disabled={!this.isPickedDownloadable()}
						onClick={()=>{this.downloadPickedHandler()}}>
							<img src='download.png'></img>
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
						<button 
						className="ButtonWithPic"
						disabled={!this.isCancelEnabled()}
						onClick={()=>{this.cancelHandler()}}>
							<img src='cancel.png'></img>
						</button>
					</span>
					<span>
						<button 
						className='ButtonWithPic'
						disabled={!this.isEmptifyEnabled()}
						onClick={()=>{this.emptifyHandler()}}>
							<img src='trash-can.png'></img>
						</button>
					</span>
					
				</div>
				
				<div>
					<span>
						<StatusText 
						bundle = {this.props.snapshot.bestMatchBundle} 
						name={"Результат операции"}
						defaultText="здесь может быть результат вызванной вами операции"/>
					</span>
					<span>
						<button 
						className='ButtonWithPic'
						disabled={!this.isBestMatchDownloadable()}
						onClick={()=>{this.downloadBestMatchHandler()}}>
							<img src="download.png"/>
						</button>
					</span>
				</div>
			</div>
		)
	}
}