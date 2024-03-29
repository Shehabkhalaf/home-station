const URL = 'http://127.0.0.1:8000';

const tableBody = document.getElementById('message-body');

function updateTable() {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getAllMessages().then((data) => {
    if (data.data.count === 0) {
      tableBody.innerHTML = `<tr><td class="text-lg whitespace-nowrap">Not Found!</td></tr>`;
    } else {
      tableBody.innerHTML = '';
      data.data.messages.forEach((msg, i) => {
        const tr = document.createElement('tr');

        if (++i % 2 === 0) {
          tr.classList.add('bg-gray-50');
        }

        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${msg.id}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
          ${msg.name}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${msg.email}
        </td>
        <td class="p-3 text-gray-700 text-sm">
        ${msg.phone}
        </td>
        <td class="p-3 text-gray-700 text-sm whitespace-pre-wrap">${msg.message}</td>
        <td class="text-red-500 text-center"><button id="delete-msg" data-id="${msg.id}" class="cursor-pointer"><i class="fa-solid fa-trash-can"></i></button></td>
        `;

        tableBody.append(tr);
      });
      const deleteBtns = document.querySelectorAll('#delete-msg');
      const deleteMsgEle = document.getElementById('delete');
      deleteBtns.forEach((btn) => {
        const messageId = btn.dataset.id;
        btn.addEventListener('click', () => {
          deleteMsg(messageId, deleteMsgEle);
          updateTable();
        });
      });
    }
  });
}
updateTable();

async function getAllMessages() {
  try {
    const res = await fetch(`${URL}/api/admin/all_messages`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function deleteMsg(id, deleteMsgEle) {
  try {
    const res = await fetch(`${URL}/api/admin/reply_message/${id}`);

    const resData = await res.json();

    if (resData.status === 200) {
      deleteMsgEle.innerHTML = 'Message has been deleted successfully!';
      setTimeout(() => {
        deleteMsgEle.innerHTML = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}
