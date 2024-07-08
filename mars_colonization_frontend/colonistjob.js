document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colonistjob-form');
    const table = document.getElementById('colonistjob-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display colonist jobs
    const fetchColonistJobs = async () => {
        const response = await fetch('http://localhost:5000/colonistjobs');
        const colonistJobs = await response.json();
        table.innerHTML = '';
        colonistJobs.forEach(colonistJob => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${colonistJob.colonistid}</td>
                <td>${colonistJob.jobid}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteColonistJob(colonistJob.colonistid, colonistJob.jobid));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.colonistid.value = row.cells[0].innerText;
        form.jobid.value = row.cells[1].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const colonistJob = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update colonist job
            const response = await fetch(`http://localhost:5000/colonistjobs/${colonistJob.colonistid}/${colonistJob.jobid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colonistJob)
            });
            await response.json();
            fetchColonistJobs();
            selectedRow = null;
            form.reset();
        } else {
            // Create colonist job
            const response = await fetch('http://localhost:5000/colonistjobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colonistJob)
            });
            await response.json();
            fetchColonistJobs();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete colonist job
    const deleteColonistJob = async (colonistid, jobid) => {
        await fetch(`http://localhost:5000/colonistjobs/${colonistid}/${jobid}`, {
            method: 'DELETE'
        });
        fetchColonistJobs();
    };

    // Initialize
    fetchColonistJobs();
});
