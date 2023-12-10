class RegistroClasse {
    constructor() {
      this.studenti = [];
      this.currentId = 1; // Per generare id univoci per gli studenti
    }
  
    aggiungiStudente() {
        // Ottieni i valori dei campi nome e cognome dal form
        var name = document.getElementById("name").value;
        var lastName = document.getElementById("lastName").value;

        // Verifica se sono stati forniti entrambi i dati
        if (name.trim() === '' || lastName.trim() === '') {
            alert("Inserisci tutti i dati prima di inviare il form.");
            return; // Interrompi la funzione se mancano dati
        }

        // Controlla se esistono dati salvati in localStorage per gli studenti
        if (localStorage.getItem("this.studenti") == null){
            this.studenti=[]
        }else{
            this.studenti =JSON.parse(localStorage.getItem("this.studenti"));
        }

        // Trova il massimo ID tra gli studenti esistenti per generare un nuovo ID univoco
        const maxId = Math.max(...this.studenti.map(student => student.id), 0);
        this.currentId = maxId + 1;

        // Crea un nuovo oggetto studente con i dati forniti e l'ID generato
        var nuovoStudente = {
            name: name,
            lastName: lastName,
            id: this.currentId,
            voti: []
        };
        
        // Aggiungi il nuovo studente all'array degli studenti
        this.studenti.push(nuovoStudente);

        // Salva l'array aggiornato in localStorage
        localStorage.setItem("this.studenti", JSON.stringify(this.studenti));
        
        // Aggiorna la visualizzazione degli studenti nella tabella
        this.visualizzaStudenti();

        // Pulisci i campi del form dopo l'aggiunta dello studente
        document.getElementById("name").value = "";
        document.getElementById("lastName").value = "";
    }
  
    visualizzaStudenti() {
        var peopleList = [];
        
        // Controlla se esistono dati salvati in localStorage per gli studenti
        if(localStorage.getItem("this.studenti") == null){
            this.studenti = [];
        }else{
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }
    
        // Crea una copia dell'array degli studenti per evitare modifiche dirette
        peopleList = [...this.studenti];

        // Ordina l'array degli studenti in base al cognome e al nome
        peopleList.sort(function(a, b) {
            var cognomeA = a.lastName.toUpperCase(); // Converti in maiuscolo per ordinamento senza distinzione tra maiuscole e minuscole
            var cognomeB = b.lastName.toUpperCase();
            var nomeA = a.name.toUpperCase();
            var nomeB = b.name.toUpperCase();
        
            if (cognomeA < cognomeB) {
                return -1;
            }
            else if (cognomeA > cognomeB) {
                return 1;
            }
            else if(cognomeA === cognomeB){
                if(nomeA < nomeB){
                    return -1;
                }else if(nomeA > nomeB){
                    return 1;
                }else{
                    return 0;
                }
                
            }else{
                // I cognomi e i nomi sono uguali, non è necessario cambiare l'ordine
                return 0;
            }
        });

        var html = "";
        var i = 1;

        // Itera attraverso la lista di studenti ordinata e costruisci la stringa HTML per la tabella
        peopleList.forEach(function(element,index){
            html += "<tr class='align-middle'>";
            html += '<th scope="row" class="text-center">'+i+'</th>'
            html += '<td class="text-center">' + element.id + "</td>";
            html += '<td class="text-center">' + element.name + "</td>";
            html += '<td class="text-center">' + element.lastName + "</td>";
            html += '<td class="text-center"><button onclick="register.visualizzaVoti('+element.id+')" class="btn btn-outline-dark m-2">Grade ↓</button>'
            html += 
            '<td class="text-center"><button onclick="register.modificaStudente('+element.id+')"class="btn btn-outline-secondary">Edit</button><button onclick="register.rimuoviStudente('+element.id+')"class="btn btn-outline-danger m-2">Delete</button></td>';
            html +="</tr>";
            html += `<tr><td colspan='6'><div id='votiDetails_${element.id}' style='display: none;'> <h4 class="d-flex justify-content-center">Student grades</h4></div></td></tr>`;             
            i++;
        });

        // Inserisci la stringa HTML risultante nella sezione tbody della tabella con id "crudTable"
        document.querySelector("#crudTable tbody").innerHTML = html;
    }
    
    rimuoviStudente(id) {
        // Controlla se esistono dati salvati in localStorage per gli studenti
        if (localStorage.getItem("this.studenti") == null) {
            this.studenti = [];
        } else {
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }
    
        // Trova l'indice dello studente con l'id specificato all'interno dell'array degli studenti
        const indice = this.studenti.findIndex(studente => studente.id === id);
    
        if (indice !== -1) {
            // Rimuovi l'elemento solo se l'indice è valido
            this.studenti.splice(indice, 1);
            localStorage.setItem("this.studenti", JSON.stringify(this.studenti));
            this.visualizzaStudenti();
        } else {
            console.error("Studente non trovato con l'id:", id);
        }
      }

    modificaStudente(id) {
        // Nasconde il form di aggiunta studente e mostra quello di modifica
        document.getElementById("addStudent").style.display = "none";
        document.getElementById("updateStudent").style.display = "block";

        // Controlla se esistono dati salvati in localStorage per gli studenti
        if(localStorage.getItem("this.studenti") == null){
            this.studenti = [];
        }else{
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }

        // Trova l'indice dello studente con l'id specificato all'interno dell'array degli studenti
        const indice = this.studenti.findIndex(studente => studente.id === id);

        // Popola i campi del form di modifica con i dati dello studente corrispondente
        document.getElementById("name").value = this.studenti[indice].name;
        document.getElementById("lastName").value = this.studenti[indice].lastName;

        // Definisce l'azione da eseguire al click del pulsante di aggiornamento
        document.querySelector("#updateStudent").onclick = (function(){
           // Aggiorna i dati dello studente con quelli inseriti nel form di modifica
            this.studenti[indice].name = document.getElementById("name").value;
            this.studenti[indice].lastName = document.getElementById("lastName").value;
            
            if (!(this.studenti[indice].name.trim() !== '' && this.studenti[indice].lastName.trim() !== '')){
                alert("Inserisci tutti i dati prima di inviare il form.");
                return;
            }

            localStorage.setItem("this.studenti", JSON.stringify(this.studenti));

            this.visualizzaStudenti();

            // Pulisci i campi del form dopo l'aggiornamento dello studente
            document.getElementById("name").value = "";
            document.getElementById("lastName").value = "";
            
            // Ripristina la visualizzazione del form di aggiunta studente e nasconde quello di modifica
            document.getElementById("addStudent").style.display = "block";
            document.getElementById("updateStudent").style.display = "none";  
        }).bind(this); // Utilizza la funzione bind per assicurarsi che il riferimento a "this" all'interno della funzione sia quello corretto
    }  

    visualizzaVoti(id) {
        const sezioneVotiId = `votiDetails_${id}`;

        // Sezione dei voti corrispondente a questo studente
        const sezioneVoti = document.getElementById(sezioneVotiId);

        // Verifica lo stato attuale di visualizzazione
        const isVisualizzato = sezioneVoti.style.display === "block";

        // Nascondi tutte le sezioni dei voti tranne quella corrispondente a questo studente
        document.querySelectorAll('[id^="votiDetails_"]').forEach((element) => {
            element.style.display = "none";
        });

        // Se la sezione dei voti era già visualizzata, nascondila
        if (isVisualizzato) {
            sezioneVoti.style.display = "none";
        } else {
            // Altrimenti, mostra la sezione dei voti corrispondente a questo studente
            sezioneVoti.style.display = "block";
        }

        // Rimuovi il form esistente se presente
        const existingForm = sezioneVoti.querySelector('form');
        if (existingForm) {
            existingForm.remove();
        }
        
        // Rimuovi la table esistente se presente
        const existingTable = sezioneVoti.querySelector('table');
        if (existingTable) {
            existingTable.remove();
        }

        const studente = this.studenti.find((studente) => studente.id === id);

        // Clona l'array dei voti
        const votiCopia = [...studente.voti];

        // Ordina l'array clonato in base alla data
        votiCopia.sort((a, b) => new Date(a.data) - new Date(b.data));
        
        // Crea il markup HTML per il form di inserimento/modifica voti e la tabella dei voti
        const formHtml = `
            <form onsubmit="register.inserisciVoto(${id}, this); return false;">
                <div class="row">
                <div class="col">
                    <label for="voto"><b>Grade:</b></label>
                    <input type="number" class="form-control" placeholder="Grade" name="voto" id="voto" required>
                </div>
                <div class="col">
                    <label for="data"><b>Date:</b></label>
                    <input type="date" class="form-control" name="data" id="data" placeholder="dd/mm/yy" required>
                </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <label for="commento"><b>Comment:</b></label>
                        <textarea class="form-control" placeholder="Comment" name="commento" id="commento" required></textarea>
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-4 mb-4">
                    <button type="submit" class="btn btn-success" id="addVoto" onclick="register.inserisciVoto(${id},this)">Add Voto</button>
                    <button type="submit" class="btn btn-primary" id="updateVoto" onclick="register.modificaVoto()">Update Voto</button>
                </div>
            </form>
            <table class="table table-bordered" id="votiTable">
                <thead>
                    <tr class="align-middle">
                        <th scope="col" class="text-center">#</th>
                        <th scope="col" class="text-center">Date</th>
                        <th scope="col" class="text-center">Grade</th>
                        <th scope="col" class="text-center">Comment</th>
                        <th scope="col" class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${votiCopia.map((voto, index) => `
                        <tr class="align-middle">
                            <th scope="row" class="text-center">${index + 1}</th>
                            <td class="text-center">${voto.data}</td>
                            <td class="text-center">${voto.voto}</td>
                            <td class="text-center">${voto.commento}</td>
                            <td class="text-center">
                                <button onclick="register.modificaVoto(${id}, ${voto.id})" class="btn btn-outline-secondary">Edit</button>
                                <button onclick="register.rimuoviVoto(${id}, ${voto.id})" class="btn btn-outline-danger m-2">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
                </table>
            `;

        // Aggiungi il form sotto la sezione dei voti
        sezioneVoti.innerHTML += formHtml;
    }

    // La funzione inserisciVoto prende l'id dello studente e il riferimento al form come parametri
    inserisciVoto(id, form) {
        // Verifica se il form è definito; se non lo è, mostra un messaggio di errore e interrompi la funzione
        if (!form) {
            console.error("Form is undefined");
            return;
        }
    
        // Ottieni riferimenti agli elementi input del form per il voto, la data e il commento
        const votoInput = form.querySelector('#voto');
        const dataInput = form.querySelector('#data');
        const commentoInput = form.querySelector('#commento');
    
        // Verifica se gli input sono presenti prima di accedere ai loro valori
        const voto = votoInput ? votoInput.value.toString().trim() : '';
        const data = dataInput ? dataInput.value.trim() : '';
        const commento = commentoInput ? commentoInput.value.trim() : '';
    
        //console.log("Voto:", voto);
        //console.log("Data:", data);
        //console.log("Commento:", commento);
    
        // Verifica se tutti i campi del form sono stati compilati; se non lo sono, mostra un messaggio di errore e interrompi la funzione
        if (voto == '' || data == '' || commento == '') {
            alert("Inserisci tutti i dati prima di inviare il form.");
            return;
        }

        // Trova lo studente corrispondente nell'array degli studenti
        const studente = this.studenti.find((studente) => studente.id === id);

        // Calcola il nuovo ID del voto, incrementando l'ID massimo tra i voti dello studente
        const idVoto = studente.voti.length > 0 ? Math.max(...studente.voti.map(v => v.id)) + 1 : 1;

    
        if (studente) {
            // Aggiungi il nuovo voto allo studente
            studente.voti.push({
                voto: voto,
                data: data,
                commento: commento,
                id: idVoto
            });
            console.log(idVoto);
    
            // Aggiorna il localStorage con l'array aggiornato di studenti
            localStorage.setItem("this.studenti", JSON.stringify(this.studenti));
    
            // Aggiorna la visualizzazione degli studenti
            this.visualizzaStudenti();

            // Pulisci i campi del form
            votoInput.value = "";
            dataInput.value = "";
            commentoInput.value = "";
        } else {
            console.error("Studente non trovato con l'id:", id);
        }
    }

    rimuoviVoto(idStudente, idVoto) {
        // Controlla se esistono dati salvati in localStorage per gli studenti
        if (localStorage.getItem("this.studenti") == null) {
            this.studenti = [];
        } else {
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }
    
        const studente = this.studenti.find(studente => studente.id === idStudente);
    
        if (studente) {
            // Trova l'indice del voto con l'id specificato all'interno dell'array voti
            const indiceVoto = studente.voti.findIndex(voto => voto.id === idVoto);

            // Verifica se l'indice del voto è valido
            if (indiceVoto !== -1) {
                // Rimuovi il voto dall'array
                studente.voti.splice(indiceVoto, 1);

                // Aggiorna il localStorage con l'array aggiornato di studenti
                localStorage.setItem("this.studenti", JSON.stringify(this.studenti));

                // Aggiorna la visualizzazione degli studenti
                this.visualizzaStudenti();
            } else {
                console.error("Indice voto non valido:", indiceVoto);
            }
        } else {
            console.error("Studente non trovato con l'id:", idStudente);
        }
    }

    // La funzione modificaVoto prende gli id dello studente e del voto come parametri
    modificaVoto(idStudente, idVoto) {
        // Nascondi il pulsante "Aggiungi Voto" e mostra il pulsante "Aggiorna Voto"
        document.getElementById("addVoto").style.display = "none";
        document.getElementById("updateVoto").style.display = "block";

        // Controlla se esistono dati salvati in localStorage per gli studenti
        if(localStorage.getItem("this.studenti") == null){
            this.studenti = [];
        }else{
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }

        // Trova lo studente corrispondente nell'array degli studenti
        const studente = this.studenti.find(studente => studente.id === idStudente);
        
        if (studente){
            // Trova l'indice del voto nell'array dei voti dello studente
            const indiceVoto = studente.voti.findIndex(voto => voto.id === idVoto);

            // Popola i campi del form con i valori attuali del voto
            document.getElementById("data").value = studente.voti[indiceVoto].data;
            document.getElementById("voto").value = studente.voti[indiceVoto].voto;
            document.getElementById("commento").value = studente.voti[indiceVoto].commento;

            // Aggiungi un gestore di eventi al pulsante "Aggiorna Voto"
            document.querySelector("#updateVoto").onclick = (function(){
                // Aggiorna i valori del voto con quelli inseriti dall'utente
                studente.voti[indiceVoto].data = document.getElementById("data").value;
                studente.voti[indiceVoto].voto = document.getElementById("voto").value;
                studente.voti[indiceVoto].commento = document.getElementById("commento").value;
                
                // Verifica se tutti i campi del form sono stati compilati; se non lo sono, mostra un messaggio di errore e interrompi la funzione
                if (!(studente.voti[indiceVoto].data.trim() !== '' && studente.voti[indiceVoto].voto.trim() !== ''  && studente.voti[indiceVoto].commento.trim() !== '')){
                    alert("Inserisci tutti i dati prima di inviare il form.");
                    return;
                }

                // Aggiorna il localStorage con l'array aggiornato di studenti
                localStorage.setItem("this.studenti", JSON.stringify(this.studenti));

                this.visualizzaStudenti();
            }).bind(this); // Assicura che il contesto "this" rimanga quello dell'istanza corrente della classe
        }
    }  

}

// Istanzia un nuovo oggetto RegistroClasse e lo assegna a una variabile chiamata 'register'
var register = new RegistroClasse();

// Quando l'intera finestra è stata caricata, esegui la seguente funzione
window.onload = () => register.visualizzaStudenti();