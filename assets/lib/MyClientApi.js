let host = 'http://localhost:8080/myplan/server/';

let API = {
    NOTE: {
        GET_BY_ID: host + 'api/note.php?act=getNoteById',
        GET: host + 'api/note.php?act=getNotes',
        GET_SPECIFIC: host + 'api/note.php?act=getSpecificNotesByDate',
        UPDATE_FINISH: host + 'api/note.php?act=updateFinishNote',
        CREATE: host + 'api/note.php?act=createNote',
        UPDATE: host + 'api/note.php?act=updateNote',
        UPDATE_FOR_DATE: host + 'api/note.php?act=updateDateOfNote',
        DELETE: host + 'api/note.php?act=deleteNote'
    },
    TAG: {
        GET: host + 'api/note.php?act=getTags',
        CREATE: host + 'api/note.php?act=createTag',
        UPDATE: host + 'api/note.php?act=updateTag',
    },
    STATISTICS: {
        GET: host + 'api/note.php?act=statistics'
    }
}