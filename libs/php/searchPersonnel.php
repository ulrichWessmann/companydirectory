<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

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

	// SQL does not accept parameters and so is not prepared

	if($_REQUEST["action"] === "all"){
		// Search both first and last name fields
		$search = preg_replace('/\s+/', '%', $_REQUEST['search']);
		
		$query = $conn->prepare('SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE CONCAT(firstName, " ", lastName) LIKE "'.$search.'%" ORDER BY p.lastName, p.firstName, d.name, l.name');

		// $query->bind_param("ss", $_REQUEST['search'], $_REQUEST['search2']);
	
		$query->execute();
		
		if (false === $query) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			echo json_encode($output); 
		
			mysqli_close($conn);
			exit;
	
		}
	
		$result = $query->get_result();
	
			 $data = [];
	
		while ($row = mysqli_fetch_assoc($result)) {
	
			array_push($data, $row);
	
		}
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $data;
	
		echo json_encode($output); 
	
		mysqli_close($conn);

	} elseif($_REQUEST["action"] === "firstName"){

		$query = $conn->prepare('SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE firstName LIKE "'.$_REQUEST['search'].'%" ORDER BY p.lastName, p.firstName, d.name, l.name');

		// $query->bind_param("s", $_REQUEST['search']);
	
		$query->execute();
		
		if (false === $query) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			echo json_encode($output); 
		
			mysqli_close($conn);
			exit;
	
		}
	
		$result = $query->get_result();
	
			 $data = [];
	
		while ($row = mysqli_fetch_assoc($result)) {
	
			array_push($data, $row);
	
		}
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $data;
	
		echo json_encode($output); 
	
		mysqli_close($conn);

	} elseif($_REQUEST["action"]  === "lastName"){


		$query = $conn->prepare('SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE lastName LIKE "'.$_REQUEST['search'].'%" ORDER BY p.lastName, p.firstName, d.name, l.name');

		// $query->bind_param("s", $_REQUEST['search']);
	
		$query->execute();
		
		if (false === $query) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			echo json_encode($output); 
		
			mysqli_close($conn);
			exit;
	
		}
	
		$result = $query->get_result();
	
			 $data = [];
	
		while ($row = mysqli_fetch_assoc($result)) {
	
			array_push($data, $row);
	
		}
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $data;
	
		echo json_encode($output); 
	
		mysqli_close($conn);

	}
	
		
	

?>