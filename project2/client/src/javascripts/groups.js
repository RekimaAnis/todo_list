// Éléments DOM
const groupsListDiv = document.getElementById('groups-list');
const addGroupsDiv = document.getElementById('addGroups');
const buttons = groupsListDiv.querySelectorAll('button');

// Variables d'état
let currentGroup = null;
let students = [];

// Afficher les messages à l'utilisateur
const showMessage = (message, isError = false) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className = isError ? 'error-message' : 'success-message';
  
  // Ajouter au début de addGroupsDiv
  if (addGroupsDiv.firstChild) {
    addGroupsDiv.insertBefore(messageElement, addGroupsDiv.firstChild);
  } else {
    addGroupsDiv.appendChild(messageElement);
  }
  
  // Effacer le message après 3 secondes
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
};

// Styliser le bouton sélectionné
const updateSelectedButton = (selectedButton) => {
  buttons.forEach(button => {
    button.classList.remove('selected-button');
  });
  
  if (selectedButton) {
    selectedButton.classList.add('selected-button');
  }
};

// Charger les étudiants sans groupe
const loadStudentsWithoutGroup = async () => {
  try {
    const response = await fetch('/api/groups/no-group');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des étudiants sans groupe');
    }
    students = await response.json();
    displayStudentsWithoutGroup();
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Charger les étudiants d'un groupe spécifique
const loadStudentsInGroup = async (groupNumber) => {
  try {
    const response = await fetch(`/api/groups/${groupNumber}`);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des étudiants du groupe ${groupNumber}`);
    }
    students = await response.json();
    displayStudentsInGroup(groupNumber);
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Afficher les étudiants sans groupe
const displayStudentsWithoutGroup = () => {
  addGroupsDiv.innerHTML = '<h2>Étudiants sans groupe</h2>';
  
  if (students.length === 0) {
    addGroupsDiv.innerHTML += '<p>Tous les étudiants ont été assignés à un groupe</p>';
    return;
  }
  
  const table = createStudentTable();
  
  students.forEach(student => {
    const tr = document.createElement('tr');
    
    // Numéro étudiant
    const tdNumber = document.createElement('td');
    tdNumber.textContent = student.number;
    tr.appendChild(tdNumber);
    
    // Nom
    const tdName = document.createElement('td');
    tdName.textContent = student.l_name;
    tr.appendChild(tdName);
    
    // Prénom
    const tdFirstname = document.createElement('td');
    tdFirstname.textContent = student.f_name;
    tr.appendChild(tdFirstname);
    
    // Actions (assigner à un groupe)
    const tdActions = document.createElement('td');
    
    const groupSelect = document.createElement('select');
    for (let i = 1; i <= 6; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Groupe ${i}`;
      groupSelect.appendChild(option);
    }
    
    const assignButton = document.createElement('button');
    assignButton.textContent = 'Assigner';
    assignButton.className = 'assign-button';
    
    assignButton.onclick = () => assignStudentToGroup(student._id, groupSelect.value);
    
    tdActions.appendChild(groupSelect);
    tdActions.appendChild(assignButton);
    tr.appendChild(tdActions);
    
    table.querySelector('tbody').appendChild(tr);
  });
  
  addGroupsDiv.appendChild(table);
};

// Afficher les étudiants d'un groupe spécifique
const displayStudentsInGroup = (groupNumber) => {
  addGroupsDiv.innerHTML = `<h2>Étudiants du groupe ${groupNumber}</h2>`;
  
  if (students.length === 0) {
    addGroupsDiv.innerHTML += '<p>Aucun étudiant dans ce groupe</p>';
    return;
  }
  
  const table = createStudentTable();
  
  students.forEach(student => {
    const tr = document.createElement('tr');
    
    // Numéro étudiant
    const tdNumber = document.createElement('td');
    tdNumber.textContent = student.number;
    tr.appendChild(tdNumber);
    
    // Nom
    const tdName = document.createElement('td');
    tdName.textContent = student.l_name;
    tr.appendChild(tdName);
    
    // Prénom
    const tdFirstname = document.createElement('td');
    tdFirstname.textContent = student.f_name;
    tr.appendChild(tdFirstname);
    
    // Actions (retirer du groupe)
    const tdActions = document.createElement('td');
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Retirer du groupe';
    removeButton.className = 'remove-button';
    
    removeButton.onclick = () => removeStudentFromGroup(student._id);
    
    tdActions.appendChild(removeButton);
    tr.appendChild(tdActions);
    
    table.querySelector('tbody').appendChild(tr);
  });
  
  addGroupsDiv.appendChild(table);
};

// Créer la structure de table pour les étudiants
const createStudentTable = () => {
  const table = document.createElement('table');
  table.className = 'student-table';
  
  // En-tête du tableau
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  ['Numéro', 'Nom', 'Prénom', 'Actions'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Corps du tableau
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  
  return table;
};

// Assigner un étudiant à un groupe
const assignStudentToGroup = async (studentId, groupNumber) => {
  try {
    const response = await fetch('/api/groups/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentId, groupNumber })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'assignation au groupe');
    }
    
    showMessage(`Étudiant assigné au groupe ${groupNumber} avec succès`);
    loadStudentsWithoutGroup(); // Recharger les étudiants sans groupe
    
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Retirer un étudiant d'un groupe
const removeStudentFromGroup = async (studentId) => {
  try {
    const response = await fetch(`/api/groups/${studentId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du retrait du groupe');
    }
    
    showMessage('Étudiant retiré du groupe avec succès');
    
    // Recharger la liste appropriée
    if (currentGroup === null) {
      loadStudentsWithoutGroup();
    } else {
      loadStudentsInGroup(currentGroup);
    }
    
  } catch (error) {
    showMessage(error.message, true);
  }
};

// Initialiser les écouteurs d'événements pour les boutons de groupe
const initGroupButtons = () => {
  buttons.forEach((button, index) => {
    button.className = 'group-button';
    
    button.addEventListener('click', () => {
      updateSelectedButton(button);
      
      if (index === 0) {
        // "Aucun groupe" sélectionné
        currentGroup = null;
        loadStudentsWithoutGroup();
      } else {
        // Groupe 1-6 sélectionné
        currentGroup = index;
        loadStudentsInGroup(index);
      }
    });
  });
};

// Initialiser l'application
const initApp = () => {
  initGroupButtons();
  
  // Par défaut, charger les étudiants sans groupe
  buttons[0].click();
};

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);