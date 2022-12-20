export const getDate = (patient) =>
{
    return [patient.yearOfBirth, patient?.monthOfBirth ?? 1, patient?.dayOfBirth ?? 1].join('-');
}