let cart = [];
let items = [];
let discount_type = [];

$.getJSON("./data/item.json", function(data) {
	items = data;
});
$.getJSON("./data/discount-type.json", function(data) {
	discount_type = data;
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
	console.log(cart);
	qtyInput.val('');
	// updateCart(); // อัปเดตตารางหลัก
	// $("#itemPopup").fadeOut(); // ปิด popup
});