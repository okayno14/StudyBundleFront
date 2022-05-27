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
		const {currentUser} = this.props.state
		API.getCoursesByOwner(currentUser.id).then((result)=>
		{
			const {actions} = this.props
			actions.getMyCourses(result)
		})
	}

	fillSelectCourse()
	{
		let res
		const {myCourses} = this.props.state
		if(typeof myCourses !== "undefined")
		{
			this.setState(
				{enabled:
					{
						course:true,
						bundleType:false,
						num:false,
						group: false,
						student:false
					}
				})
			res = [...myCourses].map((course)=>
			{
				return <option key={course.id}>{course.name}</option>
			})
		}
		return res
	}


	render()
	{
		return <div>
				
				<table className='Select'>
					<tr><label htmlFor="course">Курсы</label></tr>
					<tr>
						<select name="course" disabled={!this.state.enabled.course}>
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
					<tr><label hrmlFor="student">Студент</label></tr>
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

