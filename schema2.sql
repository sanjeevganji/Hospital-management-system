create table User (
    `ID` int primary key auto_increment,
    `Username` text not null,
    `Password` text not null,
    `Type` varchar(16) not null,
    UNIQUE (`Username`),
    CHECK (`Type` IN ('frontdesk','admin','dataentry', 'doctor')) 
);

create table Room (
    `Number` int primary key,
    `Type` text not null,
    `Beds_avail` int not null,
)

create table Test (
    `ID` int primary key auto_increment,
    `Name` text not null,
    `Date` datetime not null,
    `Result` text,
    `Report` blob,
)

create table Treatment (
    `ID` int primary key auto_increment,
    `Date` datetime not null,
    `Name` text not null,
    `Dosage` text not null,
)

create table Patient (
    `ID` int primary key auto_increment,
    `Name` text not null,
)

create table Prescription (
    `ID` int primary key auto_increment,
)

create table Prescription_Treatment (
    `ID` int,
    `Treatment` int foreign key REFERENCES Treatment(ID),
)

create table Prescription_Test (
    `ID` int,
    `Test` int foreign key REFERENCES Test(ID),
)

create table Admission (
    `ID` int primary key auto_increment,
    `Patient` int foreign key REFERENCES Patient(ID),
    `Room` int foreign key REFERENCES Room("Number"),
    `Admit_date` datetime not null,
    `Discharge_date` datetime,
)

create table Appointment (
    `ID` int primary key auto_increment,
    `Prescription` int foreign key REFERENCES Prescription(ID),
    `Patient` int foreign key REFERENCES Patient(ID),
    `Doctor` int foreign key REFERENCES User(ID),
    `Date` datetime not null,
)

create table Patient_Appointment (
    `ID` int,
    `Appointment` int foreign key REFERENCES Appointment(ID),
)

create table Patient_Admission (
    `ID` int,
    `Admission` int foreign key REFERENCES Admission(ID),
)



insert into Users (username,password,type) values ('Admin', 'pass', 'admin');
insert into Users (username,password,type) values ('Prabitra', 'pass', 'doctor');
insert into Users (username,password,type) values ('Rudrak', 'pass', 'frontdesk');
insert into Users (username,password,type) values ('Akash', 'pass', 'dataentry');