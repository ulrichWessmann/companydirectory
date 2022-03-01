<?php

	$executionStartTime = microtime(true);
	
	// this includes the login details
	
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
	
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$errorArray = [];

	if(strlen($_POST['firstName']) > 25) {
		array_push($errorArray,"name");
	}
	if(strlen($_POST['lastName']) > 25){
		array_push($errorArray,"lastName");
	}
	if(strlen($_POST['email']) > 30){
		array_push($errorArray,"email");
	}
	if(count($errorArray) > 0) {	//check array length

		http_response_code(300);

		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "unable to add to database";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $errorArray;

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	} else {
		// SQL statement accepts parameters and so is prepared to avoid SQL injection.

		$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES(?,?,?,?)');

		$query->bind_param("sssi", $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['locationID']);

		$query->execute();
		
		if (false === $query) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;

		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);

		echo json_encode($output); 
		}

	

?>