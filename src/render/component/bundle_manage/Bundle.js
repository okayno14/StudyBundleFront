import {React} from 'react'
import {BundleListSearch} from './search/BundleListSearch'
import {BundleTextSearch} from './search/BundleTextSearch'
import { BundleStatus } from './details/BundleStatus'

export const Bundle = (props)=>
<div>
	<h1 className='Header'>Редактор Бандлов</h1>
	
	<table>
		<tr>
			<td><BundleListSearch className='Container' {...props}/></td>
			<td><div className='Container' hidden={true}>BundleTextSearch_Component</div></td>
		</tr>
		<tr>
			<td> <BundleStatus {...props}/> </td>
			<td><div className='Container' hidden={true}>BundleACL_Component</div></td>
		</tr>
	</table>
</div>