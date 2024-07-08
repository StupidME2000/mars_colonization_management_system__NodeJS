document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dependent-form');
    const table = document.getElementById('dependent-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display dependents
    const fetchDependents = async () => {
        const response = await fetch('http://localhost:5000/dependents');
        const dependents = await response.json();
        table.innerHTML = '';
        dependents.forEach(dependent => {
            const row = table.insertRow();
            console.log(dependent);
            row.innerHTML = `
                <td>${dependent.dependentid}</td>
                <td>${dependent.name}</td>
                <td>${dependent.dateofbirth}</td>
                <td>${dependent.relationshiptocolonist}</td>
                <td>${dependent.marscolonizationid}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteDependent(dependent.DependentID));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.DependentID.value = row.cells[0].innerText;
        form.Name.value = row.cells[1].innerText;
        form.DateOfBirth.value = row.cells[3].innerText;
        form.Relationship.value = row.cells[4].innerText;
        form.MarsColonizationID.value = row.cells[5].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const dependent = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update dependent
            const response = await fetch(`http://localhost:5000/dependents/${dependent.DependentID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dependent)
            });
            await response.json();
            fetchDependents();
            selectedRow = null;
            form.reset();
        } else {
            // Create dependent
            const response = await fetch('http://localhost:5000/dependents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dependent)
            });
            await response.json();
            fetchDependents();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete dependent
    const deleteDependent = async (id) => {
        await fetch(`http://localhost:5000/dependents/${id}`, {
            method: 'DELETE'
        });
        fetchDependents();
    };

    // Initialize
    fetchDependents();
});
