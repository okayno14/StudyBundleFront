import {Component} from 'react'
import * as API from '../../../../API'

import './index.css'

export class BundleListSearch extends Component
{
	constructor(props)
	{
		super(props)

		this.state = 
		{
			enabled:
			{
				course:false,
				bundleType:false,
				num:false,
				group: false,
				student:false
			},

			hidden:
			{
				course:false,
				bundleType:false,
				num:false,
				group: false,
				student:false
			}
		}

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
		console.log(option.id)
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
						<select name="bundleType" disabled={!this.state.enabled.bundleType}>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="num">Номер</label></tr>
					<tr>
						<select name="num" disabled={!this.state.enabled.num}>
							<option>1</option>
							<option>2</option>
							<option>3</option>
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="group">Группа</label></tr>
					<tr>
						<select name="group" disabled={!this.state.enabled.group}>
							<option>1</option>
							<option>2</option>
							<option>3</option>
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="student">Студент</label></tr>
					<tr>
						<select name="student" disabled={!this.state.enabled.student}>
							<option>1</option>
							<option>2</option>
							<option>3</option>
						</select>
					</tr>
				</table>
					
			</div>
	}
}

