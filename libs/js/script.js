let state = "all";
// INITIAL LOAD
$(function(){
    checkState();
})


//GET ALL EMPLOYEES AND DEFINE ADD EMPLOYEE
$("#getEmployees").on("click", () =>{
    if(state != "all") {
        state = "all";
        checkState()
    }
    
    
})

//GET ALL LOCATIONS AND DEFINE ADD LOCATION
$("#getLocations").on("click", () =>{
    state = "location";
    checkState();
})

// GET ALL DEPARTMENTS AND DEFINE ADD DEPARTMENT
$("#getDepartments").on("click", () =>{
    state = "departments";
    checkState();
})

// CHANGE TABLE HEADER, ADD, EDIT AND BODY ACCORDING TO STATE
const checkState = () => {
    switch(state) {

     case "all":
         
        $(".table").html(`
        <thead class="sticky-top border-bottom" id="headingSelection">
        <tr id="tableHeaderNames">
        <th scope="col">Name</th>
        <th scope="col">Location</th>
        <th scope="col">Department</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `)

        changeButton("addEmployee", "Add Employees")
        $("#searchBar").val("").change()
        populateEmployees()
         
       break;

     case "departments":

        $(".table").html(`
        <thead class="sticky-top border-bottom" id="headingSelection">
        <tr id="tableHeaderNames">
        <th scope="col">Department</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `)

        changeButton("addDepartments", "Add Departments")
        $("#searchBar").val("").change()
        populateDepartments();

       break;

     case "location":

        $(".table").html(`
        <thead class="sticky-top border-bottom" id="headingSelection">
        <tr id="tableHeaderNames">
        <th scope="col">Locations</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="tableBody"></tbody>
        `)

        changeButton("addLocations", "Add Locations")
        $("#searchBar").val("").change()
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
                    let id = element.id
                    $("#tableBody").append(`
                        <tr>
                            <td scope="Row">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning locationEdit" id="edit${id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger locationDelete" id="delete${id}">Delete</button>
                            </td>
                        </tr>
                    `)

                    $(`#edit${id}`).on("click", function() {
                        $("#locationSpanError").text("")
                        $("#locationsFooter").html(`
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-success" id="confirmUpdatingLocation">Confirm</button>
                            `)
                    
                        $.ajax({
                            url: "libs/php/getAlllocations.php",
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                action: "single",
                                id: id
                            },    
                            success: function(result) {
                                let locationName = result.data[0].name;
                                $("#locationName").val(locationName);
                                $("#locationText").text("Location:");
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
                        
                    });
                    // CHECK DEPENDANCY BEFORE DELETING
                    $(`#delete${id}`).on("click", ()=> {
                        checkDepencency(id, "location")
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
    $("#addLocations").on("click", function(){
        $("#manageLocationsModal").modal("show");
        $("#locationText").text("Add Location:")
        $("#locationName").val("")
        $("#locationSpanError")
            .text("")
        $("#locationsFooter").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" id="confirmAddingLocation">Confirm</button>
        `)
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
                        $("#confirmAddingLocation").off()
                        $("#manageLocationsModal").modal("hide")
                        checkState()
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
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
                            <td scope="Row">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning departmentEdit" id="edit${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger departmentDelete" id="delete${element.id}">Delete</button>
                            </td>
                        </tr>
                    `)
                    $(`#edit${element.id}`).on("click", ()=> {
                        let department = element.id
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
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-success" id="editDepartmentConfirmation">Confirm</button>
                                `)          

                                $("#departmentName").val(result.data[0].name)
                                $("#manageDepartmentsModal").modal("show");

                                populateLocationsDropdown("#locationsDropdown", ()=> {
                                    $("#locationsDropdown").val(result.data[0].locationID).change()
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
                                                $("#manageDepartmentsModal").modal("hide")
                                                checkState()
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
                    })
                     // CHECK DEPENDANCY BEFORE DELETING
                    $(`#delete${element.id}`).on("click", ()=> {
                        checkDepencency(element.id, "department")
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
    $("#addDepartments").on("click", function(){
        $("#manageDepartmentsModal").modal("show");
        populateLocationsDropdown("#locationsDropdown")
        $("#departmentName").val("")
        $("#departmentNameError").text("")
        $("#departmentsFooter").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" id="addDepartmentConfirmation">Confirm</button>
        `)
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
                        $("#manageDepartmentsModal").modal("hide")
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
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
                        <tr id="tableHeaderNames">
                            <td>${element.firstName} ${element.lastName}</td>
                            <td>${element.location}</td>
                            <td>${element.department}</td>
                            <td>
                                <button type="button" class="btn btn-warning edit" id="edit${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger delete" id="delete${element.id}">Delete</button>
                            </td>
                        </tr>
                    `)

                    // EDIT EMPLOYEES ONCLICK FUNCTION
                    $(`#edit${element.id}`).on("click", ()=> {
                        let personnelData;
                        $("#nameError, #lastNameError, #emailError").text("")
                        $("#mangeEmployeesFooter").html(`
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary"  id="editEmployeeConfirm">Confirm</button>
                        `)
                    
                        $.ajax({
                            url: "libs/php/getPersonnelByID.php",
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                id: id
                            },
                            success: function(result) {
                                personnelData = result
                                
                                $("#manageEmployeesModal").modal("show")
                                $("#firstName").val(personnelData.data.personnel[0].firstName)
                                $("#lastName").val(personnelData.data.personnel[0].lastName)
                                $("#email").val(personnelData.data.personnel[0].email)
                                setInterval(() => {
                                    $("#employeeLocation").on("change", () => {
                                    getDepartmentsOfLocation($("#employeeLocation").val(), "#employeeDepartment")
                                })
                                }, 1000);
                                
                                let employeeDepartmentID = (personnelData.data.personnel[0].departmentID -1);
                                let employeeCity = result.data.department[employeeDepartmentID].locationID;

                                populateLocationsDropdown("#addEmployeeLocation", ()=>{
                                    $("#addEmployeeLocation").val(employeeCity).change()
                                })
                                getDepartmentsOfLocation(employeeCity, "#addDepartments", ()=> {
                                    $("#addDepartments").val(result.data.personnel[0].departmentID).change()
                                })
                                
                                // CHECK INPUT FIELDS ARE VALID
                                
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
                                        $("#nameError").text("")
                                        editFirstName = ""
                                    }
                                    if($("#lastName").val() === "") {
                                        editLastName = "Please provide a last name."
                                        $("#lastNameError")
                                        .css(cssError)
                                        .text(editLastName)
                                    } else {
                                        $("#lastNameError").text("")
                                        editLastName = ""
                                    }
                                    if($("#email").val() === "") {
                                        editEmail = "Please enter an email address."
                                        $("#emailError")
                                        .css(cssError)
                                        .text(editEmail)
                                    } else {
                                        if(validateEmail($("#email").val())){
                                            $("#emailError")
                                            .text("")
                                            editEmail = ""
                                        } else{
                                            editEmail = "Please provide a valid email address."
                                            $("#emailError")
                                            .css(cssError)
                                            .text(editEmail)
                                        }
                                        
                                    }
                                    if(editFirstName != "" || editLastName != "" || editEmail != "") {
                                        return false
                                    } else {
                                        // UPDATE EMPLOYEE DEATAILS
                                        event.preventDefault()
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
                                                checkState()
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
                    })

                    //OPEN MODAL AND DELETE EMPLOYEE
                    $(`#delete${id}`).on("click", ()=> {
                        $("#cannotDeleteImg").hide()
                        $("#deleteBody > h5").show()
                        $("#deleteBody > h5").text("Are you sure?")
                        $("#deleteBody > p").text("Do you really want to delete this record? This process cannot be undone.")
                        $("#deleteConfirmation").css({display: "block"})

                        $('#deleteEmployeeModal').modal("show");
                    
                        // DELETE EMPLOYEE FROM DB
                        $("#deleteConfirmation").on("click", function(){
                            $("#deleteEmployeeModal").modal("toggle")
                            $.ajax({
                                url: "libs/php/deletePersonnel.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    id: id
                                },
                                success: function() {
                                    checkState()
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                }
                            });
                            
                        })
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
    $("#addEmployee").on("click", function(){
        let id;
        $("#manageEmployeesModal").modal("show")
        $("#nameError, #lastNameError, #emailError").text("")
        $("#firstName, #lastName, #email").val("")
        $("#mangeEmployeesFooter").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary"  id="createNewEmployee">Confirm</button>
        `)
        $("#addEmployeeLocation").on("change", function(){
            id = this.value
        })
        $("#addEmployeeLocation").on("change", ()=> {
            getDepartmentsOfLocation(id, "#addDepartments")
        })
        populateLocationsDropdown("#addEmployeeLocation")
        getDepartmentsOfLocation(1, "#addDepartments")

        $("#createNewEmployee").on("click", function(event){
            event.preventDefault();
            let firstName = "";
            let lastName = "";
            let email = "";
            if($("#firstName").val() === "") {
                firstName = "Please provide a first name."
                $("#nameError")
                .css(cssError)
                .text(firstName)
            } else {
                $("#nameError").text("")
                firstName = ""
            }
            // test
            if($("#lastName").val() === "") {
                lastName = "Please provide a last name."
                $("#lastNameError")
                .css(cssError)
                .text(lastName)
            } else {
                $("#lastNameError").text("")
                lastName = ""
            }
            // if($("#lastName").val() === "") {
            //     lastName = "Please provide a last name."
            //     $("#lastNameError")
            //     .css(cssError)
            //     .text(lastName)
            // } else {
            //     $("#LastNameError").text("")
            //     lastName = ""
            // }
            if($("#email").val() === "") {
                email = "Please enter an email address."
                $("#emailError")
                .css(cssError)
                .text(email)
            } else {
                if(validateEmail($("#email").val())){
                    $("#emailError").text("")
                    email = ""
                } else{
                    email = "Please provide a valid email address."
                    $("#emailError")
                    .css(cssError)
                    .text(email)
                }
                
            }
            if(firstName != "" || lastName != "" || email != "") {
                return false
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
                        checkState()
                        $("#manageEmployeesModal").modal("toggle")
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                }); 
            }
        })
    })
}

// HELPER FUNCTIONS
const populateLocationsDropdown = (idSelector, callback) => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "all"
        },  
        success: function(result) {
            $(`${idSelector}`).find("option")
            .remove()
            let data = result.data
            data.forEach(location => {
                $("<option>", {
                    value: location.id,
                    text: location.name
                }).appendTo(idSelector)
                
            })
            if(callback){
                callback()
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

const getDepartmentsOfLocation = (locationID, idSelector, callback) => {
    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "byLocation",
            id: locationID
        },  
        success: function(result) {
            $(`${idSelector}`).find("option")
            .remove()

            let data = result.data
            data.forEach(location => {
                $("<option>", {
                    value: location.id,
                    text: location.name
                }).appendTo(idSelector)
                if(callback) {
                    callback()
                }
            })
        
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

const checkDepencency = (value, target) => {
    $.ajax({
        url: "libs/php/checkDependencies.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: target,
            search: value,
        },  
        success: function(result) {

            $('#deleteEmployeeModal').modal("show");
            data = result.data;
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
                
            
            if(data.length != 0 ) {
                $("#deleteBody > p").text(errorMessage)
                $("#deleteConfirmation").hide()
                $("#deleteBody > h5").hide()
                $("#cannotDeleteImg").show()
            } else {
                $("#cannotDeleteImg").hide()
                $("#deleteBody > h5").text("Are you sure?").show()
                $("#deleteBody > p").text("Do you really want to delete this record? This process cannot be undone.")
                // $("#deleteFooter").append('<button type="button" class="btn btn-danger" id="deleteConfirmation">Delete</button>')
                $("#deleteConfirmation").css({display: "block"})

                $("#deleteConfirmation").on("click", function(){
                    $("#deleteEmployeeModal").modal("hide")
                    $.ajax({
                        url: routine,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            id: value
                        },
                        success: function() {
                            $("#deleteConfirmation").off()
                            checkState()
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
    $("#changeButton").html(`
        <button type="button" class="btn btn-dark" id="${idName}">${buttonText}</button>
    `)
    
}

//   SEARCH FUNCTON
$("#searchButton").on("click", function(event){
    event.preventDefault()
    if(state != "" && state != "all") {
        state = ""
        checkState()
    }
    
    $.ajax({
        url: "libs/php/searchPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: $("#searchOptions").val(),
            search: $("#searchBar").val(),
        },  
        success: function(result) {
            
            $("#tableBody").empty()
            result.data.forEach(element => {
                $("#tableBody")
                .append(
                    `<tr id="tableHeaderNames">
                        <td>${element.firstName} ${element.lastName}</td>
                        <td>${element.location}</td>
                        <td>${element.department}</td>
                        <td>
                            <button type="button" class="btn btn-warning edit" id="${element.id}">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger delete" id="${element.id}">Delete</button>
                        </td>
                    </tr>`)
                
            })
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
})

// VARIABLES
let cssError = {
        color: "red",
        "font-size": "0.9em"
    };