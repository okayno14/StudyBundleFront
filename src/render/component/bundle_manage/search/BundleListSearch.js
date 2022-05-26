import {React} from 'react'
import './index.css'

export class BundleListSearch extends React.Component
{
	constructor(props)
	{
		super(props)
	}

	render()
	{
		return <div>
			
			<table className='Select'>
				<tr><label htmlFor="course">Курсы</label></tr>
				<tr>
					<select name="course">
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</tr>
			</table>

			<table className='Select'>
				<tr><label htmlFor="bundleType">Тип работы</label></tr>
				<tr>
					<select name="bundleType">
					<option>1</option>
					<option>2</option>
					<option>3</option>
					</select>
				</tr>
			</table>
			
			<table className='Select'>
				<tr><label htmlFor="num">Номер</label></tr>
				<tr>
					<select name="num">
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</tr>
			</table>
			
			<table className='Select'>
				<tr><label htmlFor="group">Группа</label></tr>
				<tr>
					<select name="group">
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</tr>
			</table>
			
			<table className='Select'>
				<tr><label hrmlFor="student">Студент</label></tr>
				<tr>
					<select name="student">
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</tr>
			</table>
				
		</div>
	}
}

