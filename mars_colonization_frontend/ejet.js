document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ejet-form');
    const table = document.getElementById('ejet-table').querySelector('tbody');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    let selectedRow = null;

    // Fetch and display e-jets
    const fetchEJets = async () => {
        const response = await fetch('http://localhost:5000/ejets');
        const ejets = await response.json();
        console.log(ejets)
        table.innerHTML = '';
        ejets.forEach(ejet => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${ejet.jetcode}</td>
                <td>${ejet.numberofpassengerseats}</td>
                <td>${ejet.nuclearenginepower}</td>
                <td>${ejet.madeyear}</td>
                <td>${ejet.weight}</td>
                <td>${ejet.powersource}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to edit and delete buttons
            row.querySelector('.edit').addEventListener('click', () => selectRow(row));
            row.querySelector('.delete').addEventListener('click', () => deleteEJet(ejet.jetcode));
        });
    };

    // Select a row for editing
    const selectRow = (row) => {
        selectedRow = row;
        form.jetcode.value = row.cells[0].innerText;
        form.numberofpassengerseats.value = row.cells[1].innerText;
        form.nuclearenginepower.value = row.cells[2].innerText;
        form.madeyear.value = row.cells[3].innerText;
        form.weight.value = row.cells[4].innerText;
        form.powersource.value = row.cells[5].innerText;
    };

    // Submit form (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const ejet = Object.fromEntries(formData.entries());

        if (selectedRow) {
            // Update e-jet
            const response = await fetch(`http://localhost:5000/ejets/${ejet.jetcode}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ejet)
            });
            await response.json();
            fetchEJets();
            selectedRow = null;
            form.reset();
        } else {
            // Create e-jet
            const response = await fetch('http://localhost:5000/ejets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ejet)
            });
            await response.json();
            fetchEJets();
            form.reset();
        }
    });

    // Update button (same as submit)
    updateButton.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });

    // Delete e-jet
    const deleteEJet = async (id) => {
        await fetch(`http://localhost:5000/ejets/${id}`, {
            method: 'DELETE'
        });
        fetchEJets();
    };

    // Initialize
    fetchEJets();
});
