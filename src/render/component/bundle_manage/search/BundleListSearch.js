import {Component} from 'react'
import * as API from '../../../../API'

import './index.css'

export class BundleListSearch extends Component
{
	constructor(props)
	{
		super(props)
		this.state={}
		this.buildOption= this.fillSelectCourse.bind(this)
	}

	componentDidMount()
	{
		const {currentUser,myCourses} = this.props.state
		Promise.allSettled([API.getCoursesByOwner(currentUser.id),
			API.getCourseByGroup(currentUser.group)]).then((res)=>
			{
				let data = []
				res.map((elem)=>
				{
					let {status, value} = elem
					if(status==="fulfilled")
					{
						data = [...data,...value]
					}
				})
				const {actions} = this.props
				actions.getMyCourses(data)
			})

	}

	fillSelectCourse()
	{
		let res
		const {myCourses} = this.props.state
		if(typeof myCourses !== "undefined")
		{
			res = [...myCourses].map((course)=>
			{
				return <option id={course.id} key={course.id}>{course.name}</option>
			})
		}
		res = [<option id={-1} key={-1}>-</option>].concat(res)
		return res
	}

	fillSelectOther({target})
	{
		const order = target.options.selectedIndex
		var option = target.options[order]
		let courseID = parseInt(option.id)
		if(courseID === -1)
		{
			return
		}
		const {myCourses} = this.props.state
		let courseSelected = myCourses.find(elem=>elem.id === courseID)
		let btArr = []
		let numArr = []

		courseSelected.requirementSet.forEach(element => 
		{
			let {bundleType,quantity} = element
			btArr = [...btArr,bundleType]
			numArr = [...numArr,quantity]
		});

		this.setState
		({
			...this.state,
			btArr,
			numArr
		})
	}

	fillSelectBT()
	{
		const {btArr} = this.state
		let res = [<option id={-1} key={-1}>-</option>]
		
		if(btArr === undefined)
		{
			return res
		}
	
		[...btArr].map((elem)=>
		{
			res = 
			[
				...res,
				<option id ={elem.id} key={elem.id}>{elem.name}</option>
			]	
		})

		let {_bundleType}=this.refs
		_bundleType.disabled = false

		return res
	}

	render()
	{
		return <div>
				
				<table className='Select'>
					<tr><label htmlFor="course">Курсы</label></tr>
					<tr>
						<select 
							name="course" 
							disabled={typeof this.props.state.myCourses ==="undefined"}
							onChange={(e)=>{this.fillSelectOther(e)}} >
								{
									this.fillSelectCourse()
								}
						</select>
					</tr>
				</table>

				<table className='Select'>
					<tr><label htmlFor="bundleType">Тип работы</label></tr>
					<tr>
						<select name="bundleType" 
						disabled={true}
						ref="_bundleType">
							{this.fillSelectBT()}
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="num">Номер</label></tr>
					<tr>
						<select name="num" disabled={true}>
							<option id={-1} key={-1}>-</option>
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="group">Группа</label></tr>
					<tr>
						<select name="group" disabled={true}>
							<option id={-1} key={-1}>-</option>
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="student">Студент</label></tr>
					<tr>
						<select name="student" disabled={true}>
							<option id={-1} key={-1}>-</option>
						</select>
					</tr>
				</table>
					
			</div>
	}
}

