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

	onCourseChange({target})
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
			numArr,
			selected:
			{
				courseSel0ected:courseSelected.id
			}
		})
	}

	onBundleTypeChange({target})
	{
		const order = target.options.selectedIndex
		const option = target.options[order]
		const bundleTypeID = parseInt(option.id)

		if(bundleTypeID === -1)
		{
			return
		}

		let s =
		{
			...this.state.selected,
			bundleTypeSelected:bundleTypeID
		}
		
		this.setState
		({
			selected: s
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

	fillSelectNum()
	{
		const {selected,btArr, numArr} = this.state
		
		let res = [<option id={-1} key={-1}>-</option>]
		
		if(numArr === undefined || selected.bundleTypeSelected === undefined)
		{
			return res
		}
		const {bundleTypeSelected} = selected
		let order = 0;
		while(btArr[order].id !== bundleTypeSelected)
		{
			order++
		}

		for(let i=1;i<=numArr[order];i++)
		{
			res = [...res,<option id={i} key={i}>{i}</option>]
		}

		let {_num} = this.refs
		_num.disabled = false

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
							onChange={(e)=>{this.onCourseChange(e)}} >
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
						ref="_bundleType"
						onChange={(e)=>{this.onBundleTypeChange(e)}}
						>
							{this.fillSelectBT()}
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="num">Номер</label></tr>
					<tr>
						<select name="num"
						disabled={true}
						ref="_num">
							{this.fillSelectNum()}
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

