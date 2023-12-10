class RegistroClasse {
    constructor() {
      this.studenti = [];
      this.currentId = 1; // Per generare id univoci per gli studenti
    }
  
    aggiungiStudente() {
        var name = document.getElementById("name").value;
        var lastName = document.getElementById("lastName").value;

        if (name.trim() === '' || lastName.trim() === '') {
            alert("Inserisci tutti i dati prima di inviare il form.");
            return; // Interrompi la funzione se mancano dati
        }

        if (localStorage.getItem("this.studenti") == null){
            this.studenti=[]
        }else{
            this.studenti =JSON.parse(localStorage.getItem("this.studenti"));
        }

        const maxId = Math.max(...this.studenti.map(student => student.id), 0);
        this.currentId = maxId + 1;

        var nuovoStudente = {
            name: name,
            lastName: lastName,
            id: this.currentId,
            voti: []
        };
        
        this.studenti.push(nuovoStudente);

        localStorage.setItem("this.studenti", JSON.stringify(this.studenti));
        this.visualizzaStudenti();
        document.getElementById("name").value = "";
        document.getElementById("lastName").value = "";
      
    }
  
    visualizzaStudenti() {
        var peopleList = [];
        if(localStorage.getItem("this.studenti") == null){
            this.studenti = [];
        }else{
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }
    
        peopleList = [...this.studenti];
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
        peopleList.forEach(function(element,index){
            html += "<tr class='align-middle'>";
            html += '<th scope="row" class="text-center">'+i+'</th>'
            html += '<td class="text-center">' + element.id + "</td>";
            html += '<td class="text-center">' + element.name + "</td>";
            html += '<td class="text-center">' + element.lastName + "</td>";
            html += '<td class="text-center"><button onclick="register.visualizzaVoti('+element.id+')" class="btn btn-outline-dark m-2">Voti ↓</button>'
            html += 
            '<td class="text-center"><button onclick="register.modificaStudente('+element.id+')"class="btn btn-outline-secondary">Edit</button><button onclick="register.rimuoviStudente('+element.id+')"class="btn btn-outline-danger m-2">Delete</button></td>';
            html +="</tr>";
            html += `<tr><td colspan='6'><div id='votiDetails_${element.id}' style='display: none;'> <h4 class="d-flex justify-content-center">Student grades</h4></div></td></tr>`;             
            i++;
        });

    document.querySelector("#crudTable tbody").innerHTML = html;
      
    }
    
    rimuoviStudente(id) {
        if (localStorage.getItem("this.studenti") == null) {
            this.studenti = [];
        } else {
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }
    
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
        document.getElementById("addStudent").style.display = "none";
        document.getElementById("updateStudent").style.display = "block";
        //var name2 = document.getElementById("name").value;
        //var lastName2 = document.getElementById("lastName").value;

        if(localStorage.getItem("this.studenti") == null){
            this.studenti = [];
        }else{
            this.studenti = JSON.parse(localStorage.getItem("this.studenti"));
        }

        const indice = this.studenti.findIndex(studente => studente.id === id);

        document.getElementById("name").value = this.studenti[indice].name;
        document.getElementById("lastName").value = this.studenti[indice].lastName;

        document.querySelector("#updateStudent").onclick = (function(){
           
            this.studenti[indice].name = document.getElementById("name").value;
            this.studenti[indice].lastName = document.getElementById("lastName").value;
            
            if (!(this.studenti[indice].name.trim() !== '' && this.studenti[indice].lastName.trim() !== '')){
                alert("Inserisci tutti i dati prima di inviare il form.");
                return;
            }

            localStorage.setItem("this.studenti", JSON.stringify(this.studenti));

            this.visualizzaStudenti();

            document.getElementById("name").value = "";
            document.getElementById("lastName").value = "";
            
            document.getElementById("addStudent").style.display = "block";
            document.getElementById("updateStudent").style.display = "none";  
        }).bind(this);
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

        const existingTable = sezioneVoti.querySelector('table');
        if (existingTable) {
            existingTable.remove();
        }
        
        const formHtml = `
            <form onsubmit="register.inserisciVoto(${id}, this); return false;">
            <div class="row">
            <div class="col">
                <label for="voto"><b>Voto:</b></label>
                <input type="number" class="form-control" placeholder="Voto" name="voto" id="voto" required>
            </div>
            <div class="col">
                <label for="data"><b>Data:</b></label>
                <input type="date" class="form-control" name="data" id="data" required>
            </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <label for="commento"><b>Commento:</b></label>
                    <textarea class="form-control" placeholder="Commento" name="commento" id="commento"></textarea>
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
                        <th scope="col" class="text-center">Data</th>
                        <th scope="col" class="text-center">Voto</th>
                        <th scope="col" class="text-center">Commento</th>
                        <th scope="col" class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.studenti
                        .find((studente) => studente.id === id)
                        .voti.map((voto, index) => `
                            <tr class="align-middle">
                                <th scope="row" class="text-center">${index + 1}</th>
                                <td class="text-center">${voto.data}</td>
                                <td class="text-center">${voto.voto}</td>
                                <td class="text-center">${voto.commento}</td>
                                <td class="text-center"><button onclick="register.modificaVoto('+element.id+')"class="btn btn-outline-secondary">Edit</button><button onclick="register.rimuoviVoto(${id}, ${voto.id})"class="btn btn-outline-danger m-2">Delete</button></td>
                            </tr>
                        `).join('')
                    }
                </tbody>
                </table>
            `;

        // Aggiungi il form sotto la sezione dei voti
        sezioneVoti.innerHTML += formHtml;
    }

    inserisciVoto(id, form) {
        if (!form) {
            console.error("Form is undefined");
            return;
        }
    
        const votoInput = form.querySelector('#voto');
        const dataInput = form.querySelector('#data');
        const commentoInput = form.querySelector('#commento');
    
        // Verifica se gli input sono presenti prima di accedere ai loro valori
        const voto = votoInput ? votoInput.value.toString().trim() : '';
        const data = dataInput ? dataInput.value.trim() : '';
        const commento = commentoInput ? commentoInput.value.trim() : '';
    
        console.log("Voto:", voto);
        console.log("Data:", data);
        console.log("Commento:", commento);
    
        if (voto === '' || data === '' || commento === '') {
            alert("Inserisci tutti i dati prima di inviare il form.");
            return;
        }

        const studente = this.studenti.find((studente) => studente.id === id);
        // Calcola il nuovo ID del voto
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
            votoInput.value = ""; // Pulisci i campi del form
            dataInput.value = "";
            commentoInput.value = "";
        } else {
            console.error("Studente non trovato con l'id:", id);
        }
    }

    rimuoviVoto(idStudente, idVoto) {
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

}

var register = new RegistroClasse();
window.onload = () => register.visualizzaStudenti();