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

	if($_POST["action"] === "single") {

		$query = $conn->prepare('SELECT name, id FROM location WHERE id =  ?');

		$query->bind_param("i", $_POST['id']);
	
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
		
		mysqli_close($conn);

		echo json_encode($output);

	} elseif($_POST["action"] === "all"){

		// SQL does not accept parameters and so is not prepared

		$query = 'SELECT name, id FROM location ORDER BY location.name ASC';

		$result = $conn->query($query);
		
		if (!$result) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;

		}
		
			$data = [];

		while ($row = mysqli_fetch_assoc($result)) {

			array_push($data, $row);

		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $data;
		
		mysqli_close($conn);

		echo json_encode($output); 

	}

	

?>