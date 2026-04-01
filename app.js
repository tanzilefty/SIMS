// ================= LOGIN HANDLING =================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('role').value;
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username) return showError('Please enter username/ID');

            if (role === 'admin') {
                if (username === 'admin' && password === '123') {
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'admin.html';
                } else {
                    showError('Invalid admin credentials');
                }
            } else {
                // Student login (any ID works if added)
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                if (!students.find(s => s.id === username)) {
                    showError('Student not found. Contact admin.');
                    return;
                }
                localStorage.setItem('userRole', 'student');
                localStorage.setItem('studentID', username);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'student.html';
            }
        });
    }
});

// Show login error
function showError(msg) {
    let div = document.getElementById('errorMessage');
    if (!div) {
        div = document.createElement('div');
        div.id = 'errorMessage';
        div.className = 'error-message';
        const form = document.getElementById('loginForm');
        form.insertBefore(div, form.firstChild);
    }
    div.textContent = msg;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
}

// ================= LOGOUT HANDLING =================
document.querySelectorAll('#logoutBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('studentID');
        window.location.href = 'index.html';
    });
});

// ================= ADMIN DASHBOARD =================
const adminForm = document.getElementById('addStudentForm');
const resultForm = document.getElementById('assignResultForm');
const studentTable = document.getElementById('studentTableBody');

if (studentTable) {
    if (localStorage.getItem('userRole') !== 'admin' || localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    let students = JSON.parse(localStorage.getItem('students') || '[]');

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    function calculateGrade(marks) {
        if (marks >= 80) return 'A+';
        if (marks >= 70) return 'A';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C';
        return 'F';
    }

    function renderTable() {
        if (students.length === 0) {
            studentTable.innerHTML = '<tr><td colspan="5" style="text-align:center;">No students added</td></tr>';
            return;
        }
        studentTable.innerHTML = students.map(s => `
            <tr>
                <td>${escapeHtml(s.id)}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>${s.marks !== null ? s.marks : '-'}</td>
                <td>${s.grade ? `<span class="grade-badge grade-${s.grade.replace('+','-plus')}">${s.grade}</span>` : '-'}</td>
                <td><button onclick="deleteStudent('${s.id}')" class="btn btn-secondary">Delete</button></td>
            </tr>
        `).join('');
    }

    window.deleteStudent = function(id) {
        if (confirm('Delete this student?')) {
            students = students.filter(s => s.id !== id);
            saveStudents();
            renderTable();
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }

    adminForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('studentId').value.trim();
        const name = document.getElementById('studentName').value.trim();
        if (!id || !name) return;
        if (students.find(s => s.id === id)) {
            alert('Student ID already exists!');
            return;
        }
        students.push({id, name, marks: null, grade: null});
        saveStudents();
        renderTable();
        adminForm.reset();
    });

    resultForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('resultStudentId').value.trim();
        const marks = parseFloat(document.getElementById('marks').value);
        const student = students.find(s => s.id === id);
        if (!student) {
            alert('Student not found!');
            return;
        }
        student.marks = marks;
        student.grade = calculateGrade(marks);
        saveStudents();
        renderTable();
        resultForm.reset();
    });

    renderTable();
}

// ================= STUDENT DASHBOARD =================
const studentDiv = document.getElementById('resultContent');
const studentInfoDiv = document.getElementById('studentInfo');

if (studentDiv && studentInfoDiv) {
    const studentID = localStorage.getItem('studentID');
    if (!studentID || localStorage.getItem('userRole') !== 'student' || localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    function loadStudentResult() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.id === studentID);

        studentInfoDiv.innerHTML = student ? `
            <div class="student-id">Student ID: ${escapeHtml(student.id)}</div>
            <div class="student-name">${escapeHtml(student.name)}</div>
        ` : `<div class="student-id">Student ID: ${studentID}</div>`;

        if (!student || student.marks === null) {
            studentDiv.innerHTML = `<div class="no-result"><strong>No Result Yet</strong><br>Contact admin.</div>`;
            return;
        }

        const gradeClass = `grade-${student.grade.replace('+','-plus')}-large`;
        studentDiv.innerHTML = `
            <div class="result-container">
                <h3>Your Result</h3>
                <div class="result-details">
                    <div class="result-item">
                        <div>Marks</div>
                        <div class="result-value">${student.marks} / 100</div>
                    </div>
                    <div class="result-item">
                        <div>Grade</div>
                        <div class="result-value grade-badge ${gradeClass}" style="font-size:1.2rem">${student.grade}</div>
                    </div>
                </div>
            </div>
        `;
    }

    loadStudentResult();
    window.addEventListener('storage', e => {
        if (e.key === 'students') loadStudentResult();
    });
}
