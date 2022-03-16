<?php

	$executionStartTime = microtime(true);
	
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

	// UPDATE DEPARTMENT BY ID
	if( $_POST['action'] === "department" ){

		if(strlen($_POST['name']) > 30) {
			array_push($errorArray,"department");
		}
		if(count($errorArray) > 0) {	
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
		$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

		$query->bind_param("sii", $_POST['name'], $_POST['locationID'], $_POST['id']);

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
	} 

	// UPDATE LOCATIONS
	elseif( $_POST['action'] === "location" ){
		if(strlen($_POST['name']) > 30) {
			array_push($errorArray,"location");
		}
		if(count($errorArray) > 0) {	
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
		$query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');

		$query->bind_param("si", $_POST['name'], $_POST['id']);

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

		

	}

	elseif( $_POST['action'] === "employee" ){

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
			$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?,  email = ?, departmentID = ? WHERE id = ?');

		$query->bind_param("sssii", $_POST['firstName'],  $_POST['lastName'], $_POST['email'], $_POST['departmentID'], $_POST['id']);

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
		

	}
	
?>