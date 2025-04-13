const orderList = document.getElementById('order-list');
const orderTotal = document.getElementById('money');
let total = 0;

// Helper to format currency
function formatCurrency(amount) {
  return `₱${amount.toFixed(2)}`;
}

// Add to order
document.querySelectorAll('button[data-name]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);
    const quantityInput = button.closest('div').querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value) || 1;

    const itemTotal = price * quantity;

    // This checks if the item is already in the list
    const existingItem = Array.from(orderList.children).find(li =>
      li.dataset.name === name
    );

    if (existingItem) {
      // This section updates the quantity and total of an existing item
      const oldQty = parseInt(existingItem.dataset.quantity);
      const newQty = oldQty + quantity;
      const newItemTotal = price * newQty;

      existingItem.dataset.quantity = newQty;
      existingItem.dataset.itemTotal = newItemTotal;

      existingItem.querySelector('h4').textContent = `Qty: ${newQty}`;
      existingItem.querySelector('p').textContent = `Total: ${formatCurrency(newItemTotal)}`;

      total += itemTotal;
    } else {

      // CThis creates new item on the ul
      const li = document.createElement('li');
      li.dataset.name = name;
      li.dataset.quantity = quantity;
      li.dataset.itemTotal = itemTotal;

      li.innerHTML = `
        <div class="bg-white text-gray-800 p-3 rounded shadow flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">${name}</h3>
            <h4 class="text-sm">Qty: ${quantity}</h4>
            <p class="text-sm font-medium">Total: ${formatCurrency(itemTotal)}</p>
          </div>
          <button class="remove-btn text-red-600 font-bold ml-4">Remove</button>
        </div>
      `;

      orderList.appendChild(li);
      total += itemTotal;

      // Remove button
      li.querySelector('.remove-btn').addEventListener('click', () => {
        const toRemove = parseInt(li.dataset.itemTotal);
        total -= toRemove;
        li.remove();
        orderTotal.textContent = total.toFixed(2);
      });
    }

    // Update the total display
    orderTotal.textContent = total.toFixed(2);
  });
});


// Payment
const payButton = document.querySelector('button.bg-yellow-200');
const amountInput = document.getElementById('amount');

payButton.addEventListener('click', () => {
  const amountGiven = parseFloat(amountInput.value);
  
  if (isNaN(amountGiven) || amountGiven < 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (amountGiven < total) {
    alert("Insufficient amount. Please enter more.");
  } else {
    const change = amountGiven - total;
    alert(`Payment successful! Your change is ${formatCurrency(change)}.`);
    
    // Reset everything
    orderList.innerHTML = '';
    amountInput.value = 0;
    total = 0;
    orderTotal.textContent = '0.00';
  }
});
