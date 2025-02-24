document.addEventListener('DOMContentLoaded', () => {
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    let editingIndex = null; // ✅ Fix: Declare editingIndex

    function applyDarkMode() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    document.getElementById('toggle-theme')?.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        applyDarkMode();
    });

    applyDarkMode(); // Apply dark mode on page load    

    // Render Employee List
    function renderEmployeeList() {
        const employeeList = document.querySelector('#employee-table tbody');
        employeeList.innerHTML = '';

        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.position}</td>
                <td>${employee.salary || 'N/A'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            `;
            employeeList.appendChild(row);
        });
    }

    // Handle Form Submission
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
    
        const name = document.getElementById('empname').value.trim();
        const email = document.getElementById('empemail').value.trim();
        const position = document.getElementById('empposition').value.trim();
        const salary = document.getElementById('empsalary') ? document.getElementById('empsalary').value.trim() : ''; // Handle salary field
    
        if (!name || !email || !position) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const employee = { name, email, position, salary };
    
        if (editingIndex !== null) {
            employees[editingIndex] = employee;
            editingIndex = null; // Reset after update
        } else {
            employees.push(employee);
        }
    
        localStorage.setItem('employees', JSON.stringify(employees)); // Save to local storage
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    }

    // Edit Employee
    window.editEmployee = function(index) {
        editingIndex = index;
        localStorage.setItem('editingIndex', index);
        window.location.href = 'update.html';
    };

    // Delete Employee
    window.deleteEmployee = function(index) {
        employees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployeeList();
    };

    // Generate PDF Report
    document.getElementById('generate-report')?.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text('Employee Report', 10, 10);
        
        let yPos = 20;
        employees.forEach((emp, i) => {
            doc.text(`${i + 1}. ${emp.name} - ${emp.position} - ${emp.salary || "N/A"}`, 10, yPos);
            yPos += 10;
        });
    
        doc.save('employee_report.pdf');
    });

    // Generate Excel Report
    document.getElementById('generate-excel')?.addEventListener('click', () => {
        let ws = XLSX.utils.json_to_sheet(employees);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
        XLSX.writeFile(wb, 'employee_report.xlsx');
    });

    // Load Employee List in Dashboard
    if (window.location.href.includes('dashboard.html')) {
        renderEmployeeList();
    }

    // Load Employee Data in Update Page
    if (window.location.href.includes('update.html')) {
        const storedIndex = localStorage.getItem('editingIndex');
        if (storedIndex !== null) {
            editingIndex = parseInt(storedIndex);
            const employee = employees[editingIndex];
            document.getElementById('empname').value = employee.name;
            document.getElementById('empemail').value = employee.email;
            document.getElementById('empposition').value = employee.position;
            document.getElementById('empsalary').value = employee.salary;
            localStorage.removeItem('editingIndex');
        }
        document.getElementById('employee-form').addEventListener('submit', handleFormSubmit);
    }

    // Bind Form Submit in Add Employee Page
    if (window.location.href.includes('add.html')) {
        document.getElementById('employee-form').addEventListener('submit', handleFormSubmit);
    }

    
});
