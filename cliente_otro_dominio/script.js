
window.onload = () => {

    // JWT
    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        showMainContent();
        fetchBooks();
    } else {
        showLoginForm();
    }

    // Add event listeners
    document.querySelector('#loginButton').addEventListener('click', login);
    document.querySelector('#logoutButton').addEventListener('click', logout);
    document.querySelector('#registerButton').addEventListener('click', registerUser);


    // Pedimos a la API los libros actuales en base de datos
    fetchBooks();

    // Añadimos al botón de submit del formulario un listener para enlazarlo a la función createBook
    document.querySelector('#createButton').addEventListener('click', createBook);

    document.querySelector('#downloadButton').addEventListener('click', downloadVideo);
}

// Show the login form and hide the main content
function showLoginForm() {
    document.querySelector('#login-section').style.display = 'block';
    document.querySelector('#register-section').style.display = 'block';
    document.querySelector('#main-content').style.display = 'none';
}


// Show the main content and hide the login form
function showMainContent() {
    document.querySelector('#login-section').style.display = 'none';
    document.querySelector('#register-section').style.display = 'none';
    document.querySelector('#main-content').style.display = 'block';
}

// Login function
async function login() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            showMainContent();
            fetchBooks();
        } else {
            alert(data.message || 'Error de autenticación');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Registration function
async function registerUser() {
    const username = document.querySelector('#register-username').value;
    const password = document.querySelector('#register-password').value;

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Usuario registrado exitosamente');
        } else {
            alert(data.message || 'Error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    showLoginForm();
}

// Fetch books from the API
async function fetchBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoginForm();
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const books = await response.json();
            eraseTable();
            updateTable(books);
        } else if (response.status === 401) {
            alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
            logout();
        } else {
            console.error('Error fetching books:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function eraseTable() {
    // Accedemos a la lista de filas de la tabla <tr> y las borramos todas
    let filas = Array.from(document.querySelectorAll('tbody tr'));
    for (let fila of filas) {
        fila.remove();
    }
}

function updateTable(books) {
    let table = document.getElementById("book-table");

    // Iteramos books: por cada book
    for (let book of books) {
        // Creamos y añadimos a la tabla una nueva fila (<tr>)
        let row = document.createElement('tr');
        table.append(row);
        // Creamos y añadimos a la fila las celdas de id, título, autor, año, acciones.
        // Las celdas id, título, autor, año se deben rellenar con la info del JSON.
        // Las celdas título, autor, año deben tener el atributo contenteditable a true.
        let celdaId = document.createElement('td');
        celdaId.innerHTML = book.id;
        row.append(celdaId);
        let celdaTitulo = document.createElement('td');
        celdaTitulo.innerHTML = book.title;
        celdaTitulo.contentEditable = true;
        row.append(celdaTitulo);
        let celdaAutor = document.createElement('td');
        celdaAutor.innerHTML = book.author;
        celdaAutor.contentEditable = true;
        row.append(celdaAutor);
        let celdaAno = document.createElement('td');
        celdaAno.innerHTML = book.year;
        celdaAno.contentEditable = true;
        row.append(celdaAno);
        // Creamos dos botones (editar y eliminar) y los añadimos a la celda acciones.
        // Hay que añadir a cada botónn el listener correspondiente para enlazarlos a las funciones editBook i deleteBook, respectivamente.
        let celdaAcciones = document.createElement('td');
        row.append(celdaAcciones);
        let buttonEdit = document.createElement('button');
        buttonEdit.innerHTML = "Modificar";
        buttonEdit.addEventListener('click', editBook);
        celdaAcciones.append(buttonEdit);
        let buttonDelete = document.createElement('button');
        buttonDelete.innerHTML = "Eliminar";
        buttonDelete.addEventListener('click', deleteBook);
        celdaAcciones.append(buttonDelete);
    }
}

async function deleteBook(event) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para eliminar un libro.');
        showLoginForm();
        return;
    }

    // Leemos el contenido de la columna id de esa fila
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
            fetchBooks();
        } else if (response.status === 401) {
            alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
            logout();
        } else {
            console.error('Error deleting book:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editBook(event) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para modificar un libro.');
        showLoginForm();
        return;
    }

    // Leemos el contenido de las columnas id, título, autor, año de esa fila
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;
    let titulo = celdas[1].innerHTML;
    let autor = celdas[2].innerHTML;
    let ano = celdas[3].innerHTML;

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: id,
                title: titulo,
                author: autor,
                year: ano
            }),
        });

        if (response.ok) {
            fetchBooks();
        } else if (response.status === 401) {
            alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
            logout();
        } else {
            console.error('Error updating book:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createBook() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para añadir un libro.');
        showLoginForm();
        return;
    }

    // Leemos el contenido del formulario: título, autor, año
    let titulo = document.querySelector("#book-title").value;
    let autor = document.querySelector("#book-author").value;
    let ano = document.querySelector("#book-year").value;

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: titulo,
                author: autor,
                year: ano
            }),
        });

        if (response.ok) {
            fetchBooks();
        } else if (response.status === 401) {
            alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
            logout();
        } else {
            console.error('Error creating book:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function downloadVideo() {
    console.log('Donwloading video...');
    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // 2. Configure it: GET-request for the URL /article/.../load
    xhr.open('GET', './vid.mp4');

    // 3. Set the responseType to 'blob' to handle binary data
    xhr.responseType = 'blob';

    // 4. Send the request over the network
    xhr.send();

    // 5. This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            console.log(`Done downloading video!`); // response is the server response

            // CREATE A TEMPORARY DOWNLOAD LINK
            // Create a blob URL for the video
            console.log(`Creating download link!`);
            const blob = new Blob([xhr.response], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);

            // Create a temporary download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded_video.mp4'; // Suggested file name
            document.body.appendChild(a);
            a.click();

            // Remove the temporary link
            document.body.removeChild(a);
        }
    };

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            console.log(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
            console.log(`Received ${event.loaded} bytes`); // no Content-Length
        }

    };

    xhr.onerror = function () {
        alconsole.log("Request failed");
    };
}