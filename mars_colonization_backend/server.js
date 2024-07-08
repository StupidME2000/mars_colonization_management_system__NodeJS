// server.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// CRUD operations for Colonist
app.get('/colonists', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Colonist');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/colonists', async (req, res) => {
    try {
        const {
            MarsColonizationID, FirstName, MiddleName, Surname, DateOfBirth, Qualification, Age, EarthAddress, Gender, ContactNo, CivilStatus, FamilyMembersCount
        } = req.body;
        const result = await pool.query(
            'INSERT INTO Colonist (MarsColonizationID, FirstName, MiddleName, Surname, DateOfBirth, Qualification, Age, EarthAddress, Gender, ContactNo, CivilStatus, FamilyMembersCount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [MarsColonizationID, FirstName, MiddleName, Surname, DateOfBirth, Qualification, Age, EarthAddress, Gender, ContactNo, CivilStatus, FamilyMembersCount]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/colonists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            FirstName, MiddleName, Surname, DateOfBirth, Qualification, Age, EarthAddress, Gender, ContactNo, CivilStatus, FamilyMembersCount
        } = req.body;
        const result = await pool.query(
            'UPDATE Colonist SET FirstName = $1, MiddleName = $2, Surname = $3, DateOfBirth = $4, Qualification = $5, Age = $6, EarthAddress = $7, Gender = $8, ContactNo = $9, CivilStatus = $10, FamilyMembersCount = $11 WHERE MarsColonizationID = $12 RETURNING *',
            [FirstName, MiddleName, Surname, DateOfBirth, Qualification, Age, EarthAddress, Gender, ContactNo, CivilStatus, FamilyMembersCount, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/colonists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Colonist WHERE MarsColonizationID = $1', [id]);
        res.json({ message: 'Colonist deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for Dependent
app.get('/dependents', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Dependent');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/dependents', async (req, res) => {
    try {
        const { DependentID, MarsColonizationID, Name, DateOfBirth, Age, Gender, RelationshipToColonist } = req.body;
        const result = await pool.query(
            'INSERT INTO Dependent (DependentID, MarsColonizationID, Name, DateOfBirth, Age, Gender, RelationshipToColonist) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [DependentID, MarsColonizationID, Name, DateOfBirth, Age, Gender, RelationshipToColonist]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/dependents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { MarsColonizationID, Name, DateOfBirth, Age, Gender, RelationshipToColonist } = req.body;
        const result = await pool.query(
            'UPDATE Dependent SET MarsColonizationID = $1, Name = $2, DateOfBirth = $3, Age = $4, Gender = $5, RelationshipToColonist = $6 WHERE DependentID = $7 RETURNING *',
            [MarsColonizationID, Name, DateOfBirth, Age, Gender, RelationshipToColonist, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/dependents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Dependent WHERE DependentID = $1', [id]);
        res.json({ message: 'Dependent deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for E-Jet
app.get('/ejets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM EJet');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/ejets', async (req, res) => {
    try {
        const { JetCode, NumberOfPassengerSeats, NuclearEnginePower, MadeYear, Weight, PowerSource } = req.body;
        const result = await pool.query(
            'INSERT INTO EJet (JetCode, NumberOfPassengerSeats, NuclearEnginePower, MadeYear, Weight, PowerSource) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [JetCode, NumberOfPassengerSeats, NuclearEnginePower, MadeYear, Weight, PowerSource]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/ejets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { NumberOfPassengerSeats, NuclearEnginePower, MadeYear, Weight, PowerSource } = req.body;
        const result = await pool.query(
            'UPDATE EJet SET NumberOfPassengerSeats = $1, NuclearEnginePower = $2, MadeYear = $3, Weight = $4, PowerSource = $5 WHERE JetCode = $6 RETURNING *',
            [NumberOfPassengerSeats, NuclearEnginePower, MadeYear, Weight, PowerSource, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/ejets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM EJet WHERE JetCode = $1', [id]);
        res.json({ message: 'E-Jet deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for Trip
app.get('/trips', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Trip');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/trips', async (req, res) => {
    try {
        const { TripID, JetCode, LaunchDate, ReturnDate } = req.body;
        const result = await pool.query(
            'INSERT INTO Trip (TripID, JetCode, LaunchDate, ReturnDate) VALUES ($1, $2, $3, $4) RETURNING *',
            [TripID, JetCode, LaunchDate, ReturnDate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/trips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { JetCode, LaunchDate, ReturnDate } = req.body;
        const result = await pool.query(
            'UPDATE Trip SET JetCode = $1, LaunchDate = $2, ReturnDate = $3 WHERE TripID = $4 RETURNING *',
            [JetCode, LaunchDate, ReturnDate, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/trips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Trip WHERE TripID = $1', [id]);
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for House
app.get('/houses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM House');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/houses', async (req, res) => {
    try {
        const { ColonyLotNumber, NumberOfRooms, SquareFeet, ColonistID } = req.body;
        const result = await pool.query(
            'INSERT INTO House (ColonyLotNumber, NumberOfRooms, SquareFeet, ColonistID) VALUES ($1, $2, $3, $4) RETURNING *',
            [ColonyLotNumber, NumberOfRooms, SquareFeet, ColonistID]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/houses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { NumberOfRooms, SquareFeet, ColonistID } = req.body;
        const result = await pool.query(
            'UPDATE House SET NumberOfRooms = $1, SquareFeet = $2, ColonistID = $3 WHERE ColonyLotNumber = $4 RETURNING *',
            [NumberOfRooms, SquareFeet, ColonistID, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/houses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM House WHERE ColonyLotNumber = $1', [id]);
        res.json({ message: 'House deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for Job
app.get('/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Job');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/jobs', async (req, res) => {
    try {
        const { JobID, JobTitle, JobDescription } = req.body;
        const result = await pool.query(
            'INSERT INTO Job (JobID, JobTitle, JobDescription) VALUES ($1, $2, $3) RETURNING *',
            [JobID, JobTitle, JobDescription]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { JobTitle, JobDescription } = req.body;
        const result = await pool.query(
            'UPDATE Job SET JobTitle = $1, JobDescription = $2 WHERE JobID = $3 RETURNING *',
            [JobTitle, JobDescription, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Job WHERE JobID = $1', [id]);
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// CRUD operations for ColonistJob
app.get('/colonistjobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ColonistJob');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/colonistjobs', async (req, res) => {
    try {
        const { ColonistID, JobID } = req.body;
        const result = await pool.query(
            'INSERT INTO ColonistJob (ColonistID, JobID) VALUES ($1, $2) RETURNING *',
            [ColonistID, JobID]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/colonistjobs/:colonistID/:jobID', async (req, res) => {
    try {
        const { colonistID, jobID } = req.params;
        await pool.query('DELETE FROM ColonistJob WHERE ColonistID = $1 AND JobID = $2', [colonistID, jobID]);
        res.json({ message: 'ColonistJob deleted successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
