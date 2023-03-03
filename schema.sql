create table patient{
    id int primary key auto_increment,
    patient_name varchar(255) not null,
}

create table treatment{
    id int primary key auto_increment,
    drug varchar(255) not null,
    dosage varchar(255) not null,
    price int not null,
}
create table test{
    id int primary key auto_increment,
    test_name varchar(255) not null,
    result varchar(255) not null,
    report BYTEA NULL 
}
create table prescription{
    id int primary key auto_increment,
}
-- multivalued attributes
create table treatments{
    id int primary key auto_increment,
    prescription int FOREIGN KEY REFERENCES prescription(id),
    treatment int FOREIGN KEY REFERENCES treatment(id),
}
create table tests{
    id int primary key auto_increment,
    prescription int FOREIGN KEY REFERENCES prescription(id),
    test int FOREIGN KEY REFERENCES test(id),
}

create table "user"{
    id int primary key auto_increment,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    user_type int not null,
}

create appointment{
    id int primary key auto_increment,
    appointment_datetime datetime not null,
    prescription int FOREIGN KEY REFERENCES prescription(id),
    doctor int FOREIGN KEY REFERENCES user(id),
    patient int FOREIGN KEY REFERENCES patient(id),
}
-- multivalued attributes
create table appointments{
    patient int FOREIGN KEY REFERENCES patient(id),
    appointment int FOREIGN KEY REFERENCES appointment(id),
}

create table room{
    room_no int primary key auto_increment,
    beds_avail int not null,
    room_type varchar(255) not null,
}
create table admission{
    id int primary key auto_increment,
    admission_datetime datetime not null,
    discharge_datetime datetime not null,
    room int FOREIGN KEY REFERENCES room(room_no),
    patient int FOREIGN KEY REFERENCES patient(id),
    admission_priority int not null,
}