// Éléments DOM
const nameInput = document.getElementById('name');
const firstnameInput = document.getElementById('firstname');
const numberInput = document.getElementById('number');
const createButton = document.getElementById('create');
const clearButton = document.getElementById('clear');
const listDiv = document.getElementById('list');
const contentDiv = document.getElementById('content');

// État de l'application
let students = [];
let currentEditingId = null;

// Afficher les messages à l'utilisateur
const showMessage = (message, isError = false) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className = isError ? 'error-message' : 'success-message';
  
  contentDiv.innerHTML = '';
  contentDiv.appendChild(messageElement);
  
  // Effacer le message après 3 secondes
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
};

// Charger la liste des étudiants
const loadStudents = async () => {
  try {
    const response = await fetch('/api/student');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des étudiants');
    }
    students = await response.json();
    displayStudents();
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Afficher la liste des étudiants
const displayStudents = () => {
  listDiv.innerHTML = '';
  
  if (students.length === 0) {
    listDiv.innerHTML = '<p>Aucun étudiant enregistré</p>';
    return;
  }
  
  const table = document.createElement('table');
  
  // En-tête du tableau
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  ['Numéro', 'Nom', 'Prénoms', 'Actions'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Corps du tableau
  const tbody = document.createElement('tbody');
  
  students.forEach(student => {
    const tr = document.createElement('tr');
    
    // Numéro de l'étudiant
    const tdNumber = document.createElement('td');
    tdNumber.textContent = student.number;
    tr.appendChild(tdNumber);
    
    // Nom de l'étudiant
    const tdName = document.createElement('td');
    tdName.textContent = student.l_name;
    tr.appendChild(tdName);
    
    // Prénom de l'étudiant
    const tdFirstname = document.createElement('td');
    tdFirstname.textContent = student.f_name;
    tr.appendChild(tdFirstname);
    
    // Actions (éditer, supprimer)
    const tdActions = document.createElement('td');
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Éditer';
    editButton.className = 'edit-button';
    editButton.onclick = () => editStudent(student);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => deleteStudent(student._id);
    
    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);
    tr.appendChild(tdActions);
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  listDiv.appendChild(table);
};

// Ajouter ou mettre à jour un étudiant
const saveStudent = async () => {
  const name = nameInput.value.trim();
  const firstname = firstnameInput.value.trim();
  const number = numberInput.value.trim();
  
  if (!name || !firstname || !number) {
    showMessage('Tous les champs sont obligatoires', true);
    return;
  }
  
  try {
    let response;
    
    if (currentEditingId) {
      // Mise à jour d'un étudiant existant
      response = await fetch(`/api/student/${currentEditingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, firstname })
      });
    } else {
      // Création d'un nouvel étudiant
      response = await fetch('/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, firstname, number })
      });
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de l'enregistrement");
    }
    
    const savedStudent = await response.json();
    
    // Réinitialiser le formulaire et recharger les étudiants
    clearForm();
    loadStudents();
    
    showMessage(currentEditingId 
      ? 'Étudiant mis à jour avec succès' 
      : 'Étudiant ajouté avec succès');
      
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Éditer un étudiant
const editStudent = (student) => {
  nameInput.value = student.l_name;
  firstnameInput.value = student.f_name;
  numberInput.value = student.number;
  numberInput.disabled = true; // Le numéro étudiant ne peut pas être modifié
  
  currentEditingId = student._id;
  createButton.textContent = 'Mettre à jour';
};

// Supprimer un étudiant
const deleteStudent = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/student/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    
    // Recharger la liste des étudiants
    loadStudents();
    showMessage('Étudiant supprimé avec succès');
    
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Réinitialiser le formulaire
const clearForm = () => {
  nameInput.value = '';
  firstnameInput.value = '';
  numberInput.value = '';
  numberInput.disabled = false;
  currentEditingId = null;
  createButton.textContent = 'Créer';
};

// Ajouter les écouteurs d'événements
createButton.addEventListener('click', saveStudent);
clearButton.addEventListener('click', clearForm);

// Charger la liste des étudiants au chargement de la page
document.addEventListener('DOMContentLoaded', loadStudents);