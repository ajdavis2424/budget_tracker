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
  
// saveRecord function to save transactions
// open trans w/pending object store to be able to open and save later
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
      const pendstore = transaction.objectStore("pending");

      pendstore.add(record);
}

function checkOurDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendStore = transaction.objectStore("pending");


}


window.addEventListener("online", checkOurDatabase); 




