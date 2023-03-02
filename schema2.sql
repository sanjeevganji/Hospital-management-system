create table patient{
    id int primary key auto_increment,
    patient_name varchar(255) not null,
}
-- create table drug{
--     id int primary key auto_increment,
--     drug_name varchar(255) not null,
--     drug_price int not null,
-- }

create table test{
    id int primary key auto_increment,

}
create table prescription{
    id int primary key auto_increment,
}

create table treatments{
    id int primary key auto_increment,
    prescription int FOREIGN KEY REFERENCES prescription(id),
    -- treatment_drug int FOREIGN KEY REFERENCES drug(id),
    treatment_drug varchar(255) not null,
    treatment_dosage varchar(255) not null,
}
create table tests{
    id int primary key auto_increment,
    prescription int FOREIGN KEY REFERENCES prescription(id),
    test_name varchar(255) not null,
    test_result varchar(255) not null,
    test_report BYTEA NULL 
}

create user{
    id int primary key auto_increment,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    user_type int not null,
}

create table appointments{
    id int primary key auto_increment,
    patient int FOREIGN KEY REFERENCES patient(id),
    doctor int FOREIGN KEY REFERENCES user(id),
    appointment_datetime datetime not null,
    prescription int FOREIGN KEY REFERENCES prescription(id),
}

create table room{
    id int primary key auto_increment,
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