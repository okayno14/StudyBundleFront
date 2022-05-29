import {Component} from 'react'
import * as API from '../../../../API'
import './index.css'

const Circle = (props)=>
{
	let flag = true
	if(flag)
	{
		return <span className='Loader' hidden={false}/>
	}
	else return null
}

const StatusText = (props)=>
{
	var text
	if(props.pickedBundle===undefined)
	{
		text=props.defaultText
	}
	else
	{
		text = props.pickedBundle.folder
		text = text.replaceAll("/"," ")
	}
	return <span>
		<div>
			<label>{props.name}</label>
		</div>
		<textarea
		className='Status' 
		readOnly={true}
		cols={text.length}
		value = {text}>
		</textarea>
	</span>
	
}


export class BundleStatus extends Component
{
	static getDerivedStateFromProps(props, state)
	{
		const{pickedBundle,bestMatchBundle} = props.snapshot
		return{
			...state,
			pickedBundle:pickedBundle,
			bestMatchBundle:bestMatchBundle
		}
	}
	
	
	constructor(props)
	{
		super(props)
	
		const{pickedBundle,bestMatchBundle} = this.props.snapshot

		this.state = 
		{	
			pickedBundle:undefined,
			bestMatchBundle:undefined
		}
	}

	render()
	{
		return (
			<div>
				<div>
					
					<span>
						<StatusText 
						pickedBundle = {this.state.pickedBundle} 
						name={"Информация"} 
						defaultText="здесь может быть ваш бандл"/>
					</span>
					
					<span>
						<button className="ButtonWithPic">
							<img src='upload.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic">
							<img src='download.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic">
							<img src='cancel.png'></img>
						</button>
					</span>
					<span>
						<button className="ButtonWithPic">
							<img src='check-mark.png'></img>
						</button>
					</span>
					<span>
						<Circle {...this.props}/>
					</span>
					
				</div>
				
				<div>
					<span>
						<StatusText 
						pickedBundle = {this.state.bestMatchBundle} 
						name={"Результат операции"}
						defaultText="здесь может быть результат вызванной вами операции"/>
					</span>
				</div>
			</div>
		)
	}
}