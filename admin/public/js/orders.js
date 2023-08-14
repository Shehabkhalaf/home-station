const URL = 'http://127.0.0.1:8000';

const tableBody = document.getElementById('orders-body');

function updateUnDeliveredTable() {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getUndeliveredOrders().then((data) => {
    if (data.data.length === 0) {
      tableBody.innerHTML = `<tr><td class="text-lg whitespace-nowrap">Not Found!</td></tr>`;
    } else {
      tableBody.innerHTML = '';
      data.data.forEach((order, i) => {
        const tr = document.createElement('tr');

        if (++i % 2 === 0) {
          tr.classList.add('bg-gray-50');
        }

        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          order.order_id
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
          ${order.user}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${order.details
          .map((product) => {
            return `${product}`;
          })
          .join('')}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${order.price}
        </td>
        <td class="p-3 text-gray-700 text-sm whitespace-pre-wrap">${
          order.paid_method
        }</td>
        <td class="text-green-500 text-center"><button id="delivere-order" data-id="${
          order.order_id
        }" class="cursor-pointer"><i class="fa-solid fa-arrow-right-to-bracket"></i></button></td>
        `;

        tableBody.append(tr);
      });
      const delivereBtns = document.querySelectorAll('#delivere-order');
      const delivereOrderEle = document.getElementById('delivere');
      delivereBtns.forEach((btn) => {
        const messageId = btn.dataset.id;
        btn.addEventListener('click', () => {
          delivereOrder(messageId, delivereOrderEle);
          updateUnDeliveredTable();
          updateDeliveredTable();
        });
      });
    }
  });
}
updateUnDeliveredTable();

const deliveredTableBody = document.getElementById('deliveredOrders-body');
function updateDeliveredTable() {
  deliveredTableBody.innerHTML = `<span class="loader"></span>`;

  getdeliveredOrders().then((data) => {
    if (data.data.length === 0) {
      deliveredTableBody.innerHTML = `<tr><td class="text-lg whitespace-nowrap">Not Found!</td></tr>`;
    } else {
      deliveredTableBody.innerHTML = '';
      data.data.forEach((order, i) => {
        const tr = document.createElement('tr');

        if (++i % 2 === 0) {
          tr.classList.add('bg-gray-50');
        }

        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          order.order_id
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
          ${order.user}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${order.details
          .map((product) => {
            return `${product}`;
          })
          .join('')}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${order.price}
        </td>
        <td class="p-3 text-gray-700 text-sm whitespace-pre-wrap">${
          order.paid_method
        }</td>
        `;

        deliveredTableBody.append(tr);
      });
    }
  });
}
updateDeliveredTable();

async function getUndeliveredOrders() {
  try {
    const res = await fetch(`${URL}/api/admin/undelivered_orders`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getdeliveredOrders() {
  try {
    const res = await fetch(`${URL}/api/admin/delivered_orders`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function delivereOrder(id, delivereOrderEle) {
  try {
    const res = await fetch(`${URL}/api/admin/deliver_order/${id}`);

    const resData = await res.json();

    if (resData.status === 200) {
      delivereOrderEle.innerHTML = 'Order updated successfully!';
      setTimeout(() => {
        delivereOrderEle.innerHTML = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}
