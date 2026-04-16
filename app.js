// =======================
// app.js
// =======================

document.addEventListener('DOMContentLoaded', function() {

    const STUDENTS_KEY = 'students';
    let students = [];

    // =======================
    // LOGIN HANDLER
    // =======================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });

        // Optional: change label placeholder based on role
        const roleSelect = document.getElementById('role');
        const usernameLabel = document.getElementById('usernameLabel');
        const passwordInput = document.getElementById('password');

        roleSelect.addEventListener('change', function() {
            if (this.value === 'admin') {
                usernameLabel.textContent = 'Username';
                passwordInput.required = true;
                passwordInput.placeholder = '';
            } else {
                usernameLabel.textContent = 'Student ID';
                passwordInput.required = false;
                passwordInput.placeholder = 'Password not required';
            }
        });
        roleSelect.dispatchEvent(new Event('change'));
    }

    function handleLogin() {
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username) {
            showError('Please enter username/ID');
            return;
        }

        if (role === 'admin') {
            if (username === 'admin' && password === '123') {
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                showError('Invalid admin credentials');
            }
        } else {
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('studentID', username);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'student.html';
        }
    }

    function showError(message) {
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            const form = document.getElementById('loginForm');
            form.insertBefore(errorDiv, form.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }

    // =======================
    // ADMIN DASHBOARD
    // =======================
    if (document.getElementById('addStudentForm')) {
        // Redirect if not admin
        if (localStorage.getItem('userRole') !== 'admin' || localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }

        loadStudents();

        // Add student
        document.getElementById('addStudentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('studentId').value.trim();
            const name = document.getElementById('studentName').value.trim();
            if (id && name) addStudent(id, name);
            this.reset();
        });

        // Assign result
        document.getElementById('assignResultForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('resultStudentId').value.trim();
            const marks = parseFloat(document.getElementById('marks').value);
            if (id && !isNaN(marks)) assignResult(id, marks);
            this.reset();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    function loadStudents() {
        const stored = localStorage.getItem(STUDENTS_KEY);
        students = stored ? JSON.parse(stored) : [];
        renderTable();
    }

    function saveStudents() {
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    }

    function calculateGrade(marks) {
        if (marks >= 80) return 'A+';
        if (marks >= 70) return 'A';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C';
        return 'F';
    }

    function showMessage(msg, isSuccess) {
        const div = isSuccess ? document.getElementById('successMessage') : document.getElementById('errorMessage');
        if (!div) return;
        div.textContent = msg;
        div.style.display = 'block';
        setTimeout(() => div.style.display = 'none', 3000);
    }

    function renderTable() {
        const tbody = document.getElementById('studentTableBody');
        if (!tbody) return;
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No students added</td></tr>';
            return;
        }

        let html = '';
        students.forEach(s => {
            const marksDisplay = s.marks !== null ? s.marks : '-';
            let gradeDisplay = '-';
            if (s.grade) {
                const gradeClass = `grade-${s.grade.replace('+', '-plus')}`;
                gradeDisplay = `<span class="grade-badge ${gradeClass}">${s.grade}</span>`;
            }
            html += `
                <tr>
                    <td>${escapeHtml(s.id)}</td>
                    <td>${escapeHtml(s.name)}</td>
                    <td>${marksDisplay}</td>
                    <td>${gradeDisplay}</td>
                    <td><button onclick="deleteStudent('${s.id}')" class="btn btn-secondary">Delete</button></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function addStudent(id, name) {
        if (students.find(s => s.id === id)) {
            showMessage('Student ID already exists!', false);
            return false;
        }
        students.push({ id, name, marks: null, grade: null });
        saveStudents();
        renderTable();
        showMessage(`Student ${name} added!`, true);
        return true;
    }

    function assignResult(id, marks) {
        const student = students.find(s => s.id === id);
        if (!student) {
            showMessage('Student not found!', false);
            return false;
        }
        student.marks = marks;
        student.grade = calculateGrade(marks);
        saveStudents();
        renderTable();
        showMessage(`Result assigned: ${marks} marks (Grade: ${student.grade})`, true);
        return true;
    }

    window.deleteStudent = function(id) {
        if (confirm('Delete this student?')) {
            students = students.filter(s => s.id !== id);
            saveStudents();
            renderTable();
            showMessage('Student deleted!', true);
        }
    };

    // =======================
    // STUDENT DASHBOARD
    // =======================
    if (document.getElementById('studentInfo')) {
        const studentID = localStorage.getItem('studentID');
        if (localStorage.getItem('userRole') !== 'student' || localStorage.getItem('isLoggedIn') !== 'true' || !studentID) {
            window.location.href = 'login.html';
        }

        const studentInfoDiv = document.getElementById('studentInfo');
        const resultDiv = document.getElementById('resultContent');

        function loadAndDisplay() {
            const stored = localStorage.getItem(STUDENTS_KEY);
            const students = stored ? JSON.parse(stored) : [];
            const student = students.find(s => s.id === studentID);

            if (!student) {
                studentInfoDiv.innerHTML = `<div class="student-id">Student ID: ${studentID}</div>`;
                resultDiv.innerHTML = `<div class="no-result"><strong>No Record Found</strong><br>Contact administrator.</div>`;
                return;
            }

            studentInfoDiv.innerHTML = `<div class="student-id">Student ID: ${escapeHtml(student.id)}</div>
                                        <div class="student-name">${escapeHtml(student.name)}</div>`;

            if (student.marks !== null && student.grade) {
                const gradeClass = `grade-${student.grade.replace('+', '-plus')}-large`;
                resultDiv.innerHTML = `
                    <div class="result-container">
                        <h3>Your Result</h3>
                        <div class="result-details">
                            <div class="result-item">
                                <div>Marks</div>
                                <div class="result-value">${student.marks} / 100</div>
                            </div>
                            <div class="result-item">
                                <div>Grade</div>
                                <div class="result-value grade-badge ${gradeClass}" style="font-size:1.2rem;">${student.grade}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<div class="no-result"><strong>No Result Yet</strong><br>Your result has not been assigned.</div>`;
            }
        }

        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });

        loadAndDisplay();

        // Update if localStorage changes
        window.addEventListener('storage', function(e) {
            if (e.key === STUDENTS_KEY) loadAndDisplay();
        });
    }

});
