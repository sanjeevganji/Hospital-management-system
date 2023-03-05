create table User (
    `Username` varchar(256) primary key,
    `Password` text not null,
    `Type` varchar(16) not null,
    `Name` varchar(256) not null,
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
    `Important` boolean default false not null,
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
    `Priority` int not null,
    `Patient` int,
    `Doctor` varchar(256),
    `Date` date not null,
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

drop table if exists `Patient_Admission`;
drop table if exists `Patient_Appointment`;
drop table if exists `Prescription_Treatment`;
drop table if exists `Prescription_Test`;
drop table if exists `Appointment`;
drop table if exists `Prescription`;
drop table if exists `Admission`;
drop table if exists `Room`;
drop table if exists `User`;
drop table if exists `Test`;
drop table if exists `Patient`;
drop table if exists `Treatment`;

insert into User (`Username`,`Password`,`Name`,`Type`) values 
('Admin', 'pass', 'Atishay','admin'),
('Pabitra', 'pass','Pabitra', 'doctor'),
('Rudrak', 'pass','Rudrak', 'frontdesk'),
('Akash', 'pass','Akash', 'dataentry');