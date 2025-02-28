const backendUrl ="data-entry-git-main-olaniyan-mustaphas-projects.vercel.app";

function fetchData() {
	fetch('${backendUrl}/data')
		.then(response => response.json())
		.then(data => {
		renderTable(data);
	})
		.catch(error => {
		console.error('Error fetching data:', error);
	});
}
function filterDataByDate() {
		const filterDate = document.getElementById('date').value;

		fetch(`${backendUrl}/data?date=${filterDate}`)
			.then(response => response.json())
			.then(data => {
				renderTable(data);
			})
			.catch(error => {
				console.error('Error filtering data:', error);
				alert('Failed to filter data. Check the console for details.');
			});
	}


function renderTable(data = []) {
	const tbody = document.querySelector('#dataTable tbody');
	const searchMessage = document.getElementById('searchMessage');
				
	if (!tbody || !searchMessage) {
		console.error('Table body or search message element not found!');
		return;
	}

	tbody.innerHTML = ''; // Clear existing rows

	if (data.length === 0) {
		searchMessage.innerText = 'No datas found.'; // Display "No datas found" message
		} else {
			searchMessage.innerText = ''; // Clear the message if datas are found
			data.forEach((item) => {
				const row = `<tr data-id="${item.id}">
					<td>${item.name}</td>
					<td>${item.date}</td>
					<td>${item.b150}</td>
					<td>${item.b200}</td>
					<td>${item.b250}</td>
					<td>${item.b700}</td>
					<td>${item.btol}</td>
				</tr>`;
				tbody.innerHTML += row;
			});
}

console.log('Table rendered with data:', data); // Log the rendered data
}	
	
function saveData() {
	const name = document.getElementById('name').value;
	const date = document.getElementById('date').value;
	const b150 = parseFloat(document.getElementById('b150').value);
	const b200 = parseFloat(document.getElementById('b200').value);
	const b250 = parseFloat(document.getElementById('b250').value);
	const b700 = parseFloat(document.getElementById('b700').value);
	const btol = (((b150 * 150) + (b200 * 200) + (b250 * 250) + (b700 * 700)) / 4) * 3;
	const editId = document.getElementById('editId').value;
	
	// Validate name
	if (name === '') {
		alert('Name is required.');
		return;
	}

	// Validate date
	if (date === '') {
		alert('Date is required.');
		return;
	}

	// Validate field1 (ensure it's a number)
	if (isNaN(b150)) {
		alert('150 bread must be a number.');
		return;
	}

	// Validate field2 (ensure it's a number)
	if (isNaN(b200)) {
		alert('200 bread must be a number.');
		return;
	}
	 // Validate field3 (ensure it's a number)
	if (isNaN(b250)) {
		alert('250 bread must be a number.');
	return;
	}
	// Validate field3 (ensure it's a number)
	if (isNaN(b700)) {
		alert('700 bread must be a number.');
	return;
	}

	const data = { name, date, b150, b200, b250, b700, btol};

	let url = '${backendUrl}/save';
	let method = 'POST';

	if (editId) {
	// If editing, update the existing record
	url = `${backendUrl}/edit/${editId}`;
	method = 'PUT';
}

fetch(url, {
	method: method,
	headers: {
	   'Content-Type': 'application/json',
	},
	body: JSON.stringify(data),
})
	.then(response => response.text())
	.then(message => {
		alert(message);
		calculateSum1();
		calculateSum2();
		calculateSum3();
		calculateSum4();
		calculateSum5();
		fetchData(); // Refresh the data table
		clearForm();
	})
	.catch(error => console.error('Error:', error));
}



	function editData() {
		const selectedRow = document.querySelector('#dataTable tbody tr.selected');
		if (!selectedRow) {
			alert('Please select a row to edit.');
			return;
}
  // Populate the form fields with the selected row's data
	const cells = selectedRow.getElementsByTagName('td');
	document.getElementById('name').value =  cells[0].innerText;
	document.getElementById('date').value =  cells[1].innerText;
	document.getElementById('b150').value =  cells[2].innerText
	document.getElementById('b200').value =  cells[3].innerText;
	document.getElementById('b250').value =  cells[4].innerText;
	document.getElementById('b700').value =  cells[5].innerText;

	// Add a hidden input to store the selected row's ID
	document.getElementById('editId').value = selectedRow.getAttribute('data-id');
}

function searchData() {
	const searchText = document.getElementById('name').value.toLowerCase();

	fetch(`${backendUrl}/data?search=${searchText}`)
		.then(response => {
			if (!response.ok) {
				if (response.status === 404) {
					return response.json().then(data => {
						throw new Error(data.message); // Throw "No datas found" error
					});
				}
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Search datas:', data);
			renderTable(data);
		})
		.catch(error => {
			console.error('Error searching data:', error);
			alert(error.message); // Display the error message
			renderTable([]); // Clear the table if no datas are found
		});
}

function deleteData() {
	const selectedRow = document.querySelector('#dataTable tbody tr.selected');
	if (!selectedRow) {
		alert('Please select a row to delete.');
	return;
}

	const id = selectedRow.getAttribute('data-id'); // Ensure each row has a data-id attribute

	fetch(`${backendUrl}/delete/${id}`, {
	method: 'DELETE',
})
	.then(response => response.text())
	.then(message => {
		alert(message);
		fetchData(); // Refresh the data table
})
	.catch(error => {
		console.error('Error deleting data:', error);
		alert('Failed to delete data. Check the console for details.');
});
}

		
function calculateSum1() {
	 const date = document.getElementById('date').value;
	 
	fetch(`${backendUrl}/sum1?date=${date}`)
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Sum calculated:', data.sum); // Log the sum
			document.getElementById('sumResult1').innerText = data.sum1;
			calculateSum2();
			calculateSum3();
			calculateSum4();
			calculateSum5();
		})
		.catch(error => {
		console.error('Error:', error);
		alert('Failed to calculate sum. Check the console for details.');
	});
}

function calculateSum2() {
	 const date = document.getElementById('date').value;

		fetch(`${backendUrl}/sum2?date=${date}`)
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Sum calculated:', data.sum); // Log the sum
			document.getElementById('sumResult2').innerText = data.sum2;
		})
		.catch(error => {
		console.error('Error:', error);
		alert('Failed to calculate sum. Check the console for details.');
	});
}
function calculateSum3() {
	 const date = document.getElementById('date').value;

		fetch(`${backendUrl}/sum3?date=${date}`)
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Sum calculated:', data.sum); // Log the sum
			document.getElementById('sumResult3').innerText = data.sum3;
		})
		.catch(error => {
		console.error('Error:', error);
		alert('Failed to calculate sum. Check the console for details.');
	});
}
function calculateSum4() {
	const date = document.getElementById('date').value;

		fetch(`${backendUrl}/sum4?date=${date}`)
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Sum calculated:', data.sum); // Log the sum
			document.getElementById('sumResult4').innerText = data.sum4;
		})
		.catch(error => {
		console.error('Error:', error);
		alert('Failed to calculate sum. Check the console for details.');
	});
}	
function calculateSum5() {
	 const date = document.getElementById('date').value;

		fetch(`${backendUrl}/sum5?date=${date}`)
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Sum calculated:', data.sum); // Log the sum
			document.getElementById('sumResult5').innerText = data.sum5;
		})
		.catch(error => {
		console.error('Error:', error);
		alert('Failed to calculate sum. Check the console for details.');
	});
}

function clearForm() {
	document.getElementById('name').value = '';
	document.getElementById('date').value = '';
	document.getElementById('b150').value = '';
	document.getElementById('b200').value = '';
	document.getElementById('b250').value = '';
	document.getElementById('b700').value = '';
	document.getElementById('btol').value = '';
}
document.addEventListener('DOMContentLoaded', function () {
	// Fetch data when the page loads
	fetchData();
	calculateSum1();
	
	// Add row selection functionality
	 const tbody = document.querySelector('#dataTable tbody');
    if (tbody) {
        tbody.addEventListener('click', function (event) {
            const selectedRow = event.target.closest('tr');
            if (selectedRow) {
                // Remove selection from other rows
                Array.from(tbody.getElementsByTagName('tr')).forEach(row => row.classList.remove('selected'));
                // Mark this row as selected
                selectedRow.classList.add('selected');
			}
	    });
    }
});
