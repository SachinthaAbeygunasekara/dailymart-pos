document.addEventListener('DOMContentLoaded', () => {
    loadInvoice();
});

function loadInvoice() {
    const invoiceData = localStorage.getItem('currentInvoice');
    if (!invoiceData) {
        alert('No invoice data found. Redirecting to dashboard.');
        window.location.href = 'home.html';
        return;
    }

    const order = JSON.parse(invoiceData);

    document.getElementById('invId').textContent = `#${order.id}`;
    document.getElementById('invDate').textContent = `Date: ${order.date}`;

    document.getElementById('custName').textContent = order.customerName || 'Guest';

    const itemsContainer = document.getElementById('invoiceItems');
    itemsContainer.innerHTML = order.items.map(item => `
        <tr>
            <td>
                <div class="fw-bold">${item.name}</div>
                <div class="small text-muted">${item.category}</div>
            </td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-end">${item.price.toFixed(2)}</td>
            <td class="text-end">${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('invSubtotal').textContent = `${order.subtotal.toFixed(2)} LKR`;

    const discountText = order.discountPercent > 0
        ? `-${order.discount.toFixed(2)} LKR (${order.discountPercent}%)`
        : `-${order.discount.toFixed(2)} LKR`;
    document.getElementById('invDiscount').textContent = discountText;

    document.getElementById('invTotal').textContent = `${order.total.toFixed(2)} LKR`;
}

function printInvoice() {
    window.print();
}

function downloadPDF() {
    const element = document.getElementById('invoiceContent');
    const opt = {
        margin: 10,
        filename: `Invoice_${document.getElementById('invId').textContent}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
