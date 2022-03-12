// PRELOADER
$(window).on("load", () => {
    $('.preloader-wrapper').delay(1000).fadeOut('slow', () => {
        $('.preloader-wrapper').remove();
    });
 });
let state = "all";
// INITIAL LOAD
$(function(){
    checkState();
})


//GET ALL EMPLOYEES 
$(".getEmployees").on("click", () =>{
    state = "all";
    checkState();
})

//GET ALL LOCATIONS 
$(".getLocations").on("click", () =>{
    state = "location";
    checkState();
})

// GET ALL DEPARTMENTS 
$(".getDepartments").on("click", () =>{
    state = "departments";
    checkState();
})

// CHANGE TABLE HEADER, ADD, EDIT AND BODY ACCORDING TO STATE
const checkState = () => {
    switch(state) {

     case "all":
         
        $(".table").html(`
        <thead class="sticky-top" id="headingSelection">
        <tr id="tableHeaderNames">
        <th class="text-truncate">Name</th>
        <th class="smallDisplays">Email</th>
        <th class="smallDisplays">Location</th>
        <th class="smallDisplays" scope="col">Department</th>
        <th ></th>
        <th ></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `);
        
        

        changeButton("addEmployee", "Add Employees");
        $("#searchBar").val("").change();
        $("#searchBarMobile").val("").change();

        populateLocationsDropdown(".locationFilter")
        populateDepartmentsDropDown(".departmentFilter")

        populateEmployees();
         
       break;

     case "departments":

        $(".table").html(`
        <thead class="sticky-top" id="headingSelection">
        <tr id="tableHeaderNames">
        <th scope="col">Department</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `);

        changeButton("addDepartments", "Add Departments")
        $("#searchBar").val("").change();
        $("#searchBarMobile").val("").change();

        populateLocationsDropdown(".locationFilter")
        populateDepartmentsDropDown(".departmentFilter")

        populateDepartments();

       break;

     case "location":

        $(".table").html(`
        <thead class="sticky-top" id="headingSelection">
        <tr id="tableHeaderNames">
        <th scope="col">Locations</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `);

        changeButton("addLocations", "Add Locations")
        $("#searchBar").val("").change();
        $("#searchBarMobile").val("").change();

        populateLocationsDropdown(".locationFilter")
        populateDepartmentsDropDown(".departmentFilter")
        
        populateLocations();
       break;
    
     }
 };

// TABLE POPULATION FUNCTIONS
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
                    $("#tableBody").append(`
                        <tr>
                            <td scope="Row" class="rightAlign">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning locationEdit" id="edit${id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger locationDelete" id="delete${id}">Delete</button>
                            </td>
                        </tr>
                    `);

                    $(`#edit${id}`).on("click", function() {
                        locationEdit(id)
                    });
                    // CHECK DEPENDANCY BEFORE DELETING
                    $(`#delete${id}`).on("click", ()=> {
                        checkDepencency(id, "location", element);
                    })
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    // OPEN ADD LOCATION MODAL AND POPULATE
    $(".addLocations").on("click", function(){
        $("#manageLocationsDetails > div.modal-header > h5").text("Add location")
        $("#manageLocationsModal").modal("show");
        $("#locationText").text("Add Location");
        $("#locationName").val("");
        $("#locationSpanError")
            .text("")
        $("#locationsFooter").html(`
            <button type="button" class="btn btn-success" id="confirmAddingLocation">Confirm</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        `);
        // ADD LOCATIONS
        $("#confirmAddingLocation").on("click", function(){
            
            if($("#locationName").val() === "" || !$("#locationName").val().match(/^([^0-9]*)$/)) {
                $("#locationSpanError")
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
                        $("#manageLocationsModal").modal("hide");
                        checkState();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        creationError(jqXHR)
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                }); 
            }
        })
    })
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
                    $("#tableBody").append(`
                        <tr>
                            <td scope="Row" class="rightAlign">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning departmentEdit" id="edit${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger departmentDelete" id="delete${element.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                    $(`#edit${element.id}`).on("click", ()=> {
                        departmentEdit(element.id)  
                    })
                     // CHECK DEPENDANCY BEFORE DELETING
                    $(`#delete${element.id}`).on("click", ()=> {
                        checkDepencency(element.id, "department", element);
                    })
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    // OPEN ADD DEPARTMENT MODAL AND POPULATE
    $(".addDepartments").on("click", function(){
        $("#addDepartmentDetails > div.modal-header > h5").text("Add department")
        $("#manageDepartmentsModal").modal("show");
        populateLocationsDropdown("#locationsDropdown", "selection");
        $("#departmentName").val("");
        $("#departmentNameError").text("");
        $("#departmentsFooter").html(`
            <button type="button" class="btn btn-success" id="addDepartmentConfirmation">Confirm</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            
        `);
        // ADD DEPARTMENT
        $("#addDepartmentConfirmation").on("click", function() {
            if($("#departmentName").val() === "" || !$("#departmentName").val().match(/^([^0-9]*)$/)){
                $("#departmentNameError")
                    .text("Please enter a valid location name")
                    .css(cssError)
            } else {
                $("#departmentNameError").text("")
                $.ajax({
                    url: `libs/php/insertDepartment.php`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: $("#departmentName").val(),
                        locationID: $("#locationsDropdown").val()
                    },  
                    success: function() {
                        checkState()
                        $("#manageDepartmentsModal").modal("hide");
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        creationError(jqXHR)
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            } 
        })
    })
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
                    $("#tableBody").append(`
                        <tr>
                            <td>${element.lastName}, ${element.firstName} </td>
                            <td class="smallDisplays">${element.email}</td>
                            <td class="smallDisplays">${element.location}</td>
                            <td class="smallDisplays">${element.department}</td>
                            <td class="rightAlignEmployees">
                                <button type="button" class="btn btn-warning edit" id="edit${element.id}">Edit</button>
                            </td>
                            <td class="rightAlignEmployees">
                                <button type="button" class="btn btn-danger delete" id="delete${element.id}">Delete</button>
                            </td>
                        </tr>
                    `);

                    // EDIT EMPLOYEES ONCLICK FUNCTION
                    
                    $(`#edit${element.id}`).on("click", ()=> {
                        employeeEdit(id);
                    })
                    //OPEN MODAL AND DELETE EMPLOYEE
                    $(`#delete${id}`).on("click", ()=> {
                        employeeDelete(id, element);
                        console.log(`${element.firstName} ${element.lastName}`)
                    })
                });
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    // OPEN ADD EMPLOYEE MODAL AND POPULATE
    $(".addEmployee").on("click", function(){
        let id;
        $("#manageEmployeesModal").modal("show");
        $("#exampleModalLabel").text("Add Employee")
        $("#nameError, #lastNameError, #emailError").text("");
        $("#firstName, #lastName, #email").val("");
        $("#mangeEmployeesFooter").html(`
            <button type="button" class="btn btn-success"  id="createNewEmployee">Confirm</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        `);
        
        populateDepartmentsDropDown("#addDepartments", "htmlTarget",()=> {
            locationOfDepartment($("#addDepartments").val())
        })
        
        $("#addDepartments").on("change", ()=>{
            locationOfDepartment($("#addDepartments").val())
        })

        
        // change this section

        $("#createNewEmployee").on("click", function(event){
            event.preventDefault();
            let firstName = "";
            let lastName = "";
            let email = "";
            if($("#firstName").val() === "") {
                firstName = "Please provide a first name.";
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
                        locationID: $("#addDepartments").val() 
                    },  
                    success: function() {
                        checkState();
                        $("#manageEmployeesModal").modal("toggle");
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        creationError(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                }); 
            }
        })
    })
}

// HELPER FUNCTIONS
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
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
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

const checkDepencency = (value, target, object) => {
    $.ajax({
        url: "libs/php/checkDependencies.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: target,
            search: value,
        },  
        success: function(result) {
            console.log(object)
            $('#deleteEmployeeModal').modal("show");
            data = result.data[0].depenencyCount;
            let errorMessage;
            let routine;
                if(target === "department") {
                    routine = "libs/php/deleteDepartmentByID.php";
                    errorMessage = "Unable to delete department as it contains employee entries.";
                    $("#deleteBody > p").text(errorMessage);
                } else {
                    routine = "libs/php/deleteLocation.php";
                    errorMessage = "Unable to delete location as it contains department entries.";
                    $("#deleteBody > p").text(errorMessage);
                }
                
            
            if(data != 0 ) {
                $("#deleteBody > p").text(errorMessage);
                $("#deleteConfirmation").hide();
                $("#deleteBody > h5").hide();
                $("#cannotDeleteImg").show();
            } else {
                if(target === "department") {
                    $("#deleteSelection").text("Delete department");
                    $("#deleteName").text(object.name);
                } else {
                    $("#deleteSelection").text("Delete location");
                    $("#deleteName").text(object.name);
                }
                $("#cannotDeleteImg").hide();
                $("#deleteConfirmation").css({display: "block"});

                $("#deleteConfirmation").on("click", function(){
                    $("#deleteEmployeeModal").modal("hide");
                    $.ajax({
                        url: routine,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            id: value
                        },
                        success: function() {
                            $("#deleteConfirmation").off()
                            checkState();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                    
                })
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    
}

const changeButton = (idName, buttonText) => {
    $(".changeButton").html(`
        <button type="button" class=" btn btn-dark ${idName} d-none d-lg-block">${buttonText}</button>
        <button type="button" class="btn-dark d-flex justify-content-center col-12 btn ${idName} d-lg-none">${buttonText}</button>
    `);  
}

const employeeEdit = (id) => {
    let personnelData;
    $("#nameError, #lastNameError, #emailError").text("")
    $("#exampleModalLabel").text("Edit Employee")
    $("#mangeEmployeesFooter").html(`
        <button type="button" class="btn btn-success"  id="editEmployeeConfirm">Confirm</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    `);

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
            populateDepartmentsDropDown("#addDepartments", "htmlTarget", ()=> {
                $("#addDepartments").val(employeeDepartmentID)
                locationOfDepartment($("#addDepartments").val())
            })
            // CHANGE LOCATION TEXT BASED ON DEPARTMENT
            $("#addDepartments").on("change", ()=>{
                locationOfDepartment($("#addDepartments").val())
            })
            
            $("#editEmployeeConfirm").on("click", function(event) {
                let editFirstName = "";
                let editLastName = "";
                let editEmail = "";
                if($("#firstName").val() === "") {
                    editFirstName = "Please provide a first name."
                    $("#nameError")
                    .css(cssError)
                    .text(editFirstName)
                } else {
                    $("#nameError").text("");
                    editFirstName = "";
                }
                if($("#lastName").val() === "") {
                    editLastName = "Please provide a last name."
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
                    $("#manageEmployeesModal").modal("toggle")
                    $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "employee",
                            firstName: $("#firstName").val(),
                            lastName: $("#lastName").val(),
                            email: $("#email").val(),
                            departmentID: $("#addDepartments").val(),
                            id: id
                        },  
                        success: function() {
                            checkState();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    }); 
}

const employeeDelete = (id, employeeObject) => {
    $("#cannotDeleteImg").hide();
    $("#deleteSelection").text("Delete emloyee");
    $("#deleteName").text(`${employeeObject.firstName} ${employeeObject.lastName}`);
    console.log(employeeObject)
    $("#deleteConfirmation").css({display: "block"});

    $('#deleteEmployeeModal').modal("show");

    // DELETE EMPLOYEE FROM DB
    $("#deleteConfirmation").on("click", function(){
        $("#deleteEmployeeModal").modal("toggle");
        $.ajax({
            url: "libs/php/deletePersonnel.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function() {
                $("#deleteConfirmation").off();
                checkState();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        
    })
}

const locationEdit = (id) => {
    $("#manageLocationsDetails > div.modal-header > h5").text("Edit location")
    $("#locationSpanError").text("");
    $("#locationsFooter").html(`
            <button type="button" class="btn btn-success" id="confirmUpdatingLocation">Confirm</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            
        `);

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
            $("#locationName").val(locationName);
            $("#locationText").text("Location");
            $("#manageLocationsModal").modal("show");

            $("#confirmUpdatingLocation").on("click", function(){
                if($("#locationName").val() === "" || !$("#locationName").val().match(/^([^0-9]*)$/)){
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
                            name: $("#locationName").val(),
                            id: id
                        },  
                        success: function() {
                            $("#manageLocationsModal").modal("toggle");
                            checkState();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
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
            $("#departmentsFooter").html(`
                <button type="button" class="btn btn-success" id="editDepartmentConfirmation">Confirm</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                
            `);
            $("#addDepartmentDetails > div.modal-header > h5").text("Edit department")
            $("#departmentName").val(result.data[0].name);
            $("#manageDepartmentsModal").modal("show");

            populateLocationsDropdown("#locationsDropdown", "selection", ()=> {
                $("#locationsDropdown").val(result.data[0].locationID).change();
            })
            
            $("#editDepartmentConfirmation").on("click", function() {
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
                            checkState();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    }); 
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
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
    } else {
        $("#departmentNameError").text("");
    }
    if(location === "location") {
        $("#locationSpanError").text("Location is invalid.").css(cssError);
    } else {
        $("#locationSpanError").text("");
    }
}

// SEARCH FUNCTON
// DESKTOP
$("#searchButton").on("click", function(event){
    let searchText = $("#searchBar").val()
    let locationFilter = $("#locationFilter").val()
    let departmentFilter = $("#departmentFilter").val()
    event.preventDefault()
    // Render table for emloyees
    if(state != "all") {
        state = "all";
        checkState();
    }
    
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
            $("#tableBody").empty()
            $("#myMobileTable > tbody").empty()
            result.data.forEach(element => {
                let id = element.id;
                $("#tableBody")
                .append(
                    `<tr id="tableHeaderNames">
                        <td>${element.lastName}, ${element.firstName}</td>
                        <td class="smallDisplays">${element.email}</td>
                        <td class="smallDisplays">${element.location}</td>
                        <td class="smallDisplays">${element.department}</td>
                        <td class=""rightAlignEmployees">
                            <button type="button" class="btn btn-warning edit" id="edit${element.id}">Edit</button>
                        </td>
                        <td class=""rightAlignEmployees">
                            <button type="button" class="btn btn-danger delete" id="delete${element.id}">Delete</button>
                        </td>
                    </tr>`
                );
                //OPEN MODAL AND EDIT EMPLOYEE
                $(`#edit${element.id}`).on("click", ()=> {
                    employeeEdit(id);
                })
                //OPEN MODAL AND DELETE EMPLOYEE
                $(`#delete${id}`).on("click", ()=> {
                    employeeDelete(id);
                })
            });
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
})
// MOBILE
$("#searchButtonMobile").on("click", function(event){
    let searchText = $("#searchBarMobile").val();
    let locationFilter = $("#locationFilterMobile").val();
    let departmentFilter = $("#departmentFilterMobile").val();

    event.preventDefault()
    // Render table for emloyees
    if(state != "all") {
        state = "all";
        checkState();
    }
    
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
            $("#tableBody").empty()
            $("#myMobileTable > tbody").empty()
            result.data.forEach(element => {
                let id = element.id;
                $("#tableBody")
                .append(
                    `<tr id="tableHeaderNames">
                        <td>${element.lastName}, ${element.firstName}</td>
                        <td class="smallDisplays">${element.email}</td>
                        <td class="smallDisplays">${element.location}</td>
                        <td class="smallDisplays">${element.department}</td>
                        <td class="rightAlignEmployees">
                            <button type="button" class="btn btn-warning edit" id="edit${element.id}">Edit</button>
                        </td>
                        <td class="rightAlignEmployees">
                            <button type="button" class="btn btn-danger delete" id="delete${element.id}">Delete</button>
                        </td>
                    </tr>`
                );
                //OPEN MODAL AND EDIT EMPLOYEE
                $(`#edit${element.id}`).on("click", ()=> {
                    employeeEdit(id);
                })
                //OPEN MODAL AND DELETE EMPLOYEE
                $(`#delete${id}`).on("click", ()=> {
                    employeeDelete(id);
                })
            });
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
})

$(".resetButton").on("click", (event) =>{
    event.preventDefault();
    state = "all";
    checkState();
})
// VARIABLES
let cssError = {
        color: "red",
        "font-size": "0.9em"
    };
   