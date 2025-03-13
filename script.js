let cart = [];
let discount = [];
let items = [];
let discount_data = [];
let discount_type ={};
let discount_obj = {};

// Get Data Section.
$.getJSON("./data/item.json", function(data) {
	items = data;
	items.forEach(function(item) {
		let newItem = {
			id: item.id,
			name: item.name,
			category: item.category,
			price: item.price,
			qty: 1
		};
		cart.push(newItem);
	})
	updateCart();
});
$.getJSON("./data/discount-type.json", function(data) {
	data.forEach(function(item) {
		discount_type[item.id] = item;
	})
	// console.log(discount_type)
});
$.getJSON("./data/item-discount.json", function(data) {
	discount_data = data;
	discount_data.forEach(function(item) {
		discount_obj[item.id] = item;
	})
});

// Open Add Item Popup.
$("#openPopup").click(function() {
	if (items.length === 0) return; // ถ้ายังโหลดไม่เสร็จ ไม่ต้องเปิด
	const itemList = $("#item-table tbody");
	itemList.empty();
	// List Item
	var html = ''
	items.forEach((item, index) => {
		html += `<tr>
		<td>${item.id}</td>
		<td>${item.name}</td>
		<td>${item.category}</td>
		<td>${item.price}</td>
		<td><input type="number" id="quantity" name="quantity"></td>
		<td><button type="button" class="addItem" data-index="${index}">Add Item</button></td>
		</tr>`
	});
	itemList.append(html);

	$("#itemPopup").show();
});

// Open Add Discount Popup.
$("#openDiscount").click(function() {
	if (discount_data.length === 0) return; // ถ้ายังโหลดไม่เสร็จ ไม่ต้องเปิด
	const discountList = $("#discountSelect");
	discountList.empty();
	const allfield = $(".discount-detail div");
	allfield.hide();
	clearInoput();
	// List Item
	var html = ''
	html += `<option value="">-- Select Discount --</option>`
	discount_data.forEach((item, index) => {
		html += `<option value="${item.id}">${item.name}</option>`
	});
	discountList.append(html);

	$("#discountPopup").show();
});

// Close Item Popup.
$(".close").click(function() {
	$("#itemPopup").fadeOut();
});

// Close Discount Popup.
$(".discount-close").click(function() {
	$("#discountPopup").fadeOut();
});

// Add Item.
$(document).on("click", ".addItem", function() {
	let row = $(this).closest("tr");
	let itemId = row.find("td:eq(0)").text();
	let itemName = row.find("td:eq(1)").text();
	let itemCategory = row.find("td:eq(2)").text();
	let itemPrice = parseFloat(row.find("td:eq(3)").text());
	let qtyInput = row.find("input[type='number']"); // เลือกช่อง input ของ Qty
	let itemQty = parseInt(qtyInput.val());

	if (!itemQty || itemQty <= 0) {
		alert("Please enter a valid quantity.");
		return;
	}

	let newItem = {
		id: itemId,
		name: itemName,
		category: itemCategory,
		price: itemPrice,
		qty: itemQty
	};

	cart.push(newItem); // เพิ่มสินค้าไปยัง cart[]
	qtyInput.val('');
	updateCart(); // อัปเดตตารางหลัก
	// $("#itemPopup").fadeOut(); // ปิด popup
});

// Delete Item.
$(document).on("click", ".deleteItem", function() {
	let index = $(this).data("index");
	cart.splice(index, 1); // ลบสินค้าจาก array
	updateCart(); // อัปเดตตารางหลัก
});

//Delete Discount Item.
$(document).on("click", ".deleteDiscountItem", function() {
	let index = $(this).data("index");
	discount.splice(index, 1); // ลบสินค้าจาก array
	updateCart(); // อัปเดตตารางหลัก
});

// Add Discount Item.
$("#applyDiscount").click(function() {
	let selectedDiscountId = $("#discountSelect").val();

	if (!selectedDiscountId) {
		alert("⚠️ Please select a discount type before applying!");
		return;
	}

	let amount = $("input#discount-amount").val();
	let percent = $("input#discount-percent").val();
	let category = $("select#discount-category").val();
	let point = $("input#discount-point").val();
	let special = [];
	$("input.discount-special").each(function (){
		if(!!$(this).val()){
			special.push($(this).val());
		}
	})


	let custompoint = $(".customer-point").val();
	let available = parseInt(custompoint) || 0;
	// Alert Section
	switch(Number(selectedDiscountId)) {
		case 1:
			if (!amount) {
				alert("⚠️ Please enter a valid discount amount!");
				return;
			}
			break;
		case 2:
			if (!percent) {
				alert("⚠️ Please enter a valid discount percent!");
				return;
			}
			break;
		case 3:
			if (!percent || !category) {
				alert("⚠️ Please fill in all discount fields before applying!");
				return;
			}
			break;
		case 4:
			if (!point || (available) < Number(point)) {
				alert("⚠️ Please enter a valid point!");
				$("input#discount-point").val('')
				return;
			}
			break;
		case 5:
			if(special.length < 2){
				alert("⚠️ Please fill in all discount fields before applying!");
				return;
			}
			break;
		default:
	};

	newtItem = {
		type : selectedDiscountId,
		amount : amount,
		percent : percent,
		category : category,
		point : point,
		special : special,
	}
	var use = addDiscountItem(newtItem);
	if(!use){
		alert("⚠️ You Have Same Discount Category on Discount Item!");
		return;
	}
	calTotal();
	$("#discountPopup").fadeOut();
});

// Trigger Discount Select Type.
$("#discountSelect").change(function() {
	let selectedDiscountId = $(this).val();

	let amount = $("#discount-amount");
	let percent = $("#discount-percent");
	let category = $("#discount-category");
	let point = $("#discount-point");
	let special = $("#discount-special");

	let allfield = $(".discount-detail div");
	allfield.hide();
	switch(Number(selectedDiscountId)) {
		case 1:
			amount.show();
			break;
		case 2:
			percent.show();
			break;
		case 3:
			percent.show();
			category.show();
			addCartCategory()
			break;
		case 4:
			point.show();
			calMaximunPoint();
			break;
		case 5:
			special.show();
			break;
		default:
	}


});

// Calculate Item & Discount
const calTotal = () => {
	var totalPrice = 0;
	cart.forEach((item, index) => {
		let rowTotal = item.price * item.qty;
		totalPrice += rowTotal;
	});

	var totalDiscount = 0;
	Object.keys(discount_type).forEach((item, index) => {
		discount.forEach((i) => {
			if(discount_obj[i.type].category == discount_type[item].id) {
				let type = i.type;
				if(type == 1 || type == '1'){
					totalDiscount += i.amount;
					totalPrice -= i.amount;
					i.total = i.amount;
				}else if(type == 2 || type == '2'){
					percent = i.percent
					amt_dis = percent/100*totalPrice;

					totalDiscount += amt_dis;
					totalPrice -= amt_dis;
					i.total = amt_dis;

				}else if(type == 3 || type == '3'){
					percent = i.percent
					category = i.category

					var cat_total = 0;
					cart.forEach((v, n) => {
						if(v.category == category) {
							let rowTotal = v.price * v.qty;
							cat_total += rowTotal;
						}
					});

					amt_dis = percent/100*cat_total;
					totalDiscount += amt_dis;
					totalPrice -= amt_dis;
					i.total = amt_dis;

				}else if(type == 4 || type == '4'){
					totalDiscount += i.point;
					totalPrice -= i.point;
					i.total = i.point;
				}else if(type == 5 || type == '5'){
					amt = Number(i.special[0]);
					sp_discount = Number(i.special[1]);

					amt_dis = Math.floor(totalPrice/amt)*sp_discount;
					totalDiscount += amt_dis;
					totalPrice -= amt_dis;
					i.total = amt_dis;
				}
			}
		})
	})
	// Discount type : Fixed amount (1)

	updateDiscount();
	$('#total').text(Number(totalPrice).toFixed(2));
}

// Add Discout item To cart
const addDiscountItem = (discountitem) => {
	var isUse = false;
	discount.forEach((item, index) => {
		if(isUse) return;
		var category = discount_type[discount_obj[item.type].category].name;
		var add_category = discount_type[discount_obj[discountitem.type].category].name;
		if(category === add_category) {
			isUse = true;
			return;
		}
	});
	if(isUse){
		return false;
	}else{
		discount.push(discountitem);
		return true;
	}
}

// Update Discout Table
const updateDiscount = (discountitem) => {
	// console.log(discount);
	const discountTable = $("#discount tbody");
	discountTable.empty();
	console.log(discount);
	discount.forEach((item, index) => {
		var name = discount_obj[item.type].name;
		if(item.type == 2 || item.type == '2'){
			name += ` ( ${item.percent} % )`
		}else if(item.type == 3 || item.type == '3'){
			name += ` ( ${item.percent} % Of ${item.category} )`
		}
		// console.log(discount_obj[item.type]);
		var category = discount_type[discount_obj[item.type].category].name;
		// console.log(category);
		discountTable.append(`
            <tr>
                <td>${name}</td>
                <td>${category}</td>
                <td>${item.total}</td>
                <td>
                    <button class="deleteDiscountItem" data-index="${index}">Delete</button>
                </td>
            </tr>
        `);
	});
}

// Add Category When Select Discount == 'Percentagediscount by item category'
function addCartCategory() {
	const discountCategory = $(".discount-category");
	discountCategory.empty();
	var html = ''
	html += `<option value="">-- Select Category --</option>`;
	let catCheck = []
	cart.forEach((item, index) => {
		if(catCheck.indexOf(item.category) != -1){
			return;
		}
		html += `<option value="${item.category}">${item.category}</option>`
		catCheck.push(item.category);
	});
	discountCategory.append(html);
}

// Add Maximum point When Select Discount == 'Discount by points'
function calMaximunPoint() {
	let custompoint = $(".customer-point").val();
	let available = parseInt(custompoint) || 0;
	let totalPrice = 0;
	cart.forEach((item, index) => {
		let rowTotal = item.price * item.qty;
		totalPrice += rowTotal;
	});
	let maximum = 0.2*totalPrice > available ? available : parseInt(0.2*totalPrice);

	let text = 'The maximum number of points you can apply is ' + maximum + '.'
	$(".maximumpoint").text(text);
}

// Update Item Table
function updateCart() {
	const cartTable = $("#cart tbody");
	cartTable.empty();

	cart.forEach((item, index) => {
		let rowTotal = item.price * item.qty;
		cartTable.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td>${rowTotal}</td>
                <td>
                    <button class="deleteItem" data-index="${index}">Delete</button>
                </td>
            </tr>
        `);
	});

	calTotal();
}

// Clear Input When Open Discount Popup
function clearInoput() {
	const allInput = $(".discount-detail div input");
	allInput.each(function(){
		$(this).val('');
	})
}



