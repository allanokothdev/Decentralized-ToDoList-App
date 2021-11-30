App = {
	loading: false,
	contracts: {},
	load: async () => {
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

	loadWeb3: async () => {
		if (typeof window.ethereum !== 'undefined') {
			// connects to MetaMask
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			console.log(accounts)


		} else {
			// tell the user to install an `ethereum` provider extension
		}

		},

	loadAccount: async () => {
		const account = await ethereum.request({ method: 'eth_requestAccounts' });
		console.log(account[0])
	},

	loadContract: async () => {
		var contract = required("truffle-contract");
	 // Create a JavaScript version of the smart contract
	 const todoList = await $.getJSON('TodoList.json')
	 App.contracts.TodoList = contract(todoList)
	 App.contracts.TodoList.setProvider(App.web3Provider)

	 // Hydrate the smart contract with values from the blockchain
	 App.todoList = await App.contracts.TodoList.deployed()
 },

	render: async () => {
		//prevent double rendering
		if(App.loading){
			return
		}

		//Update loading status
		App.setLoading(true)

		//Render Account
		$('#Account').html(App.account)

		//Updating loading this.state
		App.setLoading(false)
	},

	renderTasks: async () => {
		//load taks from the blockchain
		const taskCount = await todoList.taskCount()
		const $taskTemplate = $('.taskTemplate')

		//Render each out task with a new task taskTemplate
		for(var i = 1; i <= taskCount; i++){
			//fetch the task data from the blockchain
			const task = await App.todoList.tasks(i)
			const taskId = tasks[0].toNumber()
			const taskContent = task[1]
			const taskCompleted = task[2]

			// Create the html for the task
		const $newTaskTemplate = $taskTemplate.clone()
		$newTaskTemplate.find('.content').html(taskContent)
		$newTaskTemplate.find('input')
										.prop('name', taskId)
										.prop('checked', taskCompleted)
										.on('click', App.toggleCompleted)
		}

		// Put the task in the correct list
		 if (taskCompleted) {
			 $('#completedTaskList').append($newTaskTemplate)
		 } else {
			 $('#taskList').append($newTaskTemplate)
		 }

		 // Show the task
		 $newTaskTemplate.show()

	},

	createTask: async () => {
	 App.setLoading(true)
	 const content = $('#newTask').val()
	 await App.todoList.createTask(content)
	 window.location.reload()
 },

 toggleCompleted: async (e) => {
	 App.setLoading(true)
	 const taskId = e.target.name
	 await App.todoList.toggleCompleted(taskId)
	 window.location.reload()
 },

	setLoading: (boolean) => {
		App.loading = boolean
		const loader = $('#loader')
		const content = $('#content')
		if(boolean){
			loader.show()
			content.show()
		}else{
			loader.hide()
			content.show()
		}
	}
}


$(() => {
	$(window).load(() => {
		App.load()
	})
})
