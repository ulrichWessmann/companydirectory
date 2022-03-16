// PRELOADER
$(window).on("load", () => {
    $('.preloader-wrapper').delay(1000).fadeOut('slow', () => {
        $('.preloader-wrapper').remove();
    });
  });
  // INITIAL LOAD
  $(function(){
    createTable();
    employeeTable();
    changeButton("addEmployee", "Add Employees");
    addEmployeeFunction();
  })
  const employeeTable = () => {
    $("#employeeContainer").removeClass("d-none");
    $("#departmentContainer").addClass("d-none");
    $("#locationContainer").addClass("d-none");
  }
  const departmentTable = () => {
    $("#employeeContainer").addClass("d-none");
    $("#departmentContainer").removeClass("d-none");
    $("#locationContainer").addClass("d-none");
  }
  const locationTable = () => {
    $("#employeeContainer").addClass("d-none");
    $("#departmentContainer").addClass("d-none");
    $("#locationContainer").removeClass("d-none");
  }
  
  //GET ALL EMPLOYEES 
  $(".getEmployees").on("click", () =>{
    employeeTable();
    changeButton("addEmployee", "Add Employee");
    addEmployeeFunction();
  })
  // GET ALL DEPARTMENTS 
  $(".getDepartments").on("click", () =>{
    departmentTable();
    changeButton("addDepartments", "Add Department");
      // OPEN ADD DEPARTMENT MODAL AND POPULATE
      $(".addDepartments").off().on("click", function(){
            $("#addDepartmentsModal").modal("show");
            populateLocationsDropdown("#AddLocationsDropdown", "selection");
            $("#addDepartmentName").val("");
            $("#addDepartmentNameError").empty();

          // ADD DEPARTMENT
          $("#addDepartmentConfirmation").off().on("click", function() {
              if($("#addDepartmentName").val() === ""){
                  $("#addDepartmentNameError")
                      .text("Please enter a valid location name")
                      .css(cssError)
              } else {
                  $("#addDepartmentNameError").text("")
                  $.ajax({
                      url: `libs/php/insertDepartment.php`,
                      type: 'POST',
                      dataType: 'json',
                      data: {
                          name: $("#addDepartmentName").val(),
                          locationID: $("#AddLocationsDropdown").val()
                      },  
                      success: function() {
                            createTable()
                            $("#addDepartmentsModal").modal("hide");
                      },
                      error: function(jqXHR) {
                          creationError(jqXHR)
                      }
                  });
              } 
          })
      }) 
  })

  //GET ALL LOCATIONS 
  $(".getLocations").on("click", () =>{
      locationTable();
      changeButton("addLocations", "Add Location");
      // OPEN ADD LOCATION MODAL AND POPULATE
      $(".addLocations").on("click", function(){
            $("#addLocationsModal").modal("show");
            $("#locationName").val("");
            $("#addLocationSpanError")
                .text("")
            // ADD LOCATIONS
            $("#confirmAddingLocation").on("click", function(){
                
                if($("#locationName").val() === "" || !$("#locationName").val().match(/^([^0-9]*)$/)) {
                    $("#addLocationSpanError")
                    .text("Please enter a valid location name")
                    .css(cssError)
                } else {
                    $.ajax({
                        url: `libs/php/insertLocation.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            name: $("#locationName").val()
                        },  
                        success: function() {
                            $("#confirmAddingLocation").off();
                            $("#addLocationsModal").modal("hide");
                            createTable();
                        },
                        error: function(jqXHR) {
                            creationError(jqXHR)
                        }
                    }); 
                }
          })
      })
  })
  
  const createTable = () => {
    $("#employeesTable").html("");
    $("#employeesTable").append([
      $('<thead>', {class: "sticky-top", id: "headingSelection"}).append([
        $('<tr>', {id: "tableHeaderNames"}).append([
          $('<th>', {scope: "col", text: "Name"}),
          $('<th>', {scope: "col", text: "Email", class: "smallDisplays"}),
          $('<th>', {scope: "col", text: "Location", class: "smallDisplays"}),
          $('<th>', {scope: "col", text: "Department", class: "smallDisplays"}),
          $('<th>'),
          $('<th>')
        ])
      ]),
      $('<tbody>', {id: "employeeTableBody"})
    ]);
     
    $("#departmentsTable").html("");
    $("#departmentsTable").append([
      $('<thead>', {class: "sticky-top", id: "headingSelection"}).append([
        $('<tr>', {id: "tableHeaderNames"}).append([
          $('<th>', {scope: "col", text: "Department"}),
          $('<th>', {scope: "col"}),
          $('<th>', {scope: "col"})
        ])
      ]),
      $('<tbody>', {id: "departmentsTableBody"})
    ]);
  
    $("#locationsTable").html("");
    $("#locationsTable").append([
      $('<thead>', {class: "sticky-top", id: "headingSelection"}).append([
        $('<tr>', {id: "tableHeaderNames"}).append([
          $('<th>', {scope: "col", text: "Locations"}),
          $('<th>', {scope: "col"}),
          $('<th>', {scope: "col"})
        ])
      ]),
      $('<tbody>', {id: "locationsTableBody"})
     ]);
  
    $("#searchBar").val("").change();
    $("#searchBarMobile").val("").change()
  
    populateLocationsDropdown(".locationFilter");
    populateDepartmentsDropDown(".departmentFilter");
  
    populateEmployees();
    populateDepartments();
    populateLocations();
  
  }
  
  const populateEmployees = () => {
    $.ajax({
        url: "libs/php/getAll.php",
        type: 'POST',
        dataType: 'json',
        data: {
        },
        success: function(result) {
            
            if (result.status.name == "ok") {
              
                let users = result.data;
                users.forEach(element => {
                    let id = element.id;
                    $("#employeeTableBody").append([
                        $('<tr>').append([
                            $('<td>', {text: `${element.lastName}, ${element.firstName}`}),
                            $('<td>', {class: "smallDisplays", text: element.email}),
                            $('<td>', {class: "smallDisplays", text: element.location}),
                            $('<td>', {class: "smallDisplays", text: element.department}),
                            $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<i>', {role: "button", class: "fa-solid fa-pen-to-square edit", id: `editEmployee${element.id}`})
                            ),
                            $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<i>', {role: "button", class: "fa-solid fa-trash delete",id: `deleteEmployee${element.id}`})
                            )
                        ])
                        ]);
                    // EDIT EMPLOYEES ONCLICK FUNCTION
                    $(`#editEmployee${element.id}`).on("click", ()=> {
                        employeeEdit(id);
                    });
                    //OPEN MODAL AND DELETE EMPLOYEE
                    $(`#deleteEmployee${id}`).on("click", ()=> {
                        employeeDelete(id, element);
                    });
                });
            }
        
        }
    });
    
  }
  
  const populateDepartments = () => {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'POST',
        dataType: 'json',
    
        success: function(result) {
            
            if (result.status.name == "ok") {
    
                let department = result.data;
                department.forEach(element => {
                    $("#departmentsTableBody").append([
                        $('<tr>').append([
                            $('<td>', {text: element.name, scope: "row", class: "rightAlign"}),
                            $('<td>').append(
                            $('<i>', {role: "button", class: "fa-solid fa-pen-to-square departmentEdit", id: `editDepartment${element.id}`})
                            ),
                            $('<td>').append(
                            $('<i>', {role: "button", class: "fa-solid fa-trash departmentDelete",id: `deleteDepartment${element.id}`})
                            )
                        ])
                    ]);
                    
                    $(`#editDepartment${element.id}`).on("click", ()=> {
                        departmentEdit(element.id);
                    });
                     // CHECK DEPENDANCY BEFORE DELETING
                    $(`#deleteDepartment${element.id}`).on("click", ()=> {
                        $.ajax({
                            url: "libs/php/checkDependencies.php",
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                action: "department",
                                search: element.id,
                            },  
                            success: function(result) {
                                data = result.data[0].depenencyCount;
                                
                                $('#deleteDepartmentModal').modal("show");
                                if(data != 0 ) {
                                    $(".unableToDelete").show()
                                    $(".deleteConfirmation").hide();
                                    $(".deleteName").hide();
                                    $(".cannotDeleteImg").show();
                                } else {
                                    $(".deleteName").text(element.name);
                                    $(".deleteName").show();
                                    $(".unableToDelete").hide()
                                    
                                    $(".cannotDeleteImg").hide();
                                    $(".deleteConfirmation").css({display: "block"});
                        
                                    $("#departmentDelete").on("click", function(){
                                        $.ajax({
                                            url: "libs/php/deleteDepartmentByID.php",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                id: element.id
                                            },
                                            success: function() {
                                                createTable();
                                                $("#departmentDelete").off()
                                                $("#deleteDepartmentModal").modal("hide");
                                            }
                                        });
                                    })
                                }
                            }
                        });
                    });
                });
            }
        }
    });
    
  }

  
  const populateLocations = () => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "all"
        },
  
        success: function(result) {
            
            if (result.status.name == "ok") {
                
                let location = result.data
                location.forEach(element => {
                    let id = element.id;
                    $("#locationsTableBody").append([
                        $('<tr>').append([
                            $('<td>', {text: element.name, scope: "row", class: "rightAlign"}),
                            $('<td>').append(
                            $('<i>', {role: "button", class: "fa-solid fa-pen-to-square locationEdit", id: `edit${element.id}`})
                            ),
                            $('<td>').append(
                            $('<i>', {role: "button", class: "fa-solid fa-trash locationDelete",id: `delete${element.id}`})
                            )
                        ])
                    ]);
  
                    $(`#edit${id}`).off().on("click", function() {
                        locationEdit(id);
                    });
                    // CHECK DEPENDANCY BEFORE DELETING
                    $(`#delete${id}`).on("click", ()=> {
                        $.ajax({
                            url: "libs/php/checkDependencies.php",
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                action: "department",
                                search: id,
                            },  
                            success: function(result) {
                                data = result.data[0].depenencyCount;
                                
                                $('#deleteLocationModal').modal("show");
                                if(data != 0 ) {
                                    $(".unableToDelete").show()
                                    $(".deleteConfirmation").hide();
                                    $(".deleteName").hide();
                                    $(".cannotDeleteImg").show();
                                } else {
                                    $(".deleteName").text(element.name);
                                    $(".deleteName").show();
                                    $(".unableToDelete").hide()
                                    
                                    $(".cannotDeleteImg").hide();
                                    $(".deleteConfirmation").css({display: "block"});
                        
                                    $("#locationDelete").on("click", function(){
                                        $.ajax({
                                            url: "libs/php/deleteLocation.php",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                id: id
                                            },
                                            success: function() {
                                                createTable();
                                                $("#locationDelete").off()
                                                $("#deleteLocationModal").modal("hide");
                                            }
                                        }); 
                                    })
                                }
                            }
                        });
                    });
                }); 
            }
        }
    });
    
  }
  
  const populateLocationsDropdown = (idSelector, selection, callback) => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "all"
        },  
        success: function(result) {
            
            $(`${idSelector}`)
            .find("option")
            .remove();
            
            let data = result.data;
            if(selection){
                data.forEach(location => {
                    $("<option>", {
                        value: location.id,
                        text: location.name
                    }).appendTo(idSelector)
                    
                })
            }
            // USED FOR SEARCH BAR DROP DOWN
            if(!selection) {
                data.forEach(location => {
                    $("<option>", {
                        value: location.name,
                        text: location.name
                    }).appendTo(idSelector) 
                })
                $(idSelector).prepend($("<option>", {
                    value: "",
                    text: "Select location",
                    selected: "selected"
                }))
            }
            if(callback){
                callback();
            }
        }
    });
  }
  
  const populateDepartmentsDropDown = (idSelector, htmlTarget, callback) => {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'POST',
        dataType: 'json',  
        success: function(result) {
            let data = result.data;
            let select;
            // REPLACE HMTL ON EACH CALL
            if(htmlTarget){
                data.forEach(location => {
                    select += `<option value=${location.id}>${location.name}</option>`
                })
                $(idSelector).html(select)
            } else {
                // REMOVE PREVIOUS SELECTION AND REPOPULATE
               $(`${idSelector}`)
                .find("option")
                .remove();
  
                data.forEach(location => {
                    $("<option>", {
                        value: location.name,
                        text: location.name
                    }).appendTo(idSelector)
                })
                $(idSelector).prepend($("<option>", {
                    value: "",
                    text: "Select department",
                    selected: "selected"
                })) 
            }
            if(callback) {
                callback();
            }
        }
    });
  }
  
  const locationOfDepartment = (id, textSelector) => {
    $.ajax({
        url: "libs/php/getDepartmentLocationJoin.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "single",
            id: id
        },  
        success: function(result) {
            $("#addEmployeeLocation").val(`${result.data[0].location}`)
        }
    });
  }
  
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
  const changeButton = (idName, buttonText) => {
    $(".changeButton").html("")
    $(".changeButton").append([
        $('<button>', {type: "button", class: `btn btn-dark ${idName} d-none d-lg-block`, text: `${buttonText}`}), 
        $('<button>', {type: "button", class: `btn-dark d-flex justify-content-center col-12 btn ${idName} d-lg-none`, 'data-bs-dismiss': "modal", text: `${buttonText}`})
    ]); 
  }
  
  const employeeEdit = (id) => {
    let personnelData;
    $("#nameError, #lastNameError, #emailError").text("")
    $("#exampleModalLabel").text("Edit Employee")
    $("#manageEmployeesFooter").html("")
    $("#manageEmployeesFooter").append([
        $('<button>', {type: "button", class: "btn btn-success", id: "editEmployeeConfirm", text: "Confirm"}), 
        $('<button>', {type: "button", class: "btn btn-secondary", 'data-bs-dismiss': "modal", text: "Cancel"})
    ]);
  
    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {
            personnelData = result;
            let employeeDepartmentID = (personnelData.data.personnel[0].departmentID);
            
            $("#manageEmployeesModal").modal("show");
            $("#firstName").val(personnelData.data.personnel[0].firstName);
            $("#lastName").val(personnelData.data.personnel[0].lastName);
            $("#email").val(personnelData.data.personnel[0].email);
  
            // POPULATE DEPARTMENT DROPDOWN
            populateDepartmentsDropDown("#employeeDepartments", "htmlTarget", ()=> {
                $("#employeeDepartments").val(employeeDepartmentID)
                locationOfDepartment($("#employeeDepartments").val())
            })
            // CHANGE LOCATION TEXT BASED ON DEPARTMENT
            $("#employeeDepartments").on("change", ()=>{
                locationOfDepartment($("#employeeDepartments").val())
            })
            
            $("#editEmployeeConfirm").on("click", function(event) {
                let editFirstName = "";
                let editLastName = "";
                let editEmail = "";
                if($("#firstName").val() === "" || !$("#firstName").val().match(/^([^0-9]*)$/)) {
                    editFirstName = "Please provide a valid first name."
                    $("#nameError")
                    .css(cssError)
                    .text(editFirstName)
                } else {
                    $("#nameError").text("");
                    editFirstName = "";
                }
                if($("#lastName").val() === "" || !$("#lastName").val().match(/^([^0-9]*)$/)) {
                    editLastName = "Please provide a valid last name."
                    $("#lastNameError")
                    .css(cssError)
                    .text(editLastName)
                } else {
                    $("#lastNameError").text("");
                    editLastName = "";
                }
                if($("#email").val() === "") {
                    editEmail = "Please enter an email address.";
                    $("#emailError")
                    .css(cssError)
                    .text(editEmail)
                } else {
                    if(validateEmail($("#email").val())){
                        editEmail = "";
                        $("#emailError")
                        .text("")
                    } else{
                        editEmail = "Please provide a valid email address.";
                        $("#emailError")
                        .css(cssError)
                        .text(editEmail)
                    }
                    
                }
                if(editFirstName != "" || editLastName != "" || editEmail != "") {
                    return false;
                } else {
                    // UPDATE EMPLOYEE DETAILS
                    event.preventDefault();
                    $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "employee",
                            firstName: $("#firstName").val(),
                            lastName: $("#lastName").val(),
                            email: $("#email").val(),
                            departmentID: $("#employeeDepartments").val(),
                            id: id
                        },  
                        success: function() {
                            $("#manageEmployeesModal").modal("toggle")
                            createTable();
                            $("#editEmployeeConfirm").off()
                        },
                        error: function(jqXHR) {
                            creationError(jqXHR)
                        }
                    });
                }
            })
        }
    }); 
  }
  
  const employeeDelete = (id, employeeObject) => {

    $("#deleteName").text(`${employeeObject.firstName} ${employeeObject.lastName}`);
    $('#deleteEmployeeModal').modal("show");
  
    // DELETE EMPLOYEE FROM DB
    $("#deleteEmployee").on("click", function(){
        $("#deleteEmployeeModal").modal("toggle");
        $.ajax({
            url: "libs/php/deletePersonnel.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function() {
                $("#deleteEmployee").off();
                createTable();
            }
        });
        
    })
  }
  
  const locationEdit = (id) => {
    $("#locationSpanError").text("");
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "single",
            id: id
        },    
        success: function(result) {
            let locationName = result.data[0].name;
            $("#EditLocationName").val(locationName);
            $("#locationText").text("Location");
            $("#manageLocationsModal").modal("show");
  
            $("#confirmUpdatingLocation").off().on("click", function(){
                if($("#EditLocationName").val() === "" || !$("#EditLocationName").val().match(/^([^0-9]*)$/)){
                    $("#locationSpanError")
                    .text("Please enter a valid location name.")
                    .css(cssError)
                } else {
                    $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "location",
                            name: $("#EditLocationName").val(),
                            id: id
                        },  
                        success: function() {
                            $("#manageLocationsModal").modal("toggle");
                            createTable();
                        },
                        error: function(jqXHR) {
                            creationError(jqXHR)
                        }
                    });
                }
            })
        }
    }); 
  }
  const departmentEdit = (id) => {
    let department = id;
    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: department,
            action: "byID"
        },    
        success: function(result) {
            $("#departmentName").val(result.data[0].name);
            $("#manageDepartmentsModal").modal("show");
            $("#departmentNameError").empty()
  
            populateLocationsDropdown("#locationsDropdown", "selection", ()=> {
                $("#locationsDropdown").val(result.data[0].locationID).change();
            })
            
            $("#editDepartmentConfirmation").off().on("click", function() {
                if($("#departmentName").val() === ""){
                    $("#departmentNameError")
                    .text("Please enter a valid location name.")
                    .css(cssError)
                } else {
                $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "department",
                            name: $("#departmentName").val(),
                            locationID: $("#locationsDropdown").val(),
                            id: department
                        },  
                        success: function() {
                            $("#manageDepartmentsModal").modal("hide");
                            $("#editDepartmentConfirmation").off()
                            createTable();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            creationError(jqXHR)
                        }
                    }); 
                }
            })
        },
    });
  }
  
const creationError = (array) => {
    let name;
    let lastName;
    let email;
    let department;
    let location;
    Array.from(array.responseJSON.data).forEach(child => {
        if(child === "name") {
           name = "name";
        } 
        if(child === "lastName") {
            lastName = "lastName";
        }
        if(child === "email") {
            email = "email";
        }
        if(child === "department"){
            department = "department";
        }
        if(child === "location"){
            location = "location";
        }
    });
    if(name === "name") {
        $("#nameError").text("First name is invalid.").css(cssError);
    } else {
        $("#nameError").text("");
    }
    if(lastName === "lastName") {
        $("#lastNameError").text("Last name is invalid.").css(cssError);
    } else {
        $("#lastNameError").text("");
    }
    if(email === "email") {
        $("#emailError").text("Email is invalid.").css(cssError);
    } else {
        $("#emailError").text("");
    }
    if(department === "department") {
        $("#departmentNameError").text("Department is invalid.").css(cssError);
        $("#addDepartmentNameError").text("Department is invalid.").css(cssError);
    } else {
        $("#departmentNameError").text("");
        $("#addDepartmentNameError").text("");
    }
    if(location === "location") {
        $("#locationSpanError").text("Location is invalid.").css(cssError);
        $("#addLocationSpanError").text("Location is invalid.").css(cssError);
    } else {
        $("#locationSpanError").text("");
        $("#addLocationSpanError").text("");
    }
  }
  const addEmployeeFunction = () => {
    $(".addEmployee").off().on("click", function(){
        $("#manageEmployeesModal").modal("show");
        $("#exampleModalLabel").text("Add Employee")
        $("#nameError, #lastNameError, #emailError").text("");
        $("#addEmployeeFrom")[0].reset();
        $("#manageEmployeesFooter").html("")
        $("#manageEmployeesFooter").append([
            $('<button>', {type: "button", class: "btn btn-success", id: "createNewEmployee", text: "Confirm"}), 
            $('<button>', {type: "button", class: "btn btn-secondary", 'data-bs-dismiss': "modal", text: "Cancel"})
        ]);
        
        populateDepartmentsDropDown("#employeeDepartments", "htmlTarget",()=> {
            locationOfDepartment($("#employeeDepartments").val())
        })
        
        $("#employeeDepartments").on("change", ()=>{
            locationOfDepartment($("#employeeDepartments").val())
        })
    
        $("#createNewEmployee").off().on("click", function(event){
            event.preventDefault();
            let firstName = "";
            let lastName = "";
            let email = "";
            if($("#firstName").val() === ""|| !$("#firstName").val().match(/^([^0-9]*)$/)) {
                firstName = "Please provide a valid first name.";
                $("#nameError")
                .css(cssError)
                .text(firstName)
            } else {
                $("#nameError").text("")
                firstName = "";
            }
            if($("#lastName").val() === "") {
                lastName = "Please provide a last name."
                $("#lastNameError")
                .css(cssError)
                .text(lastName)
            } else {
                $("#lastNameError").text("")
                lastName = "";
            }
            if($("#email").val() === "") {
                email = "Please enter an email address.";
                $("#emailError")
                .css(cssError)
                .text(email)
            } else {
                if(validateEmail($("#email").val())){
                    $("#emailError").text("");
                    email = "";
                } else{
                    email = "Please provide a valid email address.";
                    $("#emailError")
                    .css(cssError)
                    .text(email)
                }
                
            }
            if(firstName != "" || lastName != "" || email != "") {
                return false;
            } else {
                $.ajax({
                    url: `libs/php/insertPersonnel.php`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: $("#firstName").val(),
                        lastName: $("#lastName").val(),
                        email: $("#email").val(),
                        locationID: $("#employeeDepartments").val() 
                    },  
                    success: function() {
                        createTable();
                        $("#manageEmployeesModal").modal("toggle");
                    },
                    error: function(jqXHR) {
                        creationError(jqXHR);
                  }
              }); 
            }
        })
    })
  }
  
  // SEARCH FUNCTON
  // DESKTOP
  $("#searchButton").on("click", function(event){
    let searchText = $("#searchBar").val()
    let locationFilter = $("#locationFilter").val()
    let departmentFilter = $("#departmentFilter").val()
    event.preventDefault()
    
    $.ajax({
        url: "libs/php/searchPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            search: searchText,
            location: locationFilter,
            department: departmentFilter
        },  
        success: function(result) {
          $("#employeeTableBody").empty()
            result.data.forEach(element => {
                let id = element.id;
                $("#employeeTableBody").append([
                    $('<tr>').append([
                        $('<td>', {text: `${element.lastName}, ${element.firstName}`}),
                        $('<td>', {class: "smallDisplays", text: element.email}),
                        $('<td>', {class: "smallDisplays", text: element.location}),
                        $('<td>', {class: "smallDisplays", text: element.department}),
                        $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<button>', {type: "button",class: "btn btn-warning edit",id: `editEmployee${element.id}`, text: "Edit"})
                            ),
                        $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<button>', {type: "button", class: "btn btn-danger delete",id: `deleteEmployee${element.id}`, text: "Delete"})
                        )
                    ])
                 ]);
                //OPEN MODAL AND EDIT EMPLOYEE
                $(`#edit${element.id}`).on("click", ()=> {
                    employeeEdit(id);
                })
                //OPEN MODAL AND DELETE EMPLOYEE
                $(`#delete${id}`).on("click", ()=> {
                    employeeDelete(id);
                })
            });
        }
    });
  })
// MOBILE
$("#searchButtonMobile").on("click", function(event){
    let searchText = $("#searchBarMobile").val();
    let locationFilter = $("#locationFilterMobile").val();
    let departmentFilter = $("#departmentFilterMobile").val();

    event.preventDefault();
    createTable();
    employeeTable();

    $.ajax({
        url: "libs/php/searchPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            search: searchText,
            location: locationFilter,
            department: departmentFilter
        },  
        success: function(result) {
            $("#employeeTableBody").empty()
            result.data.forEach(element => {
                let id = element.id;
                $("#employeeTableBody").append([
                    $('<tr>').append([
                        $('<td>', {text: `${element.lastName}, ${element.firstName}`}),
                        $('<td>', {class: "smallDisplays", text: element.email}),
                        $('<td>', {class: "smallDisplays", text: element.location}),
                        $('<td>', {class: "smallDisplays", text: element.department}),
                        $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<button>', {type: "button",class: "btn btn-warning edit",id: `editEmployee${element.id}`, text: "Edit"})
                        ),
                        $('<td>', {class: "rightAlignEmployees"}).append(
                            $('<button>', {type: "button", class: "btn btn-danger delete",id: `deleteEmployee${element.id}`, text: "Delete"})
                        )
                    ])
                ]);
                //OPEN MODAL AND EDIT EMPLOYEE
                $(`#editEmployee${element.id}`).on("click", ()=> {
                    employeeEdit(id);
                    })
                //OPEN MODAL AND DELETE EMPLOYEE
                $(`#deleteEmployee${id}`).on("click", ()=> {
                    employeeDelete(id, element);
                });
            });
        }
    });
})
  
$(".resetButton").on("click", (event) =>{
    event.preventDefault();
    createTable();
    employeeTable();
})
// VARIABLES
let cssError = {
        color: "red",
        "font-size": "0.9em"
};
  
    
   