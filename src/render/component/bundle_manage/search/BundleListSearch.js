import {Component} from 'react'
import * as API from '../../../../API'

import './index.css'

export class BundleListSearch extends Component
{
	constructor(props)
	{
		super(props)
		this.state=
		{
			btArr:[],
			numArr:[],
			groupArr:[],
			userArr:[],
			selected:
			{
				courseSelected:undefined,
				bundleTypeSelected:undefined,
				numSelected:undefined,
				groupSelected:undefined,
				studentSelected:undefined
			}
		}
	}

	componentDidMount()
	{
		console.log("TRACE. BundleListSearch. Component Mounted")
		
		const {currentUser,myCourses} = this.props.snapshot

		if(myCourses !== undefined && myCourses.length!==0)
		{
			return
		}
		
		if(currentUser.group !== undefined)
		{
			Promise.allSettled([API.getCoursesByOwner(currentUser.id),
				API.getCourseByGroup(currentUser.group.id)]).then((res)=>
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
		else
		{
			API.getCoursesByOwner(currentUser.id).then((res)=>
			{
				const {actions} = this.props
				actions.getMyCourses(res)
			})
		}
	}

	onCourseChange({target})
	{
		const order = target.options.selectedIndex
		var option = target.options[order]
		let courseID = parseInt(option.id)

		const {selected} = this.state

		let btArr = []
		let numArr = []
		let groupArr = []
		
		if(courseID !== -1)
		{
			const {myCourses} = this.props.snapshot
			let courseSelected = myCourses.find(elem=>elem.id === courseID)
			
			courseSelected.requirementSet.forEach(element => 
			{
				let {bundleType,quantity} = element
				btArr = [...btArr,bundleType]
				numArr = [...numArr,quantity]
			});

			courseSelected.groupes.forEach(element=>
			{
				groupArr = [...groupArr,element]
			})
		}
		
		this.setState
		({
			...this.snapshot,
			btArr,
			numArr,
			groupArr,
			selected:
			{
				...selected,
				courseSelected:courseID
			}
		})
	}

	onBundleTypeChange({target})
	{
		const order = target.options.selectedIndex
		const option = target.options[order]
		const bundleTypeID = parseInt(option.id)

		const {selected} = this.state
		
		this.setState
		({
			...this.state,
			selected:
			{
				...selected,
				bundleTypeSelected:bundleTypeID
			}
		})
	}

	onNumChage({target})
	{
		const q = target.options.selectedIndex
		let numID = q
		
		const {selected} = this.state
		
		if(q === 0)
		{
			numID = -1
		}

		this.setState
		({
			...this.state,
			selected:
			{
				...selected,
				numSelected:numID
			}
		})
	}

	onGroupChange({target})
	{
		const order = target.options.selectedIndex
		const option = target.options[order]
		const groupID = parseInt(option.id)
		let userArr = []
		let stateDiff = 
		{
			...this.state,
			userArr:userArr,
			selected:
			{
				...this.state.selected,
				groupSelected:groupID
			}
		}
		const {selected,groupArr} = this.state
		const courseID = selected.courseSelected
		const {snapshot,actions} = this.props
		const {myCourses,currentUser,groupsFetched} = snapshot
		const course = myCourses.find(elem=>elem.id = courseID)
		
		if(groupID ===-1)
		{
			this.setState(stateDiff)
			return
		}
		
		let search = course.courseACL_Set.reduce((contains,cur)=>
		{
			const{user} = cur
			return contains || (user.id === currentUser.id)
		},false)
		
		console.log("INFO. BundleListSearch.onGroupChange. Is currentUser in courseACL = "+search)
		
		if(!search)
		{
			stateDiff.userArr = [currentUser]
			this.setState(stateDiff)
			return	
		}
		
		let snapshotGroup={}
		if(groupsFetched!==undefined && groupsFetched.length !== 0)
		{
			snapshotGroup = groupsFetched.find(group=>group.id===groupID)
			userArr= snapshotGroup.students
		}
		if(userArr !== undefined && userArr.length !== 0)
		{
			console.log("INFO. BundleListSearch.onGroupChange. Group contains in Storage")	
			stateDiff.userArr = userArr
			this.setState(stateDiff)
			return
		}
				
		console.log("INFO. BundleListSearch.onGroupChange. Group not fetched")
		let p = API.getGroupStudents(groupID)
		p.then((students)=>
		{
			console.log("INFO. BundleListSearch.onGroupChange. Received students from API")
			let group = groupArr.find(elem=>elem.id===groupID)
			stateDiff.userArr=students;
			this.setState(stateDiff)
			actions.fetchGroup({...group,students})
		})
	}

	onStudentChanged({target})
	{
		const order = target.options.selectedIndex
		const option = target.options[order]
		const studentID = parseInt(option.id)

		const {selected} = this.state
		
		this.setState
		({
			...this.state,
			selected:
			{
				...selected,
				studentSelected: studentID
			}
		})
	}

	findAction(e)
	{
		const{selected} = this.state
		const{actions} = this.props
		console.log("INFO. BundleListSearch. findAction. User picked:\n"+JSON.stringify(selected))
		API.getBundles(selected.courseSelected,selected.studentSelected).then
		(bundleArr=>
		{
			console.log("INFO. BundleListSearch. findAction. Received from API "+ bundleArr.length+" elements")
			console.log("TRACE. BundleListSearch. findAction. Extracted values:")
			bundleArr.forEach((bundle)=>
			{
				console.log(JSON.stringify(bundle))
			})
			actions.getBundles(bundleArr)
		})
	}
	
	fillSelectCourse()
	{
		let res=[<option id={-1} key={-1}>-</option>]
		const {myCourses} = this.props.snapshot
		if(myCourses !== undefined)
		{
			[...myCourses].map((course)=>
			{
				res = 
				[
					...res,
					<option id={course.id} key={course.id}>{course.name}</option>
				]
			})
		}
		return res
	}

	fillSelectBT()
	{
		const {btArr} = this.state
		let res = [<option id={-1} key={-1}>-</option>]
		
		if(btArr === undefined || btArr.length===0)
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
		
		if(numArr === undefined || numArr.length ===0 || 
			selected.bundleTypeSelected === undefined)
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

	
	fillSelectGroup()
	{
		const {groupArr} = this.state
		let res = [<option id={-1} key={-1}>-</option>]
		if(groupArr === undefined || groupArr.length===0)
		{
			return res
		}

		[...groupArr].map((elem)=>
		{
			res = 
			[
				...res,
				<option id={elem.id} key={elem.id}>{elem.name}</option>
			]
		})

		let{_group}= this.refs
		_group.disabled=false

		return res
	}

	fillSelectStudent()
	{
		const{userArr} = this.state
		let res = [<option id={-1} key={-1}>-</option>]
		if(userArr === undefined || userArr.length ===0)
		{
			return res
		}

		[...userArr].map((elem)=>
		{
			res = 
			[
				...res,
				<option id={elem.id} key={elem.id}>
					{elem.lastName + " "+ elem.firstName.charAt(0)+elem.fatherName.charAt(0)}
				</option>
			]
		})

		let{_student} = this.refs
		_student.disabled=false

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
							disabled={this.props.snapshot.myCourses === undefined}
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
						ref="_num"
						onChange={(e)=> this.onNumChage(e)}>
							{this.fillSelectNum()}
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="group">Группа</label></tr>
					<tr>
						<select 
						name="group" 
						disabled={true} 
						ref="_group"
						onChange={(e)=>{this.onGroupChange(e)}}>
							{this.fillSelectGroup()}
						</select>
					</tr>
				</table>
				
				<table className='Select'>
					<tr><label htmlFor="student">Студент</label></tr>
					<tr>
						<select 
						name="student" 
						disabled={true}
						ref="_student"
						onChange={(e)=>{this.onStudentChanged(e)}}>
							{this.fillSelectStudent()}
						</select>
					</tr>
				</table>
				<button onClick={(e)=>{this.findAction(e)}}>
					Найти
				</button>
			</div>
	}
}

