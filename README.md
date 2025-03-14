# Krtisada Chaithahan 

## Discount Module

## Overview
Discount Module is a flexible shopping cart system with various discount calculation mechanisms. The application allows users to add items to a cart and apply different types of discounts to the total price. This project demonstrates frontend discount calculation logic that can be integrated into e-commerce systems.

## Features

- **Shopping Cart Management**
  - Add items to cart with specified quantities
  - View and delete cart items
  - Real-time price calculation

- **Discount System**
  - Fixed amount discount
  - Percentage discount on total price
  - Category-specific percentage discount
  - Customer points discount system (1 point = 1 THB)
  - Special discount for every X THB spent

- **Validation**
  - Prevents duplicate discount types
  - Validates customer points availability
  - Enforces input validation for all discount fields

## Technology Stack

- HTML5/CSS3 for interface
- Vanilla JavaScript for business logic
- jQuery for DOM manipulation
- JSON for data storage

## Project Structure

```
discount-module/
├── data/                     # JSON data files
│   ├── item.json             # Product catalog
│   ├── discount-type.json    # Discount type definitions
│   ├── item-discount.json    # Discount campaigns
├── index.html                # Main application page
├── script.js                 # JavaScript business logic
└── styles.css                # CSS styling
```

## How to Use

1. **Setup**
   - Clone the repository
   - Serve the project using a local web server (e.g., Live Server in VS Code, Python's `http.server`, or Node.js' `http-server`)  
   - Open `index.html` in a web browser via the local server
    
2. **Adding Items**
   - Click "Add Item" button
   - Select quantity for desired products
   - Click "Add Item" button next to the product

3. **Applying Discounts**
   - Enter customer points (if using point-based discounts)
   - Click "Add Discount" button
   - Select discount type from dropdown
   - Fill in required fields based on discount type
   - Click "Apply Discount"

4. **Managing Cart**
   - Delete items by clicking the "Delete" button
   - Delete discounts by clicking the "Delete" button in discount table
   - View total price calculated with all applied discounts

## Discount Types

1. **Fixed Amount Discount**
   - Deducts a specific THB amount from the total

2. **Percentage Discount**
   - Deducts a percentage from the total cart value

3. **Category Percentage Discount**
   - Applies percentage discount only to items in a specific category

4. **Points Discount**
   - Converts customer points to THB discounts (1:1 ratio)
   - Limited to 20% of total cart value or available points (whichever is lower)

5. **Special Discount**
   - For every X THB spent, applies Y THB discount

## Restrictions
- Only one discount from each category can be applied
- Points discount cannot exceed customer's available points
- Points discount cannot exceed 20% of total cart value
- Percentage discounts are limited to 100%

## Developer Notes

To add new discount types:
1. Add discount type in `data/discount-type.json`
2. Add discount campaign in `data/item-discount.json`
3. Implement calculation logic in `calTotal()` function in `script.js`

## License
MIT License

## Author
Kritsada - [GitHub](https://github.com/kritsada-git)
