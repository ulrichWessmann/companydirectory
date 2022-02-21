let state = "";


$(function(){
    // INITIAL LOAD
    personnel();
    changeButton("addEmployee", "Add Employees")
        
})


//GET ALL EMPLOYEES
$("#getEmployees").on("click", () =>{
    state = "all";
    personnel();
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
                
                checkState();
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

// GET DEPARTMENTS
$("#getDepartments").on("click", () =>{
    state = "departments";
    
    changeButton("addDepartments", "Add Departments")
    addDepartments()
    checkState();
})

//GET LOCATIONS
$("#getLocations").on("click", () =>{
    state = "location";
    
    changeButton("addLocations", "Add Locations")
    addLocations();
    checkState();
    
})

// EDIT LOCATIONS

$(document).on("click", ".locationEdit", function() {
    
    let user = this.id
    console.log(user)
    $.ajax({
        url: "libs/php/getAlllocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
            action: "single",
            id: user

        },    
        success: function(result) {
            
            if (result.status.name == "ok") {

                $("#manageLocationsDetails").html(`
                <div class="modal-header border-bottom-0" >             
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <h5>Location:</h5>
                    <input type="text" class="form-control" id="locationValue" value="${result.data[0].name}">
                </div>
                <div class="modal-footer justify-content-center border-top-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="editLocations">Confirm</button>
                </div>
                `)
                $("#manageLocationsModal").modal("show");
                $("#editLocations").on("click", function(){
                    $("#manageLocationsModal").modal("toggle")
                    $.ajax({
                        url: `libs/php/updateHandler.php`,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: "location",
                            name: $("#locationValue").val(),
                            id: user
                        },  
                        success: function(result) {
                            // add success logic here
                            console.log("success")
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
    
    

});

// DEPARTMENTS
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
            console.log(result)
            

            if (result.status.name == "ok") {
                $("#manageLocationsDetails").html(`
                <div class="modal-header border-bottom-0" >             
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <h5>Department:</h5>
                    <input type="text" class="form-control" id="locationValue" value="${result.data[0].name}">
                    <h5>Department location:</h5>
                    <select class="form-select" aria-label="Locations selection" id="locationsDropdown">
                    </select>
                </div>
                <div class="modal-footer justify-content-center border-top-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="departmentUpdate">Update</button>
                </div>
                `)
                $("#manageLocationsModal").modal("show");

            }
            populateLocationsDropdown("#locationsDropdown", ()=> {
                $("#locationsDropdown").val(result.data[0].locationID).change()
            })
            
            $("#departmentUpdate").on("click", function() {
                $("#manageLocationsModal").modal("toggle")
                $.ajax({
                    url: `libs/php/updateHandler.php`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: "department",
                        name: $("#locationValue").val(),
                        locationID: $("#locationsDropdown").val(),
                        id: department
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
            
            $("#editEmployeeModal").modal("show")
            $("#employeeInformation").html(`
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Personnel</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="firstName" class="form-label">First name:</label>
                        <input type="text" class="form-control" id="firstName" value="${personnelData.data.personnel[0].firstName}">
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Last name:</label>
                        <input type="text" class="form-control" id="lastName" value="${personnelData.data.personnel[0].lastName}">
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="email" value="${personnelData.data.personnel[0].email}">
                    </div>

                    <h5>Select Location:</h5>
                    <select class="form-select" id="employeeLocation" required></select>
                    
                    <br>

                
                    <h5>Department:</h5>
                    <select class="form-select" id="employeeDepartment" required></select><br>

                    <div class="modal-footer border-top-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="updateEmployee">Save changes</button>                    
                </div> 
                </form>
                </div> 
            `);
            setInterval(() => {
                $("#employeeLocation").on("change", ()=> {
                getDepartmentsOfLocation($("#employeeLocation").val(), "#employeeDepartment")
            })
            }, 1000);
            
            let employeeDepartmentID = (personnelData.data.personnel[0].departmentID -1);
            let employeeCity = result.data.department[employeeDepartmentID].locationID
            
            populateLocationsDropdown("#employeeLocation", ()=>{
                $("#employeeLocation").val(employeeCity).change()
            })
            getDepartmentsOfLocation(employeeCity, "#employeeDepartment", ()=> {
                $("#employeeDepartment").val(result.data.personnel[0].departmentID).change()
            })
            
            // UPDATE DB
            
            $("#updateEmployee").on("click", function(event) {
                event.preventDefault()
                $("#editEmployeeModal").modal("toggle")
                $.ajax({
                    url: `libs/php/updateHandler.php`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: "employee",
                        firstName: $("#firstName").val(),
                        lastName: $("#lastName").val(),
                        email: $("#email").val(),
                        departmentID: $("#employeeDepartment").val(),
                        id: id
                    },  
                    success: function() {
                        personnel()
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
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
    let id = this.id

    $("#deleteBox").html(`
        <div class="modal-header border-bottom-0" >
                    
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ">
            <h5 class="modal-title text-center" id="exampleModalLabel">Are you sure?</h5><br>
            <p class="text-center">Do you really want to delete this record? This process cannot be undone.</p>
        </div>
        <div class="modal-footer justify-content-center border-top-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="deleteConfirmation">Delete</button>
        </div>
    `)

    $('#deleteEmployeeModal').modal("show");
    console.log("this is delete employee")
   
    // Confirmation of delete
    $("#deleteConfirmation").on("click", function(){
        // console.log(id)
        console.log("this is delete employee confirmation")
       
        $("#deleteEmployeeModal").modal("toggle")
        // AJAX call to DB
        // $.ajax({
        //     url: "libs/php/getPersonnelByID.php",
        //     type: 'POST',
        //     dataType: 'json',
        //     data: {
        //         id: this.id
        //     },
        //     success: function(result) {

                


        //     },
        //     error: function(jqXHR, textStatus, errorThrown) {
        //         console.log(textStatus);
        //         console.log(errorThrown);
        //     }
        // });
        
    })
});

// DELETE LOCATION
$(document).on("click", ".locationDelete", function() {
    let id = this.id

    $("#deleteBox").html(`
        <div class="modal-header border-bottom-0" >
                    
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ">
            <h5 class="modal-title text-center" id="exampleModalLabel">Are you sure?</h5><br>
            <p class="text-center">Do you really want to delete this record? This process cannot be undone.</p>
        </div>
        <div class="modal-footer justify-content-center border-top-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="deleteConfirmation">Delete</button>
        </div>
    `)

    $('#deleteEmployeeModal').modal("show");
    $("#deleteConfirmation").on("click", function(){
        $("#deleteEmployeeModal").modal("toggle")
        $.ajax({
            url: "libs/php/deleteLocation.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(result) {
                checkState()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    })
});

// DELETE DEPARTMENT
$(document).on("click", ".departmentDelete", function() {
    let id = this.id

    $("#deleteBox").html(`
        <div class="modal-header border-bottom-0" >
                    
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ">
            <h5 class="modal-title text-center" id="exampleModalLabel">Are you sure?</h5><br>
            <p class="text-center">Do you really want to delete this record? This process cannot be undone.</p>
        </div>
        <div class="modal-footer justify-content-center border-top-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="deleteConfirmation">Delete</button>
        </div>
    `)

    $('#deleteEmployeeModal').modal("show");
    console.log("this is delete department")
   
    // Confirmation of delete
    $("#deleteConfirmation").on("click", function(){
        
        $("#deleteEmployeeModal").modal("toggle")
        // AJAX call to DB
        $.ajax({
            url: "libs/php/deleteDepartmentByID.php",
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

//
//  ADD FUNCTIONS
//

const changeButton = (idName, buttonText) => {
    $("#changeButton").html(`
        <button type="button" class="btn btn-dark" id="${idName}">${buttonText}</button>
    `)
    
}

// ADD EMPLOYEE
const addEmployee = () => {
    $("#addEmployee").on("click", function(){
        
        // create new employee modal
        $("#newEmployeeDetails").html(`
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Employee</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <form>
                <div class="mb-3">
                    <label for="firstName" class="form-label">First name:</label>
                    <input type="text" class="form-control" id="firstName">
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label">Last name:</label>
                    <input type="text" class="form-control" id="lastName">
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email">
                </div>
                <div class="mb-3">
                    <label for="location" class="form-label">Location:</label>
                    <select class="form-select" id="addEmployeeLocation" required></select>
                </div>
                <div class="mb-3">
                    <label for="department" class="form-label">Department:</label>
                    <select class="form-select" id="addDepartments" required></select>
                </div>
                <div class="modal-footer border-top-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add employee</button>
                </div> 
            </form>
            </div>
            
        `)
        let id;
        $("#addEmployeeLocation").on("change", function(){
            id = this.value
        })
        
        $("#newEmployeeModal").modal("show")
        populateLocationsDropdown("#addEmployeeLocation")
        getDepartmentsOfLocation(1, "#addDepartments")
        $("#addEmployeeLocation").on("change", ()=> {
            getDepartmentsOfLocation(id, "#addDepartments")
        })
    })
}


// ADD LOCATIONS

const addLocations = () => { //Added to dynamic field creating above
    $("#addLocations").on("click", function(){
    
    $("#manageLocationsDetails").html(`
        <div class="modal-header border-bottom-0" >             
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <h5>Add Location:</h5>
            <input type="text" class="form-control" id="locationName">
            <div id="alert"></div>
        </div>
        <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" id="addLocation">Confirm</button>
        </div>
    `)
    $("#manageLocationsModal").modal("show");
    $("#addLocation").on("click", function(){
        if($("#locationName").val() === "") {
            $("#alert").html($("<p>",{
                text: "Please enter the name of the location.",
                css: {
                    color: "red",
                    display: "block",
                    "font-size": "0.9em"
                }
            }
            ))
        } else {
            $.ajax({
                url: `libs/php/insertLocation.php`,
                type: 'POST',
                dataType: 'json',
                data: {
                    name: $("#locationName").val()
                },  
                success: function() {
                    console.log("success")
                    checkState()
                    $("#manageLocationsModal").modal("hide")
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

// ADD DEPARTMENT

const addDepartments = () => { //Added to dynamic field creating above
    $("#addDepartments").on("click", function(){
    
    $("#addDepartmentDetails").html(`
        <div class="modal-header border-bottom-0" >             
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ">
           
            <h5>Select Location:</h5>
            <select class="form-select" id="locationToChange" required></select>
            <br>

            <h5>Department:</h5>
            <input type="text" class="form-control" id="departmentName"><br>

        </div>
        <div class="modal-footer justify-content-center border-top-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="addDepartmentConfirmation">Confirm</button>
        </div>
    `)
    
    populateLocationsDropdown("#locationToChange")
    $("#manageDepartmentsModal").modal("show");

    $("#addDepartmentConfirmation").on("click", function(){ //post to DB
            $.ajax({
                url: `libs/php/insertDepartment.php`,
                type: 'POST',
                dataType: 'json',
                data: {
                    name: $("#departmentName").val(),
                    locationID: $("#locationToChange").val()
                },  
                success: function(result) {
                    // add success logic here
                    console.log("success")
                    checkState()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        })
    })
}

// AJAX REQUEST TO ADD DEPARTMENT TO DB
function postNewDepartment(phpRoutine, object) {
    
}
function postNewLocation() {
    console.log("test")
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
                    $("#tableBody").append(`
                        <tr>
                            <td scope="Row">${element.name}</td>
                            <td>
                                <button type="button" class="btn btn-warning locationEdit" id="${element.id}">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger locationDelete" id="${element.id}">Delete</button>
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