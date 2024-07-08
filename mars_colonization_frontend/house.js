document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('house-form');
    const table = document.getElementById('house-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display houses
    const fetchHouses = async () => {
        const response = await fetch('http://localhost:5000/houses');
        const houses = await response.json();
        table.innerHTML = '';
        houses.forEach(house => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${house.colonylotnumber}</td>
                <td>${house.numberofrooms}</td>
                <td>${house.squarefeet}</td>
                <td>${house.colonistid}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteHouse(house.colonylotnumber));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.colonylotnumber.value = row.cells[0].innerText;
        form.numberofrooms.value = row.cells[1].innerText;
        form.squarefeet.value = row.cells[2].innerText;
        form.colonistid.value = row.cells[3].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const house = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update house
            const response = await fetch(`http://localhost:5000/houses/${house.colonylotnumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(house)
            });
            await response.json();
            fetchHouses();
            selectedRow = null;
            form.reset();
        } else {
            // Create house
            const response = await fetch('http://localhost:5000/houses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(house)
            });
            await response.json();
            fetchHouses();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete house
    const deleteHouse = async (id) => {
        await fetch(`http://localhost:5000/houses/${id}`, {
            method: 'DELETE'
        });
        fetchHouses();
    };

    // Initialize
    fetchHouses();
});
