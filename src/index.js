import reportWebVitals from './reportWebVitals'
import {Dispatch} from './Dispatch'
import {actions} from './render/action/Actions'
import {Render} from './render/Render'
import {Store} from './store/Store'


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()


const dispatcher = new Dispatch()
const actions_ = actions(dispatcher)
const render = new Render(actions_)
const store = new Store(render)
dispatcher.setStore(store)

render.start(store.getState())