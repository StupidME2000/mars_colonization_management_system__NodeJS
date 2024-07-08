document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trip-form');
    const table = document.getElementById('trip-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display trips
    const fetchTrips = async () => {
        const response = await fetch('http://localhost:5000/trips');
        const trips = await response.json();
        table.innerHTML = '';
        trips.forEach(trip => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${trip.tripid}</td>
                <td>${trip.jetcode}</td>
                <td>${trip.launchdate}</td>
                <td>${trip.returndate}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteTrip(trip.tripid));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.tripid.value = row.cells[0].innerText;
        form.jetcode.value = row.cells[1].innerText;
        form.launchdate.value = row.cells[2].innerText;
        form.returndate.value = row.cells[3].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const trip = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update trip
            const response = await fetch(`http://localhost:5000/trips/${trip.tripid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trip)
            });
            await response.json();
            fetchTrips();
            selectedRow = null;
            form.reset();
        } else {
            // Create trip
            const response = await fetch('http://localhost:5000/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trip)
            });
            await response.json();
            fetchTrips();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete trip
    const deleteTrip = async (id) => {
        await fetch(`http://localhost:5000/trips/${id}`, {
            method: 'DELETE'
        });
        fetchTrips();
    };

    // Initialize
    fetchTrips();
});
