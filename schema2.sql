create table User (
    `Username` varchar(256) primary key,
    `Password` text not null,
    `Type` varchar(16) not null,
    CHECK (`Type` IN ('frontdesk','admin','dataentry', 'doctor')) 
);

create table Room (
    `Number` int primary key,
    `Type` text not null,
    `Beds_avail` int not null
);

create table Test (
    `ID` int primary key auto_increment,
    `Name` text not null,
    `Date` datetime not null,
    `Result` text,
    `Report` blob
);

create table Treatment (
    `ID` int primary key auto_increment,
    `Date` datetime not null,
    `Name` text not null,
    `Dosage` text not null
);

create table Patient (
    `ID` int primary key auto_increment,
    `Name` text not null
);

create table Prescription (
    `ID` int primary key auto_increment
);

create table Prescription_Treatment (
    `ID` int,
    `Treatment` int,
    foreign key (`Treatment`) REFERENCES `Treatment`(`ID`)
);

create table Prescription_Test (
    `ID` int,
    `Test` int,
    foreign key (`Test`) REFERENCES `Test`(`ID`)
);

create table Admission (
    `ID` int primary key auto_increment,
    `Patient` int,
    `Room` int,
    `Admit_date` datetime not null,
    `Discharge_date` datetime,
    foreign key (`Patient`) REFERENCES `Patient`(`ID`),
    foreign key (`Room`) REFERENCES `Room`(`Number`)
);

create table Appointment (
    `ID` int primary key auto_increment,
    `Prescription` int,
    `Patient` int,
    `Doctor` varchar(256),
    `Date` datetime not null,
    foreign key (`Prescription`) REFERENCES `Prescription`(`ID`),
    foreign key (`Patient`) REFERENCES `Patient`(`ID`),
    foreign key (`Doctor`) REFERENCES `User`(`Username`)
);

create table Patient_Appointment (
    `ID` int,
    `Appointment` int,
    foreign key (`Appointment`) REFERENCES `Appointment`(`ID`)
);

create table Patient_Admission (
    `ID` int,
    `Admission` int,
    foreign key (`Admission`) REFERENCES `Admission`(`ID`)
);



insert into User (`Username`,`Password`,`Type`) values 
('Admin', 'pass', 'admin'),
('Prabitra', 'pass', 'doctor'),
('Rudrak', 'pass', 'frontdesk'),
('Akash', 'pass', 'dataentry');