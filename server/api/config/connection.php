<?php
    function getConnection(){
        $servername = "localhost";
        $dbname = "myplan";
        $username = "root";
        $password = "";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        $conn->set_charset("utf8");

        // Check connection
        if ($conn->connect_error) {
            return false;
            //die("Connection failed: " . $conn->connect_error);
        } 
        return $conn;
        //echo "Connected successfully";
    }
?>