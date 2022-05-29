import {Component} from 'react'
import * as API from '../../../../API'
import {Course} from '../../../../store/Course'
import { Bundle } from '../../../../store/Bundle'
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
	var text
	const{bundle}=props
	if(bundle===undefined)
	{
		text=props.defaultText
	}
	else
	{
		text = bundle.folder
		text = text.replaceAll("/"," ")
		
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
	}

	isUploadEnabled()
	{
		const{pickedBundle, currentUser, myCourses} = this.props.snapshot
		
		if(pickedBundle===undefined)
		{
			return false
		}
		
		let f = Bundle.existsACE(pickedBundle,currentUser)
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

		let f = Bundle.existsACE(pickedBundle,currentUser)
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
						<button className="ButtonWithPic" disabled={!this.isUploadEnabled()}>
							<img src='upload.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic" disabled={!this.isDownloadEnabled()}>
							<img src='download.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic" disabled={!this.isCancelEnabled()}>
							<img src='cancel.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic" disabled={!this.isAcceptEnabled()}>
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