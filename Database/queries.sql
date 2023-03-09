select Appointment.ID AS appID,
    Treatment.ID AS treatmentID,
    Treatment.Name AS treatmentName,
    Treatment.Dosage AS Dosage,
    Treatment.Date AS Date
from Treatment, Prescription_Treatment, Appointment
where Appointment.Patient = 103 and Appointment.Prescription = Prescription_Treatment.ID and Prescription_Treatment.Treatment = Treatment.ID;



SELECT Patient.*,
    CASE WHEN Admission.ID IS NOT NULL AND Admission.Discharge_date IS NULL
            THEN true
            ELSE false
          END AS admitted
FROM Patient
    LEFT JOIN Admission ON Patient.ID = Admission.Patient
ORDER BY Patient.ID DESC;





Select Admission.ID AS ID, Admission.Room
from Admission
WHERE Admission.Patient = 139 AND Admission.Discharge_date IS NULL;



SELECT Patient.*, Admission.Room AS Room, Room.Type AS Type,
    CASE WHEN Admission.ID IS NOT NULL AND Admission.Discharge_date IS NULL
            THEN true
            ELSE false
          END AS admitted
FROM Patient
    LEFT JOIN Admission ON Patient.ID = Admission.Patient AND Admission.Discharge_date IS NULL
    LEFT JOIN Room ON Room.Number = Admission.Room
ORDER BY Patient.ID DESC;




SELECT Admission.ID AS appID, Admission.Room AS Room, Admission.Admit_date As Admit_date, Admission.Discharge_date AS Discharge_Date,
    Patient.Name AS Name, Patient.ID AS Patient
FROM Admission
    JOIN Patient ON Admission.Patient = Patient.ID
ORDER BY Admission.ID DESC
LIMIT 100;







