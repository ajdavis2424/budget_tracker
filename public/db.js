const iDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

let db;
const request = iDB.open("budgetDB", 1);

// requewsting object with method
request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  }; 
  request.onsuccess = ({target}) => {
	db = target.result;
    // this makes sure the app is online before pulling from the datatbase
	if (navigator.onLine) {
		checkOurDatabase();
	}
};
  
// This is for errors of the retrieving records from the indexedDB
request.onerror = (event) => {
    console.log(`\nREQUEST ERROR: \n${event.target}\n`);
    }

// saveRecord function to save transactions
// open trans w/pending object store to be able to open and save later
function saveRecord(record) {
    // start transaction
    const transaction = db.transaction(["pending"], "readwrite");
   const pendstore = transaction.objectStore("pending");

      pendstore.add(record);
}

function checkOurDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendStore = transaction.objectStore("pending");
    const allPend = pendStore.getAll();


// Handle the successful retrieval of the records from the indexed DB
allPend.onsuccess = () => {
    //  A record  in indexDB, they'll be sent tp the server
    if(allPend.length > 0){

        // Adding fetch web API requestto checkOurDatabase function
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(allPending.result),
            headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
            }
      })  
      .then(response => response.json())
                  .then(() => {
                      // Clears record from indexDB if everything works
                      const transaction = db.transaction(["pending"], "readwrite");
                      const pendStore = transaction.objectStore("pending");
                      pendStore.clear();
                });
         }
    }
}

window.addEventListener("online", checkOurDatabase); 




