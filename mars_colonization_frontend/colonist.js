document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colonist-form');
    const table = document.getElementById('colonist-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display colonists
    const fetchColonists = async () => {
        const response = await fetch('http://localhost:5000/colonists');
        const colonists = await response.json();
        table.innerHTML = '';
        colonists.forEach(colonist => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${colonist.marscolonizationid}</td>
                <td>${colonist.firstname}</td>
                <td>${colonist.middlename}</td>
                <td>${colonist.surname}</td>
                <td>${colonist.dateofbirth}</td>
                <td>${colonist.qualification}</td>
                <td>${colonist.age}</td>
                <td>${colonist.earthaddress}</td>
                <td>${colonist.gender}</td>
                <td>${colonist.contactno}</td>
                <td>${colonist.civilstatus}</td>
                <td>${colonist.familymemberscount}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteColonist(colonist.MarsColonizationID));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.MarsColonizationID.value = row.cells[0].innerText;
        form.FirstName.value = row.cells[1].innerText;
        form.MiddleName.value = row.cells[2].innerText;
        form.Surname.value = row.cells[3].innerText;
        form.DateOfBirth.value = row.cells[4].innerText;
        form.Qualification.value = row.cells[5].innerText;
        form.Age.value = row.cells[6].innerText;
        form.EarthAddress.value = row.cells[7].innerText;
        form.Gender.value = row.cells[8].innerText;
        form.ContactNo.value = row.cells[9].innerText;
        form.CivilStatus.value = row.cells[10].innerText;
        form.FamilyMembersCount.value = row.cells[11].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const colonist = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update colonist
            const response = await fetch(`http://localhost:5000/colonists/${colonist.MarsColonizationID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colonist)
            });
            await response.json();
            fetchColonists();
            selectedRow = null;
            form.reset();
        } else {
            // Create colonist
            const response = await fetch('http://localhost:5000/colonists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colonist)
            });
            await response.json();
            fetchColonists();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete colonist
    const deleteColonist = async (id) => {
        await fetch(`http://localhost:5000/colonists/${id}`, {
            method: 'DELETE'
        });
        fetchColonists();
    };

    // Initialize
    fetchColonists();
});
