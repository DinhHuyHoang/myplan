<?php header('content-type: application/json; charset=utf-8');
    include_once './config/connection.php';

    switch($_GET["act"]){
        case "getNoteById":
            getNoteById($_GET["id"]);
            break;
        case "getTags":
            getTags();
            break;
        case "getNotes":
            getNotes();
            break;
        case "getSpecificNotesByDate":
            getSpecificNotesByDate($_GET["from"], $_GET["to"]);
            break;
        case "createNote":
            $data = json_decode( file_get_contents( 'php://input' ), true );
            createNote($data);
            break;
        case "createTag":
            $data = json_decode( file_get_contents( 'php://input' ), true );
            createTag($data);
            break;
        case "createNote":
            $data = json_decode( file_get_contents( 'php://input' ), true );
            createNote($data);
            break;
        case "updateFinishNote":
            updateFinishNote($_GET["id"], $_GET["isfinish"]);
            break;
        case "updateDateOfNote":
            updateDateOfNote($_GET["id"], $_GET["forDate"]);
            break;
        case "updateTag":
            $data = json_decode( file_get_contents( 'php://input' ), true );
            updateTag($data);
            break;
        case "updateNote":
            $data = json_decode( file_get_contents( 'php://input' ), true );
            updateNote($data);
            break;
        case "deleteNote":
            deleteNote($_GET["id"]);
            break;
    }

    function getNotes(){
        $conn = getConnection();
        $sql = "SELECT * FROM `note` WHERE status = 1 ORDER BY `created` DESC";
        $result = $conn->query($sql);
        $response = [];
    
        if (!$result) {
            trigger_error('Invalid query: ' . $conn->error);
        }
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
               $temp[] = array(
                   "id" => $row["id"], 
                   "title" => $row["title"],
                   "description" => $row["description"],
                   "priority" => $row["priority"],
                   "estimate" => $row["estimate"],
                   "working" => $row["working"],
                   "finished" => $row["finished"],
                   "status" => $row["status"],
                   "created" => $row["created"],
                   "updated" => $row["updated"]
                );

                $temp["tags"] = $tags;
            }

            $response["success"] = true;
            $response["msg"] = 'true';
            $response["data"] = $temp;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    
    function getTagByNoteId($id){
        $conn = getConnection();
        $sql = $conn->prepare("SELECT * FROM `note_tag` WHERE `note_id` = ?");
        $sql->bind_param('i', $id);
        $sql->execute();
        $result = $sql->get_result();
        $response = [];
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
               $response[] = array(
                   "id" => $row["id"], 
                   "note_id" => $row["note_id"],
                   "tag_id" => $row["tag_id"]
                );
            }
        }

        $conn->close();
        return $response;
    }

    function getTags(){
        $conn = getConnection();
        $sql = $conn->prepare("SELECT * FROM `tag` WHERE status = 1");
        $sql->execute();
        $result = $sql->get_result();
        $response = [];
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
               $temp[] = array(
                   "id" => $row["id"], 
                   "name" => $row["name"],
                   "description" => $row["description"],
                   "status" => $row["status"],
                   "created" => $row["created"],
                   "updated" => $row["updated"]
                );
            }

            $response["success"] = true;
            $response["msg"] = 'true';
            $response["data"] = $temp;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function getNoteById($id){
        $conn = getConnection();
        $sql = $conn->prepare("SELECT * FROM `note` WHERE status = 1 AND id = ?");
        $sql->bind_param('i', $id);
        $sql->execute();
        $result = $sql->get_result();
        $response = [];
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $temp[] = array(
                    "id" => $row["id"], 
                    "title" => $row["title"],
                    "description" => $row["description"],
                    "priority" => $row["priority"],
                    "estimate" => $row["estimate"],
                    "working" => $row["working"],
                    "finished" => $row["finished"],
                    "status" => $row["status"],
                    "forDate" => $row["for_date"],
                    "created" => $row["created"],
                    "updated" => $row["updated"]
                 );
            }

            $response["success"] = true;
            $response["msg"] = 'Get note is successful!';
            $response["data"] = $temp;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function getSpecificNotesByDate($fromDate = '', $toDate = '') {
        $conn = getConnection();

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";

        $toDate = empty($toDate) ? $currentDate : $toDate;
        $fromDate = empty($fromDate) ? $currentDate : $fromDate;
        
        $sql = $conn->prepare("SELECT * FROM `note` WHERE status = 1 AND created BETWEEN ? AND ? ORDER BY `created` DESC");
        $sql->bind_param('ss', $fromDate, $toDate);
        $sql->execute();
        $result = $sql->get_result();
        $response = [];
  
        if (!$result) {
            trigger_error('Invalid query: ' . $conn->error);
        }
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
               $tags = getTagByNoteId($row["id"]);
               $temp[] = array(
                   "id" => $row["id"], 
                   "title" => $row["title"],
                   "description" => $row["description"],
                   "priority" => $row["priority"],
                   "estimate" => $row["estimate"],
                   "working" => $row["working"],
                   "finished" => $row["finished"],
                   "status" => $row["status"],
                   "forDate" => $row["for_date"],
                   "created" => $row["created"],
                   "updated" => $row["updated"],
                   "tags" => array($tags)
                );
            }

            $response["success"] = true;
            $response["msg"] = 'Get note is successful!';
            $response["data"] = $temp;
        }else{
            $response["success"] = false;
            $response["msg"] = 'Invaild!';
            $response["data"] = [];
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function createNote($note = []){
        $conn = getConnection();
        $conn->query("START TRANSACTION");

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";
        $sql = $conn->prepare("INSERT INTO `note`(`title`, `description`, `priority`, `estimate`, `for_date`, `created`) VALUES (?,?,?,?,?,?)");
        $sql->bind_param("ssiiss", $note['title'], $note['description'], $note['priority'], $note['estimate'], $note["forDate"],$currentDate);
        $result = $sql->execute();

        if ($sql->affected_rows > 0) {
            $conn->query("COMMIT");

            $firstNote = getFirstNote();
            $resultTag = createNoteTags($firstNote['id'], $note['tags']);

            if($resultTag){
                $data[] = array(
                    "success" => true,
                    "msg" => "Create successfully!"
                );
            }else{
                $data[] = array(
                    "success" => true,
                    "msg" => "Create fail!"
                );
                $conn->query("ROLLBACK");
            }
        }else{
            $data[] = array(
                "success" => true,
                "msg" => "Create fail!"
            );
            $conn->query("ROLLBACK");
        }
    
        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function createTag($tag = []){
        $conn = getConnection();
        $conn->query("START TRANSACTION");

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";
        $sql = $conn->prepare("INSERT INTO `tag`(`name`, `description`, `created`) VALUES (?,?,?)");
        $sql->bind_param("sss", $tag['name'], $tag['description'], $currentDate);
        $sql->execute();

        if ($sql->affected_rows > 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Create successfully!"
            );
            $conn->query("COMMIT");
        }else{
            $data[] = array(
                "success" => true,
                "msg" => "Create fail!"
            );
            $conn->query("ROLLBACK");
        }
    
        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function createNoteTags($noteId = 0, $tags = []){
        $conn = getConnection();
        $sql = $conn->prepare("INSERT INTO `note_tag`(`note_id`, `tag_id`) VALUES (?,?)");
        foreach($tags as $item){
            $sql->bind_param("ii", $noteId, $item);
            $sql->execute();
        }

        return $sql->affected_rows > 0;
    }

    function getFirstNote(){
        $conn = getConnection();
        $sql = "SELECT * FROM `note` ORDER BY id DESC limit 1";
        $result = $conn->query($sql);
        $data = [];
    
        if (!$result) {
            trigger_error('Invalid query: ' . $conn->error);
        }

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
               $data[] = array(
                   "id" => $row["id"], 
                   "title" => $row["title"],
                   "description" => $row["description"],
                   "priority" => $row["priority"],
                   "estimate" => $row["estimate"],
                   "working" => $row["working"],
                   "finished" => $row["finished"],
                   "status" => $row["status"],
                   "created" => $row["created"],
                   "updated" => $row["updated"]
                );
            }
        }

        $conn->close();
        return $data[0];
    }

    function updateFinishNote($id, $isFinish){
        $conn = getConnection();
        $sql = $conn->prepare("UPDATE `note` SET finished = ? WHERE id = ?");
        $sql->bind_param("ii", $isFinish, $id);
        $sql->execute();

        if ($sql->affected_rows > 0 || $sql->affected_rows == 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Update successfully!"
            );
        }else{
            $data[] = array(
                "success" => true,
                "msg" => "Update fail!"
            );
        }

        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function updateNote($note = []){
        $conn = getConnection();
        $conn->query("START TRANSACTION");

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";
        $sql = $conn->prepare("UPDATE `note` SET `title` = ?,  `description` = ?, `priority` = ?, `working` = ?, `for_date` = ?, `updated` = ? WHERE `id` = ?");
        $sql->bind_param("ssiissi", $note['title'], $note['description'], $note['priority'], $note['working'], $note['forDate'], $currentDate, $note['id']);
        $sql->execute();
        $data = [];

        if ($sql->affected_rows > 0 || $sql->affected_rows == 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Update successfully!"
            );
            $conn->query("COMMIT");
        }else{
            $data[] = array(
                "success" => false,
                "msg" => "Update fail!"
            );
            $conn->query("ROLLBACK");
        }

        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function updateDateOfNote($id, $forDate){
        $conn = getConnection();
        $conn->query("START TRANSACTION");

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";
        $sql = $conn->prepare("UPDATE `note` SET `for_date` = ?, `updated` = ? WHERE `id` = ?");
        $sql->bind_param("ssi", $forDate, $currentDate, $id);
        $sql->execute();
        $data = [];

        if ($sql->affected_rows > 0 || $sql->affected_rows == 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Update successfully!"
            );
            $conn->query("COMMIT");
        }else{
            $data[] = array(
                "success" => false,
                "msg" => "Update fail!"
            );
            $conn->query("ROLLBACK");
        }

        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function updateTag($tag = []){
        $conn = getConnection();
        $conn->query("START TRANSACTION");

        $date = getdate(date("U"));
        $currentDate = "$date[year]-$date[mon]-$date[mday]";
        $sql = $conn->prepare("UPDATE `tag` SET `name` = ?,  `description` = ?, `updated` = ? WHERE `id` = ?");
        $sql->bind_param("sssi", $tag['name'], $tag['description'], $currentDate, $tag['id']);
        $sql->execute();
        $data = [];

        if ($sql->affected_rows > 0 || $sql->affected_rows == 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Update successfully!"
            );
            $conn->query("COMMIT");
        }else{
            $data[] = array(
                "success" => false,
                "msg" => "Update fail!"
            );
            $conn->query("ROLLBACK");
        }
    
        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }

    function deleteNote($id){
        $conn = getConnection();
        $sql = $conn->prepare("UPDATE note SET status = 0 WHERE id = ?");
        $sql->bind_param("i", $id);
        $result = $sql->execute();

        if (!$result) {
            trigger_error('Invalid query: ' . $conn->error);
            $data[] = array(
                "success" => false,
                "msg" => $conn->error
            );
        }

        if ($sql->affected_rows > 0) {
            $data[] = array(
                "success" => true,
                "msg" => "Delete successfully!"
            );
        }else{
            $data[] = array(
                "success" => true,
                "msg" => "Delete fail!"
            );
        }
    
        echo json_encode($data[0], JSON_UNESCAPED_UNICODE);
        $conn->close();
    }
?>