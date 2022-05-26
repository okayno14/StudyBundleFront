import {React} from 'react'
import {BundleListSearch} from './search/BundleListSearch'
import {BundleTextSearch} from './search/BundleTextSearch'
import './index.css'

export const Bundle = (props)=>
<div>
	<h1 className='Header'>Редактор Бандлов</h1>
	
	<table>
		<tr>
			<td><BundleListSearch className='Container'/></td>
			<td><div className='Container'>BundleTextSearch_Component</div></td>
		</tr>
		<tr>
			<td><div className='Container'>BundleReport_Component</div></td>
			<td><div className='Container'>BundleACL_Component</div></td>
		</tr>
	</table>
</div>