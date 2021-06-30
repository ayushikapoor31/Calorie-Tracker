// storage controler
const StorageCtrl = (function () {
    //pubic methods
    return {
        storeItem: function (item) {
            let items;
            //check if ay items in ls
            if (localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                //reset local storage
                localStorage.setItem('items', JSON.stringify(items));
            }

        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemsStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }

            });
            localStorage.setItem('items', JSON.stringify(items));
        }, deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }

            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();
///item controller
const ItemCtrl = (function () {
    //item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //data structure/state

    const data = {
        // items: [
        //     // { id: 0, name: `Steak dinner`, calories: 1200 },
        //     // { id: 1, name: `cookie`, calories: 400 },
        //     // { id: 2, name: `eggs`, calories: 300 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    //public methods
    return {

        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            //create ID
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //calories to number
            calories = parseInt(calories);
            // create new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;

        },
        getItemById: function (id) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;

        },
        updateItem: function (name, calories) {
            //calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;

        },
        deleteItem: function (id) {
            //get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });
            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;

            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }

})();

//Ui controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: `#item-list`,
        listItems: `#item-list li`,
        addBtn: `.add-btn`,
        updateBtn: `.update-btn`,
        deleteBtn: `.delete-btn`,
        backBtn: `.back-btn`,
        clearBtn: `.clear-btn`,
        itemName: `#item-name`,
        itemCaloriesInput: `#item-calories`,
        totalCalories: `.total-calories`

    }
    // public methods
    return {

        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
    <strong>${item.name} :</strong><em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
        <i class=" edit-item fa fa-pencil"></i>
    </a>
</li>`;

            });

            //insert list item 
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }

        },
        addListItem: function (item) {
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = ` <strong>${item.name} :</strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class=" edit-item fa fa-pencil"></i>
            </a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = ` <strong>${item.name} :</strong><em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
        <i class=" edit-item fa fa-pencil"></i>
    </a>`;
                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();
//app controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //load eventlistensers
    const loadEventListeners = function () {
        //getUI Selectors
        const UISelectors = UICtrl.getSelectors();
        //add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener(`click`, itemAddSubmit);
        //disable on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;

            }
        }),
            //edit icon click event
            document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }
    const itemAddSubmit = function (e) {
        //get form input from ui ctrl
        const input = UICtrl.getItemInput();
        if (input.name !== '' && input.calories !== '') {

            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to UI list
            UICtrl.addListItem(newItem);
            //get total 
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            //store in localStorage
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    //update item submit
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break into an array
            const listIdArray = listId.split('-');
            //get the actual id 
            const id = parseInt(listIdArray[1]);
            //get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //set thet current item;
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    //update item Submit
    const itemUpdateSubmit = function (e) {
        //get item input
        const input = UICtrl.getItemInput();
        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        //update local storage
        StorageCtrl.updateItemsStorage(updatedItem);
        UICtrl.clearEditState();
        //update ui
        UICtrl.updateListItem(updatedItem);
        e.preventDefault();
    }
    //delete button event
    const itemDeleteSubmit = function (e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);
        //delete from UI
        UICtrl.deleteListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        //delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        UICtrl.clearEditState();
        e.preventDefault();
    }
    //clear item events
    const clearAllItemsClick = function () {
        //delete All items fron ds
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        //remove from UI
        UICtrl.removeItems();
        StorageCtrl.clearItemsFromStorage();
        //hide the ul
        UICtrl.hideList();


    }
    //public controller

    return {
        init: function () {
            //clear edit state
            UICtrl.clearEditState();
            //fetch item from data structure
            const items = ItemCtrl.getItems();
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
                UICtrl.populateItemList(items);
            }
            //get total 
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            // //populate list with items
            // UICtrl.populateItemList(items);
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);
//initialize app
App.init();