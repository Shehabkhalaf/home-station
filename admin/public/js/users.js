const URL = 'http://127.0.0.1:8000/';

const tableBody = document.getElementById('user-body');

function updateTable() {
  tableBody.innerHTML = '';

  getAllUSers().then((data) => {
    data.data.users.map((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${user.id}</td>
      <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
        ${user.name}
      </td>
      <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
      ${user.email}
      </td>
      <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
      ${user.phone}
      </td>
      <td class="p-3 text-gray-700 text-sm">${user.address}</td>
      `;

      tableBody.append(tr);
    });
  });
}
updateTable();

async function getAllUSers() {
  try {
    const res = await fetch(`${URL}api/admin/all_users`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
