create table Users (
    `id` int primary key auto_increment,
    `username` varchar(32) not null,
    `password` varchar(32) not null,
    `type` varchar(16) not null,
    UNIQUE (`username`),
    CHECK (type IN ('frontdesk','admin','dataentry', 'doctor')) 
);
insert into Users (username,password,type) values ('Admin', 'pass', 'admin');
insert into Users (username,password,type) values ('Prabitra', 'pass', 'doctor');
insert into Users (username,password,type) values ('Rudrak', 'pass', 'frontdesk');
insert into Users (username,password,type) values ('Akash', 'pass', 'dataentry');