let state = "all";


$(function(){
    // INITIAL LOAD
    checkState();
    changeButton("addEmployee", "Add Employees")
})


//GET ALL EMPLOYEES
$("#getEmployees").on("click", () =>{
    state = "all";
    checkState()
    $("#searchBar").val("").change()
})

const personnel = () => {
    $.ajax({
        url: "libs/php/getAll.php",
        type: 'POST',
        dataType: 'json',
        data: {
        },
        success: function(result) {
            
            if (result.status.name == "ok") {
                
                changeButton("addEmployee", "Add Employees")
                addEmployee()
                let users = result.data;
                users.forEach(element => {
                    $("#tableBody").append(`
                        <tr id="tableHeaderNames">
                            <td>${element.firstName} ${element.lastName}</td>
                            <td>${element.location}</td>
                            <td>${element.department}</td>
                            <td>
                                <button type="button" class="btn btn-warning edit" id="${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger delete" id="${element.id}">Delete</button>
                            </td>
                        </tr>
                    `)
                });
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    }); 
}



//GET LOCATIONS
$("#getLocations").on("click", () =>{
    state = "location";
    checkState();
    changeButton("addLocations", "Add Locations")
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
                console.log("addLocation")
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
    $("#searchBar").val("").change()
    

})

// GET DEPARTMENTS
$("#getDepartments").on("click", () =>{
    state = "departments";
    checkState();
    changeButton("addDepartments", "Add Departments")
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
                        console.log("add department---test")
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
    $("#searchBar").val("").change()
})

// Edit Departments
$(document).on("click", ".departmentEdit", function() {
    let department = this.id

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
                            console.log("one two three")
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
});

// EDIT EMPLOYEES
$(document).on("click", ".edit", function() {
    let id = this.id
    let personnelData;
    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {
            
            
            personnelData = result
            
            $("#newEmployeeModal").modal("show")
            // $("#employeeInformation").html(`
            //     <div class="modal-header">
            //         <h5 class="modal-title" id="exampleModalLabel">Update Personnel</h5>
            //         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            //     </div>
            //     <div class="modal-body">
            //     <form>
            //         <div class="mb-3">
            //             <label for="editFirstName" class="form-label">First name:</label>
            //             <input type="text" class="form-control" id="editFirstName" value="${personnelData.data.personnel[0].firstName}">
            //             <span></span>
            //         </div>
            //         <div class="mb-3">
            //             <label for="editLastName" class="form-label">Last name:</label>
            //             <input type="text" class="form-control" id="editLastName" value="${personnelData.data.personnel[0].lastName}">
            //             <span></span>
            //         </div>
            //         <div class="mb-3">
            //             <label for="editEmail" class="form-label">Email:</label>
            //             <input type="email" class="form-control" id="editEmail" value="${personnelData.data.personnel[0].email}">
            //             <span></span>
            //         </div>

            //         <h5>Select Location:</h5>
            //         <select class="form-select" id="employeeLocation" required></select>
                    
            //         <br>

                
            //         <h5>Department:</h5>
            //         <select class="form-select" id="employeeDepartment" required></select><br>

            //         <div class="modal-footer border-top-0">
            //         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            //         <button type="button" class="btn btn-primary" id="updateEmployee">Save changes</button>                    
            //     </div> 
            //     </form>
            //     </div> 
            // `);
            setInterval(() => {
                $("#employeeLocation").on("change", ()=> {
                getDepartmentsOfLocation($("#employeeLocation").val(), "#employeeDepartment")
            })
            }, 1000);
            
            let employeeDepartmentID = (personnelData.data.personnel[0].departmentID -1);
            let employeeCity = result.data.department[employeeDepartmentID].locationID
            console.log(employeeCity)
            console.log(result)
            
            populateLocationsDropdown("#employeeLocation", ()=>{
                $("#employeeLocation").val(employeeCity).change()
            })
            getDepartmentsOfLocation(employeeCity, "#employeeDepartment", ()=> {
                $("#employeeDepartment").val(result.data.personnel[0].departmentID).change()
            })
            
            // UPDATE DB
            
            $("#updateEmployee").on("click", function(event) {

                let editFirstName = "";
                let editLastName = "";
                let editEmail = "";
                if($("#editFirstName").val() === "") {
                    editFirstName = "Please provide a first name."
                    $("#employeeInformation > div.modal-body > form > div:nth-child(1) > span")
                    .css(cssError)
                    .text(editFirstName)
                } else {
                    $("#employeeInformation > div.modal-body > form > div:nth-child(1) > span").text("")
                    editFirstName = ""
                }
                if($("#editLastName").val() === "") {
                    editLastName = "Please provide a last name."
                    $("#employeeInformation > div.modal-body > form > div:nth-child(2) > span")
                    .css(cssError)
                    .text(editLastName)
                } else {
                    $("#employeeInformation > div.modal-body > form > div:nth-child(2) > span")
                    .text("")
                    editLastName = ""
                }
                if($("#editEmail").val() === "") {
                    editEmail = "Please enter an email address."
                    $("#employeeInformation > div.modal-body > form > div:nth-child(3) > span")
                    .css(cssError)
                    .text(editEmail)
                } else {
                    if(validateEmail($("#editEmail").val())){
                        $("#employeeInformation > div.modal-body > form > div:nth-child(3) > span")
                        .text("")
                        editEmail = ""
                    } else{
                        editEmail = "Please provide a valid email address."
                        $("#employeeInformation > div.modal-body > form > div:nth-child(3) > span")
                        .css(cssError)
                        .text(editEmail)
                    }
                    
                }
                if(editFirstName != "" || editLastName != "" || editEmail != "") {
                    return false
                } else { 
                    event.preventDefault()
                    $("#editEmployeeModal").modal("toggle")
                    $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "employee",
                            firstName: $("#editFirstName").val(),
                            lastName: $("#editLastName").val(),
                            email: $("#editEmail").val(),
                            departmentID: $("#employeeDepartment").val(),
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
    
});

// DELETE EMPLOYEE

$(document).on("click", ".delete", function() {
    let employeeID = this.id
    $("#deleteBody > h5").text("Are you sure?")
    $("#deleteBody > p").text("Do you really want to delete this record? This process cannot be undone.")
    $("#deleteConfirmation").css({display: "block"})

    $('#deleteEmployeeModal').modal("show");
   
    // Confirmation of delete
    $("#deleteConfirmation").on("click", function(){
        $("#deleteEmployeeModal").modal("toggle")
        $.ajax({
            url: "libs/php/deletePersonnel.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: employeeID
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
});

// DELETE LOCATION
$(document).on("click", ".locationDelete", function() {
    let id = this.id
    checkDepencency(id, "location")
});

// DELETE DEPARTMENT
$(document).on("click", ".departmentDelete", function() {
    let id = this.id
    checkDepencency(id, "department")
});

// SET TABLE HEAD ACCORDING TO STATE
const checkState = () => {
    switch(state) {

     case (""):
         
        if($("#tableHeaderNames")){
           $("#tableHeaderNames").remove();
           $("#tableBody").remove() 
        }
         
        $("#headingSelection").append(`
        <tr class="border-bottom" id="tableHeaderNames">
           <th scope="col">Name</th>
           <th scope="col">Location</th>
           <th scope="col">Department</th>
           <th scope="col"></th>
           <th scope="col"></th>
        </tr>
        `)

        $(".table").append('<tbody id="tableBody"></tbody>')
        
       break;

     case ("all"):
         
        if($("#tableHeaderNames")){
           $("#tableHeaderNames").remove();
           $("#tableBody").remove() 
        }
        
        $("#headingSelection").append(`
        <tr id="tableHeaderNames">
        <th scope="col">Name</th>
        <th scope="col">Location</th>
        <th scope="col">Department</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        `)

        $(".table").append('<tbody id="tableBody"></tbody>')
        personnel()
         
       break;

     case "departments":
         
        if($("#tableHeaderNames")){
            $("#tableHeaderNames").remove();
            $("#tableBody").remove();
        }

        $("#headingSelection").append(`
        <tr id="tableHeaderNames">
        <th scope="col">Department</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        `)

        $(".table").append('<tbody id="tableBody"></tbody>')
        populateDepartments();
       break;

     case "location":
         
        if($("#tableHeaderNames")){
            $("#tableHeaderNames").remove();
            $("#tableBody").remove();
        }

        $("#headingSelection").append(`
        <tr id="tableHeaderNames">
        <th scope="col">Locations</th>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
        `)

        $(".table").append('<tbody id="tableBody"></tbody>')
        populateLocations();
       break;
     default:
         
     } 
 };

const changeButton = (idName, buttonText) => {
    $("#changeButton").html(`
        <button type="button" class="btn btn-dark" id="${idName}">${buttonText}</button>
    `)
    
}
//
// ADD EMPLOYEE
const addEmployee = () => {
    $("#addEmployee").on("click", function(){
        let id;
        $("#newEmployeeModal").modal("show")
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
                $("#formTest > div:nth-child(1) > span")
                .css(cssError)
                .text(firstName)
            } else {
                $("#formTest > div:nth-child(1) > span").text("")
                firstName = ""
            }
            if($("#lastName").val() === "") {
                lastName = "Please provide a last name."
                $("#formTest > div:nth-child(2) > span")
                .css(cssError)
                .text(lastName)
            } else {
                $("#formTest > div:nth-child(2) > span").text("")
                lastName = ""
            }
            if($("#email").val() === "") {
                email = "Please enter an email address."
                $("#formTest > div:nth-child(3) > span")
                .css(cssError)
                .text(email)
            } else {
                if(validateEmail($("#email").val())){
                    $("#formTest > div:nth-child(3) > span").text("")
                    email = ""
                } else{
                    email = "Please provide a valid email address."
                    $("#formTest > div:nth-child(3) > span")
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
                        console.log("employee added")
                        checkState()
                        $("#newEmployeeModal").modal("toggle")
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

// AJAX CALL

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
                                <button type="button" class="btn btn-danger locationDelete" id="${id}">Delete</button>
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
                    $(`#delete${id}`).on("click", ()=> {
                        checkDepencency()
                    })
                });
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
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
                    $("#tableBody").append(`
                        <tr>
                            <td scope="Row">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning departmentEdit" id="${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger departmentDelete" id="${element.id}">Delete</button>
                            </td>
                        </tr>
                    `)

                    //
                    
                });
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

// FUNCTIONS
const populateLocationsDropdown = (idSelector, callback) => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "all"
        },  
        success: function(result) {
            
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
                $("#deleteBody > h5").text("Error")
                $("#deleteBody > p").text(errorMessage)
                $("#deleteConfirmation").hide()
            } else {
                $("#deleteBody > h5").text("Are you sure?")
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

let cssError = {
        color: "red",
        "font-size": "0.9em"
    };