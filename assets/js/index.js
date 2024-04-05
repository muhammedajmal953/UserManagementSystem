// $("#update-user").submit(function (event) {
//   event.preventDefault();

//   const unindexedarray = $(this).serializeArray();
//   console.log(unindexedarray);
//   let data = {};
//   $.map(unindexedarray, function (n, i) {
//     data[n["name"]] = n["value"];
//   });
//   let request = {
//     url: `http://localhost:3002/api/users/${data.id}`,
//     method: "PUT",
//     'data': data,
//   };
//   console.log(data);
//   $.ajax(request).done(function (response) {
//     alert("Data Updated Successfully");
//   });
// });

if (window.location.pathname == "/admin/users") {
  $ondelete = $(".table tbody td a.delete");
  $ondelete.click(function () {
    let id = $(this).attr("data-id");
console.log(id);
    let request = {
      url: `http://localhost:5000/admin/api/users/${id}`,
      method: "DELETE",
    };
    if (confirm("Do you really want to delete this record?")) {
      $.ajax(request).done(function (response) {
        alert("Data Deleted Successfully");
        location.reload;
      });
    }
  });
}
