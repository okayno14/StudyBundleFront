import {React} from 'react'

export const Choice = (props)=>
<div>
	<h1>Выбор меню</h1>
	<button onClick={()=>
		{	
			const {actions} = props
			actions.moveToBundle()
		}}>
		Бандлы
	</button>
	<button>Курсы</button>
	<button>Пользователи</button>
</div>
