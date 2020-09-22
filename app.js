//module pattern returns an object containing all of the functions that we want to be public, so the functions that we want to give the outside scope access to.
//By wrapping our function in parenthesis, we tell the parser to parse our JavaScript as a function expression, and not a function declaration.

//BUDGET CONTROLLER
var budgetContoller = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);

      //Return new element
      return newItem;
    },
  };
})();

//UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },

    addListItem: function (obj, type) {
      var html, newHTML, element;

      //Create HTML string with placeholder text
      if (type === "inc") {
          element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      } else if (type === 'exp') {
          element = DOMstrings.expenseContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }

      //Replace placeholder text with the actual data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      //method above returns list while we want an array -> we can use 'slice' method to get it
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array){
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    //querySelector uses the same syntax as CSS
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var updateBudget = function () {
    //5. Calculate the budget

    //6. Display the budget
  }

  var ctrlAddItem = function () {
    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();

    //2. Add the item to the budget controller
    newItem = budgetContoller.addItem(
      input.type,
      input.description,
      input.value
    );

    //3. Add the new item to the UI
    UICtrl.addListItem(newItem, input.type);

    //4. Clear the fields
    UICtrl.clearFields();
  };

  return {
    init: function () {
      setupEventListeners();
    },
  };
})(budgetContoller, UIController);

controller.init();
