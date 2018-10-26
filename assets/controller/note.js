let formCreateNote = $('form[name="create-note"]');
let fromCreateTag = $('form[name="create-tag"]');
let fromChooseDate = $('form[name="choose-date"]');
let tags = {};
let tempNotes = [];

getTags();
getNotes();

$(document).ready(function () {
    $('#select-tag-create').select2({
        theme: "classic",
        width: '100%',
        allowClear: true
    });

    $('#select-tag').select2({
        theme: "classic",
        width: '100%',
        allowClear: true
    });
});

function getTags() {
    MyFactory.GET(API.TAG.GET).then(res => {
        if (res.success) {
            tags = res.data;
            let tagsCreateBlock = $('#select-tag-create');
            let tagsUpdateBlock = $('#select-tag');

            tagsCreateBlock.empty();
            tagsUpdateBlock.empty();

            tagsCreateBlock.append(renderTags(res.data));
            tagsUpdateBlock.append(renderTags(res.data));
        }
    });
}

function getNotes() {
    let tempCurrentDate = new Date();
    let currentDate = new Date();
    let prevDate = new Date();
    let num = 2;
    let keysGenerator = [tempCurrentDate.addDays(2).toString()];

    for (let i = 0; i < num*num; i++) {
        keysGenerator.push(tempCurrentDate.minusDays(1).toString());
    }

    MyFactory.GET(API.NOTE.GET_SPECIFIC + `&from=${prevDate.minusDays(num).toString()}&to=${currentDate.addDays(num).toString()}`).then(res => {
        if (res.success) {
            let noteBlock = $('#group-note');
            let notes = groupByDate(keysGenerator, res.data);
            //let length = Object.keys(obj).length;
            noteBlock.empty();
            noteBlock.append(renderNotes(notes));

            $('.form-check-input').on('change', function (event) {
                updateFinish($(this).data('id'), $(this).is(':checked'));
            });

            attachEvent();
            showCalendar(res.data);
            
            tempNotes = [...res.data];
        }
    });
}

function updateFinish(id, isFinish) {
    MyFactory.GET(API.NOTE.UPDATE_FINISH + `&id=${id}&isfinish=${Number(isFinish)}`).then(res => {
        if (res.success) {
            window.toastSuccess(res.msg);
            getNotes();
        } else {
            window.toastWarning(res.msg);
        }
    });
}

formCreateNote.submit(function (event) {
    event.preventDefault();

    let title = $('[name="title"]').val();
    let description = $('[name="description"]').val();
    let tags = [];
    let priority = $('[name="priority"]').val();
    let estimate = $('[name="estimate"]').val();
    let forDate = $('[name="date"]').val();

    $('#select-tag-create').select2('data').map(item => {
        tags.push(+item.id);
    });

    let data = Object.assign({}, { title }, { description }, { priority }, { estimate }, { tags }, {forDate});

    MyFactory.POST(API.NOTE.CREATE, data).then(res => {
        if (res.success) {
            window.toastSuccess(res.msg);
            getNotes();
        } else {
            window.toastWarning(res.msg);
        }
        formCreateNote.trigger("reset");
        $('.modal').modal('hide');
    });
});

fromCreateTag.submit(function(event){
    event.preventDefault();

    let name = $('[name="name-tag"]').val();
    let description = $('[name="description-tag"]').val();

    let data = Object.assign({}, {name}, {description});

    MyFactory.POST(API.TAG.CREATE, data).then(res => {
        if (res.success) {
            window.toastSuccess(res.msg);
            getTags();
            //window.location.reload();
        } else {
            window.toastWarning(res.msg);
        }
        fromCreateTag.trigger("reset");
        $('.modal').modal('hide');
    });
});

fromChooseDate.submit(function(event){
    event.preventDefault();

    let fromDate = new Date($('input[name="from-date"]').val());
    let toDate = new Date($('input[name="to-date"]').val());
    let tempCurrentDate = new Date(fromDate);
    let numAdd = new Date(toDate - fromDate).getDate() -1;
    let keysGenerator = [tempCurrentDate.toString()];

    for (let i = 0; i < numAdd; i++) {
        keysGenerator.push(tempCurrentDate.addDays(1).toString());
    }

    MyFactory.GET(API.NOTE.GET_SPECIFIC + `&from=${fromDate.toString()}&to=${toDate.toString()}`).then(res => {
        if (res.success) {
            let noteBlock = $('#group-note');
            let notes = groupByDate(keysGenerator, res.data);

            noteBlock.empty();
            noteBlock.append(renderNotes(notes));

            $('.form-check-input').on('change', function (event) {
                updateFinish($(this).data('id'), $(this).is(':checked'));
            });
        }else{
            window.toastWarning(res.msg);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });
});

function attachEvent() {

    let note = {};
    let selectOnRow = 0;
    let tag = {};

    $('.btn-update').click(function (event) {
        event.preventDefault();
        MyFactory.GET(API.NOTE.GET_BY_ID + `&id=${$(this).data('id')}`).then(res => {
            if (res.success) {
                note = Object.assign({}, res.data[0]);
                initUpdate(res.data[0]);
            }
        });
    });

    $('.btn-delete').click(function(event){
        selectOnRow = $(this).data('id');
    });

    $('.tag').click(function(event){
        selectOnRow = $(this).data('id');
        tag = tags.find(x => x.id === selectOnRow);
        $('input[name="name-tag-update"]').val(tag.name);
        $('[name="description-tag-update"]').val(tag.description);
    });

    $('form[name="update-note"]').submit(function (event) {
        event.preventDefault();

        MyFactory.POST(API.NOTE.UPDATE, getNote()).then(res => {
            if (res.success) {
                window.toastSuccess(res.msg);
                getNotes();
                //window.location.reload();
            } else {
                window.toastWarning(res.msg);
            }
            $(this).trigger("reset");
            $('.modal').modal('hide');
        });
    });

    $('form[name="delete-note"]').submit(function(event){
        event.preventDefault();

        MyFactory.GET(API.NOTE.DELETE + `&id=${selectOnRow}`).then(res => {
            if (res.success) {
                window.toastSuccess(res.msg);
                getNotes();
                //window.location.reload();
            } else {
                window.toastWarning(res.msg);
            }
            $(this).trigger("reset");
            $('.modal').modal('hide');
        });
    });


    $('form[name="update-tag"]').submit(function(event){
        event.preventDefault();

        let name = $('input[name="name-tag-update"]').val();
        let description = $('[name="description-tag-update"]').val();
        let id = selectOnRow;
        let data = Object.assign({}, {id}, {name}, {description});

        MyFactory.POST(API.TAG.UPDATE, data).then(res => {
            if (res.success) {
                window.toastSuccess(res.msg);
                getTags();
                getNotes();
                //window.location.reload();
            } else {
                window.toastWarning(res.msg);
            }
            $(this).trigger("reset");
            $('.modal').modal('hide');
        });
    });
    
    function initUpdate(note) {
        $('input[name="title-update"]').val(note.title);
        $('[name="description-update"]').val(note.description);
        //let tags = [];
        $('[name="priority-update"]').val(note.priority);
        $('[name="working-update"]').val(note.working);
        $('[name="date-update"]').val(note.forDate);
    }

    function getNote() {
        let title = $('input[name="title-update"]').val();
        let description = $('[name="description-update"]').val();
        //let tags = [];
        let priority = $('[name="priority-update"]').val();
        let working = $('[name="working-update"]').val();
        let forDate =  $('[name="date-update"]').val();
        let id = note.id;

        return Object.assign({}, { id }, { title }, { description }, { priority }, { working }, {forDate});
    }

}

function renderTags(tags) {
    return tags.map(tag => (
        `<option value="${tag.id}">${tag.name}</option>`
    ));
}


function groupByDate(keys = [], data) {
    let result = {};

    keys.map((date) => {
        let arr = data.filter(x => x.forDate === date);
        result[date] = arr;
    });

    return result;
}

function renderNotes(notes = {}) {
    return Object.keys(notes).reverse().map(key => (
        renderNote(key, notes[key])
    ));
}

function renderSpecificNote(note) {

    function renderTags(note) {
        let temp = [];
        let tempTag = [];

        note.tags.map(tag => {
            tag.map(item => {
                temp.push(item.tag_id);
            });
            temp.map(item => {
                tempTag.push((tags.find(x => x.id === item)))
            })
        });

        return tempTag.map(item => (
            `<span class="badge badge-pill badge-secondary tag" style="margin-right:5px;cursor:pointer;" data-toggle="modal" data-target="#update-tag" data-id=${item.id}>${item.name}</span>`
        )).join('');
    }

    let priority = {
        1: {
            class: 'warning',
            text: 'low'
        },
        2: {
            class: 'primary',
            text: 'medium'
        },
        3: {
            class: 'danger',
            text: 'high'
        }
    }

    let persent = Math.round(((note.working / note.estimate)*100) > 100 ? 100 : ((note.working / note.estimate)*100) * 100) / 100 ;
    return (`
        <li class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-sm-8">
                    <div class="form-check">
                        ${persent !== 100 && `<input class="form-check-input" type="checkbox" ${note.finished && 'checked' || ''} value="" id="note-${note.id}" data-id="${note.id}">` || ``}
                        <label class="form-check-label" for="note-${note.id}" style="${note.finished && 'text-decoration: line-through;' || ''}">
                            <div>${note.title}</div>
                            <div>${note.description}</div>
                       
                        </label>
                        <div>
                            <div class="progress">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${persent}"
                                aria-valuemin="0" aria-valuemax="100" style="width:${persent}%">
                                    ${persent}% Complete (success)
                                </div>
                            </div>
                            <span style="margin-right:5px;">Estimate: ${note.estimate}</span>
                            <span style="margin-right:5px;">Working: ${note.working}</span>
                        </div>
                        <div>
                            <span class="badge badge-${priority[note.priority].class}">Priority: ${priority[note.priority].text}</span>
                        </div>
                        <div class="badge-note">
                            ${renderTags(note)}
                        </div>
                    </div>
                </div>
                <div class="col-sm-4 text-right">
                    <button type="button" class="btn btn-sm btn-success btn-update" title="Update" data-toggle="modal" data-target="#update-note" data-id="${note.id}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                    <button type="button" class="btn btn-sm btn-danger btn-delete" title="Delete" data-toggle="modal" data-target="#delete-note" data-id="${note.id}"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>
            </div>
        </li>
    `)
}

function renderSpecificNotes(notes) {
    let result = notes.map(note => (
        renderSpecificNote(note)
    ));

    result = result.join('');
    return result;
}

function renderNote(date, notes) {

    if (notes.length > 0) {
        return (`
            <div class="row note">
               <div class="col-12 text-center note-date"><h3>Date: ${moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</h3></div>
                <div class="col-12">
                    <div class="col-12">
                        <ul class="list-group list-group-flush list-group-item-action" id="list-note-render">
                            ${renderSpecificNotes(notes)}
                        </ul>
                    </div>
                </div>
            </div>
        `)
    }

    return (`
        <div class="row note">
            <div class="col-12 text-center note-date"><h3>Date: ${moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</h3></div>
            <div class="col-12">
                <div class="col-12">
                    <div class="text-center"><strong>Nothing</strong></div>
                </div>
            </div>
        </div>
    `)

}

function showCalendar(notes){
    let events = [];
    notes.map(item => {
        let event = {
            id:'',
            title: '',
            start: '',
            end: '',
            backgroundColor: '',
            textColor: '',
            borderColor: ''
        };

        event['id'] = item.id;
        event['title'] = item.title;
        event['start'] = item.forDate;
        event['end'] = item.forDate;
        event['backgroundColor'] = item.finished ? '#e51c23' : item.estimate <= item.working ? '#ff9800' : '#50b154';
        event['textColor'] = '#fff';
        event['borderColor'] = '#fff';

        events.push(event);
    });

    $('#calendar').fullCalendar({
        editable: true,
        defaultView: 'month',
        events,
        eventDrop: function(event, delta, revertFunc, jsEvent, ui, view){
            MyFactory.GET(API.NOTE.UPDATE_FOR_DATE + `&id=${event.id}&forDate=${event.start.format()}`).then(res => {
                if (res.success) {
                    window.toastSuccess(res.msg);
                    getNotes();
                } else {
                    window.toastWarning(res.msg);
                }
            });
        }
    });
}

$('#chart').on('shown.bs.modal', function(){
    getSatistics();
});

$('#full-calendar').on('shown.bs.modal', function(){
    showCalendar(tempNotes);
});

getSatistics();

function getSatistics(){
    MyFactory.GET(API.STATISTICS.GET).then(res => {
        if(res.success){
            let ctx = document.getElementById('myChart').getContext('2d');
            let options = {
                responsive: true
            };
            
            let chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'doughnut',
            
                // The data for our dataset
                data: {
                    labels: ["Finished", "Working", "Cancel"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: ["#50b154", "#ff9800", "#e51c23"],
                        borderColor: ["#50b154", "#ff9800", "#e51c23"],
                        data: [res.data['finished'], res.data['working'], res.data['cancel']],
                    }]
                },
            
                // Configuration options go here
                options,
            });
        }
    });
}



