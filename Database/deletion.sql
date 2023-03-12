USE Hospital;

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

delete from `Patient_Admission`;
delete from `Patient_Appointment`;
delete from `Prescription_Treatment`;
delete from `Prescription_Test`;
delete from `Appointment`;
delete from `Prescription`;
delete from `Admission`;
delete from `Room`;
delete from `User`;
delete from `Test`;
delete from `Patient`;
delete from `Treatment`;


`SELECT Username FROM User
LEFT JOIN Appointment ON User.Username = Appointment.Doctor AND Appointment.Prescription IS NULL AND Appointment.Date >= CURDATE()
WHERE User.Type = 'doctor' AND Active
GROUP BY Username
ORDER BY COUNT(Username)
LIMIT 1;`



`(select Username from User where
                User.Active=1 and
                User.Type="doctor" and User.Username not in (select Doctor from Appointment where Date='${fdate}') limit 1)
                union
                (Select Doctor from Appointment, User
                where Appointment.Doctor=User.Username and User.Active=1 and Date='${fdate}' group by Doctor order by count(*) limit 1);`
