class RegistroClasse {
    constructor() {
      this.studenti = [];
      this.currentId = 1; // Per generare id univoci per gli studenti
    }
  
    aggiungiStudente() {
        var name = document.getElementById("name").value;
        var lastName = document.getElementById("lastName").value;

        if (localStorage.getItem("this.studenti") == null){
            this.studenti = []
        }else{
            this.studenti =JSON.parse(localStorage.getItem("this.studenti"));
        }

        var nuovoStudente = {
            name: name,
            lastName: lastName,
            id: this.currentId++,
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
        
            if (cognomeA < cognomeB) {
                return -1;
            }
            if (cognomeA > cognomeB) {
                return 1;
            }
        
            // I cognomi sono uguali, non è necessario cambiare l'ordine
            return 0;
        });

        var html = "";
        var i = 1;
        peopleList.forEach(function(element,index){
            //var index = 1
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