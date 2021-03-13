(function () {
	let todoName = "";
	// создаем и возвращаем заголовок приложения
	function createAppTitle(title) {
		let appTitle = document.createElement("h2");
		appTitle.innerHTML = title;
		return appTitle;
	}

	// создаем и возвращаем форму для создания дела
	function createTodoItemForm() {
		let form = document.createElement("form");
		let input = document.createElement("input");
		let buttonWrapper = document.createElement("div");
		let button = document.createElement("button");

		form.classList.add("input-group", "mb-3");
		input.classList.add("form-control");
		input.placeholder = "Введите название нового дела";
		buttonWrapper.classList.add("input-group-append");
		button.type = "submit";
		button.classList.add("btn", "btn-primary");
		button.textContent = "Добавить дело";

		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		input.addEventListener("input", function (e) {
			// console.log(e.target.value);
			if (e.target.value === "") {
				button.disabled = true;
			} else {
				button.disabled = false;
			}
		});

		return {
			form,
			input,
			button,
		};
	}

	//  создаем и возвращаем список элементов
	function createTodoList(items) {
		let list = document.createElement("ul");
		list.classList.add("list-group");
		for (let i = 0; i < items.length; i++) {
			let todoItem = createTodoItem(items[i]);
			list.append(todoItem.item);
		}

		return list;
	}

	function createTodoItem(todo) {
		let item = document.createElement("li");
		// кнопки помещаем в элемент,который красиво покажет их в одной группе
		let buttonGroup = document.createElement("div");
		let doneButton = document.createElement("button");
		let deleteButton = document.createElement("button");

		// устанавливаем стили для элемента списка,а также для размещения кнопок
		// в его правой части с помощью flex
		item.classList.add(
			"list-group-item",
			"d-flex",
			"justify-content-between",
			"alidn-items-center"
		);
		item.textContent = todo.name;
		item.dataset.id = todo.id;

		if (todo.done) {
			item.classList.add("list-group-item-success");
		}
		buttonGroup.classList.add("btn-group", "btn-group-sm");
		doneButton.classList.add("btn", "btn-success");
		doneButton.textContent = "Готово";
		deleteButton.classList.add("btn-danger");
		deleteButton.textContent = "Удалить";
		// Вкладываем кнопки в отдельный элемент,что бы они объединились в один блок
		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		// добавлем обработчики на кнопки

		doneButton.addEventListener("click", function () {
			item.classList.toggle("list-group-item-success");
			let items = getItemsData();
			let oneItem = items.find((elem) => elem.id === todo.id);
			let index = items.indexOf(oneItem);
			if (items[index].done === true) {
				items[index].done = false;
			} else {
				items[index].done = true;
			}
				saveInStorage(items);
		});

		deleteButton.addEventListener("click", function () {
			console.log(item.dataset.id);
			if (confirm("Вы уверены?")) {
				let items = getItemsData();
				items = items.filter((elem) => elem.id != item.dataset.id);
				item.remove();
				saveInStorage(items);
			}
		});

		// приложению нужен доступ к самому элементу и кнопкам,что бы обрабатывать события нажатия
		return {
			item,
			doneButton,
			deleteButton,
		};
	}

	function createTodoApp(container, title = "Список дел", items = []) {
		todoName = title;
		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		items = getItemsData();
		let todoList = createTodoList(items);

		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

		todoItemForm.button.disabled = true;

		// браузер создает событие submit на форме по нажатию на Еnter или на кнопку создания дела
		todoItemForm.form.addEventListener("submit", function (e) {
			e.preventDefault();

			todoItemForm.button.disabled = true;

			// игнорируем создание элементв,если пользователь ничегo не ввел в поле
			if (!todoItemForm.input.value) {
				return;
			}

			let data = {
				id: new Date().getTime(),
				name: todoItemForm.input.value,
				done: false,
			};
			let todoItem = createTodoItem(data);

			items = getItemsData();
			items.push(data);
			saveInStorage(items);

			// создаем и добавляем в список новое дело с названием из поля для ввода
			todoList.append(todoItem.item);

			// обнуляем значение в поле,что бы не пришлось сtирать его вручную
			todoItemForm.input.value = "";
		});
	}

	function saveInStorage(items) {
		localStorage.setItem(todoName, JSON.stringify(items));
	}

	function getItemsData() {
		let items = JSON.parse(localStorage.getItem(todoName));
		if (!items) items = [];

		return items;
	}

	window.createTodoApp = createTodoApp;
})();

