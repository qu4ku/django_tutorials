// 3:02:08

import React, {Component} from 'react'
import cookie from 'react-cookies'
import 'whatwg-fetch'
import moment from 'moment'


class PostCreate extends Component {
	constructor(props){
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleDraftChange = this.handleDraftChange.bind(this)
		this.clearForm = this.clearForm.bind(this)
		// another way to reference things
		this.postTitleRef = React.createRef()

		// giving a default state
		this.state = {
			draft: false,
			title: null,
			content: null,
			publish: null,
		}
	}

	createPost(data) {
		const endpoint = '/api/posts/'
		const csrfToken = cookie.load('csrftoken')
		let thisComp = this
		if (csrfToken !== undefined) {
		  let lookupOptions = {
			method: "POST",
			headers: {
			  'Content-Type': 'application/json',
			  'X-CSRFToken': csrfToken
			},
			body: JSON.stringify(data),
			credentials: 'include',
		  }

		  fetch(endpoint, lookupOptions)
		  .then(function(response){
			return response.json()
		  }).then(function(responseData){
			console.log(responseData)
			if (thisComp.props.newPostItemCreated){
				thisComp.props.newPostItemCreated(responseData)
			}
			thisComp.clearForm()
		  }).catch(function(error){
			console.log("error", error)
			alert("An error occured, please try again later.")
		  })
		}
	  }
	
	handleSubmit(event){
		event.preventDefault()
		// console.log(this.state)
		let data = this.state
		// if (data['draft'] === 'on'){
		// 	data['draft'] = true
		// } else {
		// 	data['draft'] = false
		// }
		//console.log(data)
		this.createPost(data)
	}

	handleInputChange(event){
		event.preventDefault()
		console.log(event.target.name, event.target.value)
		
		// validation
		let key = event.target.name
		let value = event.target.value
		if (key === 'title'){
			if (value.length > 120) {
				alert("this title is too long.")
			}
		}
		this.setState({
			[key]: value
		})
	}

	handleDraftChange(event){
		this.setState({
			draft: !this.state.draft
		})
	}

	clearForm(event){
		if (event) {
			event.preventDefault()
		}
		this.postCreateForm.reset()
	}

	componentDidMount(){
		this.setState({
			draft: false,
			title: null,
			content: null,
			publish: moment(new Date()).format('YYYY-MM-DD'),
		})
		this.postTitleRef.current.focus()
	}
	render(){
		const {publish} = this.state
		return (
			<form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
				<div className='form-group'>
					<label for='title'>Post title</label>
					<input 
						type='text' 
						id='title' 
						name='title' 
						className='form-control' 
						placeholder='Blogpost title' 
						ref = {this.postTitleRef}
						onChange={this.handleInputChange} 
						required='required' />
				</div>
				<div className='form-group'>
					<label for='content'>Content</label>
					<textarea id='content' name='content' className='form-control' placeholder='Blogpost content' onChange={this.handleInputChange} required='required' />
				</div>
				<div className='form-group'>
					<label for='draft'>
					<input 
						type='checkbox' 
						id='draft' 
						name='draft' 
						className='mr-2' 
						value={this.state.draft}
						checked={this.state.draft}
						onChange={this.handleDraftChange} />
					Draft</label>
				</div>
				<div className='form-group'>
					<label for='title'>Post title</label>
					<input 
						type='date'
						id='publish' 
						name='publish' 
						className='form-control' 
						onChange={this.handleInputChange}
						value={publish}
						required='required' />
				</div>
				<button className='btn btn-primary'>Save</button>
				<button className='btn btn-secondary' onClick={this.clearForm}>Clear</button>
			</form>
		)
	}
}

export default PostCreate