import {Component} from 'react'
import * as API from '../../../../API'
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
	constructor(props)
	{
		super(props)
	
		const{pickedBundle,bestMatchBundle} = this.props.snapshot

		this.state = 
		{	
			loading:false
		}
	}

	render()
	{
		return (
			<div>
				<div>
					
					<span>
						<StatusText 
						pickedBundle = {this.props.snapshot.pickedBundle} 
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
						<Circle {...this.state.loading}/>
					</span>
					
				</div>
				
				<div>
					<span>
						<StatusText 
						pickedBundle = {this.props.snapshot.bestMatchBundle} 
						name={"Результат операции"}
						defaultText="здесь может быть результат вызванной вами операции"/>
					</span>
				</div>
			</div>
		)
	}
}