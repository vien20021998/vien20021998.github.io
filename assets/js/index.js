const TYPE_SORT = {
    ASC: 'asc', // tang dan
    DESC: 'desc' // giam dan
}

window.onload = function () {
    // document.getElementById('all-student').innerHTML = getStudents();
    // var // let // const // nothing
    // const allStudent = getStudents();
    // const allStudentElement = document.getElementById('table');
    // allStudentElement.innerHTML = allStudent.map(function (s, index) {
    //     return `<tr>
    //     <th scope="row"${index + 1}></th>
    //     <td>${s.name}</td>
    //     <td>${s.age}</td>
    //     <td>${s.avg}</td>
    //     <td>${s.avg >= 4 ? '<span class="badge rounded-pill text-bg-success">Passed</span>' : '<span class="badge rounded-pill text-bg-danger">Fail</span>'}</td>
    //     <td class="w-140px">
    //         <button type="button" class="btn btn-primary">Edit</button>
    //         <button type="button" class="btn btn-danger">Delete</button>
    //     </td>
    //     </tr>`
    // }).join('');

    // const minAvg = 4;
    // const minAvgStudent = getStudents(minAvg);
    // const studentsPassed = document.getElementById('students-passed');
    // studentsPassed.innerHTML = minAvgStudent.map(function (s) {
    //     return s.getFormatted();
    // }).join('');

    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const totalSalary = getTotalSalary();
    document.getElementById('total-salary').innerHTML = formatted.format(totalSalary);

    initData();
    mountToview();
    $('#exampleModal').on('hidden.bs.modal', function () {
        $('input[name="name"]').val('');
        $('input[name="age"]').val('');
        $('input[name="avg"]').val('');
        $("#exampleModalLabel").text('Add Student');
        $("#add-student").text('Add');
        $("#add-student").data('id', undefined);
        
    });
}

function Student(id, name, age, avg) {
    this.name = name;
    this.id = id;
    this.age = age;
    this.avg = avg;
    this.getFormatted = function () {
        return `<div class="${this.avg >= 4 ? 'text-success' : 'text-danger'}">${this.name} - Age: ${this.age} - avg: ${this.avg}</div>`;
    }
}

const students = [
    new Student(1, 'jonh', 20, 3.5),
    new Student(2, 'jane', 21, 4.2),
    new Student(3, 'jack', 22, 4.7),
    new Student(4, 'jill', 23, 4.1),
    new Student(5, 'joe', 24, 4.3),
    new Student(6, 'jen', 25, 3.9),
];

function sum(a, b) {
    return a + b;
}

function Staff(name, age, salary) {
    this.name = name;
    this.age = age;
    this.salary = salary;
    this.getFormatted = function () {
        return `<div>${this.name} -Age: ${this.age} -salary: ${this.salary}</div>`
    }
}

const staffs = [
    new Staff('jonh', 20, 1000),
    new Staff('jane', 21, 2000),
    new Staff('jack', 22, 3000),
    new Staff('jill', 23, 4000),
    new Staff('joe', 24, 5000),
    new Staff('jen', 25, 6000),
];

function getTotalSalary() {
    return staffs.reduce(function (total, staff) {
        return total + staff.salary;
    }, 0);
}

function sum(a, b) {
    return a + b;
}

function getStudents(minAvg) {
    if (minAvg === undefined) {
        return students;
    }
    return students.filter(s => s.avg >= minAvg);
}

function sortStudent() {
    return students.sort(function (a, b) {
        if (type === TYPE_SORT.ASC) {
            return a.avg - b.avg;
        }
        return b.avg - avg;
    });
}
function createOrUpdate(event) {
    let id = $(event).data('id');
    const nameSelector = document.querySelector('input[name="name"]');
    const ageSelector = document.querySelector('input[name="age"]');
    const avgSelector = document.querySelector('input[name="avg"]');
    const name = nameSelector.value;
    const age = ageSelector.value;
    const avg = avgSelector.value;
    const allStudent = getStudentsFromstore();
    if (id) {
        const student = allStudent.find(s=> s.id === id);
        student.name = name;
        student.age =age;
        student.avg = Number(avg);
        allStudent.splice(allStudent.findIndex(s=> s.id === id), 1, student);
        localStorage.setItem('student', JSON.stringify(allStudent));
    } else {
        id = Math.floor(Math.random() * 1000000);
        const student = new Student(id, name, age, Number(avg));
        // document.getElementById('all-student').innerHTML += student.getFormatted();
        allStudent.push(student);
        localStorage.setItem('student', JSON.stringify(allStudent));
    }
    nameSelector.value = '';
    ageSelector.value = '';
    avgSelector.value = '';
    localStorage.setItem('students', JSON.stringify(allStudent));
    mountToview();
    let myModalEl = document.getElementById('exampleModal');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
}
function initData() {
    const student = localStorage.getItem('students')
    if (!student) {
        localStorage.setItem('students', JSON.stringify(students));
    }
}

function getStudentsFromstore() {
    return JSON.parse(localStorage.getItem('students'))
}

function mountToview() {
    const allStudent = getStudentsFromstore();
    const allStudentElement = document.getElementById('table');
    allStudentElement.innerHTML = allStudent.map(function (s, index) {
        return `<tr>
                <th scope="row">${index + 1}</th>
                <td>${s.name}</td>
                <td>${s.age}</td>
                <td>${s.avg}</td>
                <td>${s.avg >= 4 ? '<span class="badge rounded-pill text-bg-success">Passed</span>' : '<span class="badge rounded-pill text-bg-danger">Fail</span>'}</td>
                <td class="w-140px">
                    <button type="button" class="btn btn-primary" onclick="editStudent(${s.id})">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="deleteStudent(${s.id})">Delete</button>
                </td>
                </tr>`
    }).join('');
}

function deleteStudent(id) {
    const allStudent = getStudentsFromstore();
    const index = allStudent.findIndex(s => s.id === id);
    if (index !== -1) {
       
        modalConfirm(function(confirm){
            if (confirm) {
                allStudent.splice(index, 1);
                localStorage.setItem('students', JSON.stringify(allStudent));
                mountToview();
            }
        })
    } else {
        alert(`Student with id ${id} not found!!`);
    }
}

let modalConfirm = function(callback){
    $("#mi-modal").modal('show');
    $("#modal-btn-si").on("click", function(){
        callback(true);
        $("#mi-modal").modal('hide');
    })
    $("#modal-btn-no").on("click", function(){
        callback(false);
        $("#mi-modal").modal('hide');
    })
};

function editStudent( id) {
    const allStudent = getStudentsFromstore();
    const index = allStudent.findIndex(s => s.id === id);
    if (index !== -1) {
        const student = allStudent[index];
        const nameSelector = document.querySelector('input[name="name"]');
        const ageSelector = document.querySelector('input[name="age"]');
        const avgSelector = document.querySelector('input[name="avg"]');
        nameSelector.value = student.name;
        ageSelector.value = student.age;
        avgSelector.value =student.avg;
        $("#exampleModal").modal('show');
        $("#exampleModalLabel").text('Edit Student');
        $("#add-student").text('Save');
        $("#add-student").data('id',id);

    } else {
        alert(`Student with id ${id} not found!!`);
    }
}
