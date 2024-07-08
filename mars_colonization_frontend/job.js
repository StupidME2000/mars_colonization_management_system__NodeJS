document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('job-form');
    const table = document.getElementById('job-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display jobs
    const fetchJobs = async () => {
        const response = await fetch('http://localhost:5000/jobs');
        const jobs = await response.json();
        table.innerHTML = '';
        jobs.forEach(job => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${job.jobid}</td>
                <td>${job.jobtitle}</td>
                <td>${job.jobdescription}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteJob(job.jobid));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.jobid.value = row.cells[0].innerText;
        form.jobtitle.value = row.cells[1].innerText;
        form.jobdescription.value = row.cells[2].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const job = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update job
            const response = await fetch(`http://localhost:5000/jobs/${job.jobid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(job)
            });
            await response.json();
            fetchJobs();
            selectedRow = null;
            form.reset();
        } else {
            // Create job
            const response = await fetch('http://localhost:5000/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(job)
            });
            await response.json();
            fetchJobs();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete job
    const deleteJob = async (id) => {
        await fetch(`http://localhost:5000/jobs/${id}`, {
            method: 'DELETE'
        });
        fetchJobs();
    };

    // Initialize
    fetchJobs();
});
