const controller = {};
const models = require("../models");

controller.show = async (req, res) => {
  const pageLimit = 2;
  const currentPage = parseInt(req.query.page) || 1;
  const offset = (currentPage - 1) * pageLimit;
  try {
    const allUsers = await models.User.findAll({
      attributes: [
        "id",
        "imagePath",
        "username",
        "firstName",
        "lastName",
        "mobile",
        "isAdmin",
      ],
      order: [["createdAt", "DESC"]]
    });

    // Total count of users
    const count = allUsers.length;

    // Apply pagination
    const paginatedUsers = allUsers.slice(offset, offset + pageLimit);

    const totalPages = Math.ceil(count / pageLimit);
    const pages = []
    for (let i = -2; i <= 2; i++) {
      if ((currentPage + i) >= 1 && (currentPage + i) <= totalPages) 
        pages.push(currentPage + i) 
    }
    // Pass the data to view
    res.locals.users = paginatedUsers;
    res.locals.pagination = {
      page: currentPage,
      limit: pageLimit, 
      totalRows: count
    }
    console.log(pages)
    res.render("user-management");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }

};
controller.addUser = async (req, res) => {
  let { username, firstName, lastName, mobile, isAdmin } = req.body;
  try {
    const result = await models.User.create({
      username,
      firstName,
      lastName,
      mobile,
      isAdmin: isAdmin ? true : false
    });
    if (result) {
      res.redirect("/users")
    } else {
      res.status(500).send("User could not be added");
    }
  } catch (error) {
    res.send("Cannot add user!")
    console.error(error)
  }
}
controller.editUser = async (req, res) => {
  let { id, firstName, lastName, mobile, isAdmin } = req.body
  try {
    console.log(id, firstName, lastName, mobile, isAdmin)
    const result = await models.User.update({
      firstName,
      lastName,
      mobile,
      isAdmin: isAdmin ? true : false
    }, {
      where: { id }
    });
    if (result[0] > 0) { 
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }

  } catch {
    res.status(401).send("cannot update user!")
    console.error(error)
  }
}
controller.deleteUser = async (req, res) => {
  let id = req.params.id
  if (!id) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const result = await models.User.destroy({
      where: { id }
    })
    if (result) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }

  } catch (error) {
    res.status(500).json({ error: "Cannot delete user!" });
    console.error(error)
  }
}
module.exports = controller;
