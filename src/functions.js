import { donutShopMenu, customerOrder } from "./class.js";
/*Global Variables*/
let total = (a, b) => a + b;
let remove = (a, b) => a - b;
let menu = [];
let customerOrders = [];
let shopRevenue = 0;

/*Creates Menu*/
menu.push(
  new donutShopMenu("Sprinkles", 0.25, 10),
  new donutShopMenu("Maple", 0.5, 10),
  new donutShopMenu("Jelly-Filled", 0.75, 10),
  new donutShopMenu("Plain", 0.1, 10),
  new donutShopMenu("Glazed", 0.2, 10)
);
/*Start export function*/
export function test() {
  alert("Success!");
}
export function start() {
  let option = 0;
  do {
    option = parseInt(
      prompt(
        "Welcome to Bekah's Donut Shop!\nWhat would you like to do?\n 1. Order Donuts\n 2. Add Donuts\n 3. Create New Donut\n 4. Print Shop Revenue\n 5. See Inventory\n 6. Alter Donut Price \n 7. Refund Order \n 8. Exit"
      )
    );

    /*Main menu switch*/
    switch (option) {
      case 1:
        orderDonuts();
        break;
      case 2:
        addDonuts();
        break;
      case 3:
        createNewDonut();
        break;
      case 4:
        printShopRevenue();
        break;
      case 5:
        printShopMenu();
        break;
      case 6:
        updateDonutPrice();
        break;
      case 7:
        refundOrder();
        break;
      case 8:
        exit();
        break;
    }
  } while (option != 8);
}
/*Order Donut export function*/
export function orderDonuts() {
  /*Create order array*/
  let order = [];

  /*Get order and name for order from user*/
  order = takeOrder();
  let name = orderName();
  order.customerName = name;

  /*Get all donut names from menu*/
  let donutNames = [];
  menu.forEach((element) => {
    donutNames.push(element.donutTypes);
  });

  /*This filters the menu based on order using donut names*/
  let menuFilteredByOrder = menu.filter((element) =>
    order.find((value) => value.donutName == element.donutTypes)
  );

  /*This removes the donut amount ordered from the menu and maps to new array*/
  let menuAmount = menuFilteredByOrder.map((element) => element.donutQuantity);

  /*This removes the donut types ordered from the menu and maps to new array*/
  let menuType = menuFilteredByOrder.map((element) => element.donutTypes);

  /*This gets the new Inventory count (subtracts order quantity for each donut) and maps it to a new array*/
  let newDonutAmount = order.map(function (x, index) {
    return menuAmount[index] - x.donutAmountOrdered;
  });
  /*This calls thr export function to actually update the Inventory quantity using the newDonutAmount array*/
  menuType.forEach((element) => updateDonutAmount(element, newDonutAmount));

  /*This gets the price for the donut ordered*/
  let individualPrices = menuFilteredByOrder.map(
    (element) => element.donutPricing
  );

  /*This calculates the price for the donut ordered * quantity ordered*/
  let price = order.map(function (x, index) {
    return individualPrices[index] * x.donutAmountOrdered;
  });
  /*This calculates the customer's total for their order*/
  let orderTotal = price.reduce(total);
  order.donutOrderTotal = orderTotal;

  /*This lets the user know their order total*/
  alert(
    "Okay " +
      order.customerName +
      ", your total for today is: $" +
      orderTotal.toFixed(2)
  );

  /*This adds the customer's total to the shop's revenue*/
  shopRevenue = calculateShopRevenue(orderTotal);

  /*This adds the completed customer order to the Customer Orders array*/
  customerOrders.push(
    new customerOrder(
      order.donutName,
      order.donutAmountOrdered,
      order.donutOrderTotal,
      order.customerName
    )
  );
}
/*export Function to get the user order*/
export function takeOrder() {
  let responseArray = [];
  let numArray = [];
  let order = [];
  let valid = null;
  let response = null;
  let num = -1;
  let donutNameList = [];
  menu.forEach((element) => donutNameList.push(element.donutTypes + "\n"));
  let donutOrderNum = prompt("How many donuts would you like to order?"); //Comment from Kaleb -> Kaleb mentioned it might be better to word this as "How many donut types would you like to order? as this gets the number of donuts on order"
  for (let i = 0; i < donutOrderNum; i++) {
    response = prompt(
      "Available Donuts: \n" +
        donutNameList.join("") +
        "\n" +
        "Please enter a donut type"
    );
    responseArray.push(response);
    num = parseInt(prompt("Please enter an amount"));
    numArray.push(num);

    valid = donutChecker(response, num);

    if (valid == false) {
      alert("Invalid entry.");
    } else {
      order.donutName = responseArray;
      order.donutAmountOrdered = numArray;
      order.push(new customerOrder(response, num));
    }
  }
  return order;
}
/*export Function to refund order*/
export function refundOrder() {
  let customer = prompt(
    "Sorry to hear that you weren't satisfied with your order!\n What was the name for this order?"
  );
  let orderIndex = customerOrders.findIndex(
    (element) => element.customerName == customer
  );
  let valid = nameChecker(orderIndex);
  if (valid == true) {
    alert(
      "We have refunded you your order total of $" +
        customerOrders[orderIndex].donutOrderTotal
    );
    shopRevenue = refundShopRevenue(customerOrders[orderIndex].donutOrderTotal);
    customerOrders.splice(orderIndex, 1);
  }
}
/*export Function to get order name from user*/
export function orderName() {
  let name = prompt("Whats the name for this order?");
  return name;
}
/*export Function to check order name from user and see if it is valid*/
export function nameChecker(nameIndex) {
  if (nameIndex == -1) {
    alert("An order under this name does not exist");
    return false;
  } else {
    return true;
  }
}
/*export Function to check if donut order is valid by checking order amount compared to inventory and if donut name exists on menu*/
export function donutChecker(name, quantity) {
  let donutNameIndex = menu.findIndex((element) => element.donutTypes == name);
  let currentDonutAmount = menu[donutNameIndex].donutQuantity;
  if (donutNameIndex == -1 || currentDonutAmount < quantity) {
    return false;
  } else {
    return true;
  }
}
/*export Function to check if price is valid for changing the price of a donut*/
export function priceChecker(name, price) {
  let donutNameIndex = menu.findIndex((element) => element.donutTypes == name);
  if (donutNameIndex == -1 || price < 0) {
    return false;
  } else {
    return true;
  }
}
/*export Function to calculate shop revenue*/
export function calculateShopRevenue(total) {
  return (shopRevenue += total);
}
/*export Function to refund (subtract) shop revenue*/
export function refundShopRevenue(total) {
  return (shopRevenue -= total);
}
/*export Function to print the shop revenue*/
export function printShopRevenue() {
  alert("Shop Revenue: $" + shopRevenue.toFixed(2));
}
/*export Function to update the donut amount*/
export function updateDonutAmount(type, amount) {
  let index = menu.findIndex((element) => element.donutTypes == type);
  amount.forEach((element) => (menu[index].donutQuantity = element));
}
/*export Function to update the donut price based on user input*/
export function updateDonutPrice() {
  let donutNameList = [];
  menu.forEach((element) => donutNameList.push(element.donutTypes + "\n"));
  let donutNameResponse = prompt(
    "Which donut would you like to change the price of?\n" +
      donutNameList.join("")
  );
  let donutPriceResponse = parseInt(
    prompt("What would you like to change the price to?")
  );

  let valid = priceChecker(donutNameResponse, donutPriceResponse);
  if (valid == false) {
    alert("Invalid entry.");
  } else {
    let index = menu.findIndex(
      (element) => element.donutTypes == donutNameResponse
    );
    menu[index].donutPricing = donutPriceResponse;
    alert("You change the price to $" + donutPriceResponse.toFixed(2));
  }
}
/*export Function to add donuts to inventory*/
export function addDonuts() {
  let donutNameList = [];
  menu.forEach((element) => donutNameList.push(element.donutTypes + "\n"));
  let donutTypeResponse = prompt(
    "Which donut would you like to add to?\n" + donutNameList.join("")
  );
  let donutAmountResponse = parseInt(
    prompt("How many donuts would you like to add?\n")
  );

  let index = menu.findIndex(
    (element) => element.donutTypes == donutTypeResponse
  );
  menu[index].donutQuantity += donutAmountResponse;
}
/*export Function to create an entirely new donut*/
export function createNewDonut() {
  let donutType = prompt("Enter a new donut name.");
  let donutPrice = parseInt(prompt("Enter a new donut price."));
  let donutAmount = parseInt(prompt("Enter a new donut amount."));

  menu.push(new donutShopMenu(donutType, donutPrice, donutAmount));
  alert("You have created a new donut!");
}
/*This prints the Donut Shop Menu*/
export function printShopMenu() {
  let printedMenu = [];
  menu.forEach((element) =>
    printedMenu.push(
      element.donutTypes.toString() +
        " | $" +
        element.donutPricing.toString() +
        " | " +
        element.donutQuantity.toString() +
        "\n"
    )
  );
  alert("Donut Shop Menu: \n\n" + printedMenu.join(""));
}
/*This exits the application*/
export function exit() {
  alert("Thanks for visiting Bekah's Donut Shop! \nHave a great day!");
}
