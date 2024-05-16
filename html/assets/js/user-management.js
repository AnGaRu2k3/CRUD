function showEditUserModal(btn){
  document.querySelector("#id").value = btn.dataset.id;
  document.querySelector("#usernameEdit").value = btn.dataset.username;
  document.querySelector("#firstNameEdit").value = btn.dataset.firstName;
  document.querySelector("#lastNameEdit").value = btn.dataset.lastName;
  document.querySelector("#mobileEdit").value = btn.dataset.mobile;
  document.querySelector("#isAdminEdit").checked = (btn.dataset.isAdmin == "true") ? true : false;
}
async function editUser(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById("editUserForm"))
  let data = Object.fromEntries(formData.entries())
  console.log(data)
  try {
    let res = await fetch("/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    if (res.status == 200) {
      location.reload();
    } else {
      let resText = await res.text();
      throw new Error(resText)
    }
  } catch (error) {
    e.target.querySelector("#errorMessage").innerText = "Can not update user information"
    console.log(error)
  }
}
document
  .querySelector("#editUserModal")
  .addEventListener("shown.bs.modal", () => {
    document.querySelector("#firstNameEdit").focus();
  });

document
  .querySelector("#addUserModal")
  .addEventListener("shown.bs.modal", () => {
    document.querySelector("#firstName").focus();
  });

document.querySelectorAll(".delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    const id = btnConfirm.dataset.id
    console.log(id)
    const options = {
      title: "Are you sure?",
      type: "danger",
      btnOkText: "Yes",
      btnCancelText: "No",
      onConfirm: async () => {
        console.log("confirm")
        let res = await fetch(`/users/${id}`, {
          method: "DELETE",
        });
        if (res.status == 200) {
          location.reload();
        } else {
          let resText = await res.text();
          throw new Error(resText)
        }
      },
      onCancel: () => {
        console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Do you really want to delete this user?", options);
  });
});
const paginationContainer = document.querySelector('.pagination');
paginationContainer.classList.add('justify-content-end');
paginationContainer.classList.remove('pagination-sm');
// Get all <li> elements inside the pagination container
const paginationItems = document.querySelectorAll('.pagination > li');
const leftItem = paginationItems[0].querySelector('i').classList.add("tf-icon", "bx", "bx-chevrons-left");
const rightItem = paginationItems[paginationItems.length - 1].querySelector('i').classList.add("tf-icon", "bx", "bx-chevrons-right");
paginationItems.forEach((item) => {
    // Add 'page-item' class to <li> element
    item.classList.add('page-item');

    // Get <a> element inside <li>
    const link = item.querySelector('a');
    if (link) {
        // Add 'page-link' class to <a> element
        link.classList.add('page-link');
    }
});