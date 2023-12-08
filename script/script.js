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
        
        for(let student of this.studenti){
            if (this.currentId === student.id){
                this.currentId++;
            }
        }

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
                return 0;
            }
        
            // I cognomi sono uguali, non è necessario cambiare l'ordine
    
        });

        var html = "";
        var i = 1;
        peopleList.forEach(function(element,index){
            html += "<tr class='align-middle'>";
            html += '<th scope="row" class="text-center">'+i+'</th>'
            html += '<td class="text-center">' + element.id + "</td>";
            html += '<td class="text-center">' + element.name + "</td>";
            html += '<td class="text-center">' + element.lastName + "</td>";
            html += '<td class="text-center"><button onclick="visualizzaVoti()" class="btn btn-outline-dark m-2">Voti ↓</button>'
            html += 
            '<td class="text-center"><button onclick="updateData('+index+')"class="btn btn-outline-secondary">Edit</button><button onclick="deleteData('+index+')"class="btn btn-outline-danger m-2">Delete</button></td>';
            html +="</tr>";
            i++;
        });

    document.querySelector("#crudTable tbody").innerHTML = html;
      
    }
  
}

var register = new RegistroClasse();
window.onload = () => register.visualizzaStudenti();