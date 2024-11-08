CREATE TABLE IF NOT EXISTS employee (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('worker', 'manager', 'admin'))
);

CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    project_manager_id VARCHAR(50),
    FOREIGN KEY (project_manager_id) REFERENCES employee(id),
    CONSTRAINT check_manager_role CHECK (
        project_manager_id IN (
            SELECT id FROM employee WHERE role = 'manager'
        )
    )
);

CREATE TABLE IF NOT EXISTS payment (
    id VARCHAR(50) PRIMARY KEY,
    payment_date TIMESTAMP WITH TIME ZONE,
    payment DECIMAL(10,2),
    employee_id VARCHAR(50) REFERENCES employee(id)
);

ALTER TABLE timesheet
    ADD CONSTRAINT fk_employee
    FOREIGN KEY (employee_id) REFERENCES employee(id);

ALTER TABLE timesheet
    ADD CONSTRAINT fk_project
    FOREIGN KEY (project_id) REFERENCES project(id);

ALTER TABLE timesheet
    ADD CONSTRAINT check_approver_role CHECK (
        approved_by IS NULL OR
        approved_by IN (
            SELECT id FROM employee WHERE role IN ('manager', 'admin')
        )
    );