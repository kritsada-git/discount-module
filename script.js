let cart = [];
let discount = [];
let items = [];
let discount_data = [];
let discount_type = [];

$.getJSON("./data/item.json", function(data) {
	items = data;
});
$.getJSON("./data/discount-type.json", function(data) {
	discount_type = data;
});

$.getJSON("./data/item-discount.json", function(data) {
	discount_data = data;
});
// Open Popup
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

$(".close").click(function() {
	$("#itemPopup").fadeOut();
});

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

$(document).on("click", ".deleteItem", function() {
	let index = $(this).data("index");
	cart.splice(index, 1); // ลบสินค้าจาก array
	updateCart(); // อัปเดตตารางหลัก
});


function updateCart() {
	const cartTable = $("#cart tbody");
	cartTable.empty();

	let totalPrice = 0;
	cart.forEach((item, index) => {
		let rowTotal = item.price * item.qty;
		totalPrice += rowTotal;
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

	$("#total").text(totalPrice.toFixed(2));

}

$("#openDiscount").click(function() {
	if (discount_data.length === 0) return; // ถ้ายังโหลดไม่เสร็จ ไม่ต้องเปิด
	const discountList = $("#discountSelect");
	discountList.empty();
	const allfield = $(".discount-detail div");
	allfield.hide();
	clearInout();
	// List Item
	var html = ''
	html += `<option value="">-- Select Discount --</option>`
	discount_data.forEach((item, index) => {
		html += `<option value="${item.id}">${item.name}</option>`
	});
	discountList.append(html);

	$("#discountPopup").show();
});

$(".discount-close").click(function() {
	$("#discountPopup").fadeOut();
});

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
				alert("⚠️ Please enter a valid point percent!");
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
	}

	$("#discountPopup").fadeOut();
});


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

function clearInout() {
	const allInput = $(".discount-detail div input");
	allInput.each(function(){
		$(this).val('');
	})
}
