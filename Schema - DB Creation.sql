CREATE TABLE Departments (
    Department_ID INT NOT NULL AUTO_INCREMENT,
    Department_Name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (Department_ID)
);

CREATE TABLE Users (
    User_ID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL,
    Password_hash VARCHAR(255) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (User_ID),
    CONSTRAINT unique_user_email UNIQUE (Email)
);

CREATE TABLE Instructors (
    Instructor_ID INT NOT NULL AUTO_INCREMENT,
    Instructor_Name VARCHAR(255) NOT NULL,
    Faculty_Type VARCHAR(255) NOT NULL,
    Department_ID INT NOT NULL,
    CONSTRAINT pk_instructors PRIMARY KEY (Instructor_ID),
    CONSTRAINT Faculty_Type CHECK (Faculty_Type IN ('Full-time', 'Part-time', 'Phd Scholar')),
    CONSTRAINT fk_instructors_dept FOREIGN KEY (Department_ID) REFERENCES
    Departments(Department_ID)
);

CREATE TABLE Courses (
    Course_ID INT NOT NULL AUTO_INCREMENT,
    Course_Code VARCHAR(10) NOT NULL,  -- Unique course code
    Course_Name VARCHAR(255) NOT NULL,
    Department_ID INT NOT NULL,
    CONSTRAINT pk_courses PRIMARY KEY (Course_ID),
    CONSTRAINT unique_course_code UNIQUE (Course_Code),  -- Ensure Course_Code is unique
    CONSTRAINT fk_courses_dept FOREIGN KEY (Department_ID) REFERENCES Departments(Department_ID)
);

CREATE TABLE Reviews (
    User_Id INT NOT NULL,
    Instructor_Id INT NOT NULL,
    Course_Id INT NOT NULL,
    Date DATE DEFAULT CURRENT_DATE,
    Grade VARCHAR(2),
    Rating INT NOT NULL,
    Difficulty_level INT NOT NULL,
    Take_again BOOLEAN NOT NULL,
    Mandatory_Attendance BOOLEAN NOT NULL,
    Review_text VARCHAR(350) NOT NULL,
    CONSTRAINT pk_reviews PRIMARY KEY (User_Id, Instructor_Id, Course_Id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (User_Id) REFERENCES Users(User_ID),
    CONSTRAINT fk_reviews_instructor FOREIGN KEY (Instructor_Id) REFERENCES
    Instructors(Instructor_ID),
    CONSTRAINT fk_reviews_course FOREIGN KEY (Course_Id) REFERENCES Courses(Course_ID),
    CONSTRAINT chk_rating CHECK (Rating BETWEEN 1 AND 5),
    CONSTRAINT chk_difficulty_level CHECK (Difficulty_level BETWEEN 1 AND 5)
);