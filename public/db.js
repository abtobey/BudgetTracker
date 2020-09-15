let db;
// create a new db request for a "budget" database.
const request=window.indexedDB.open("pending", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  // create object store called "pending" and set autoIncrement to true
  const pending= db.createObjectStore("pending", {autoIncrement: true})
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(err);
  // log error here
};

function saveRecord(record) {
  const transaction= db.transaction(["pending"], "readwrite")
  const pendingStore= transaction.objectStore("pending");
  const saveRecord=pendingStore.add(record)
  saveRecord.onsuccess = function() {
    console.log(record);
  }
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
}

function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  const transaction= db.transaction(["pending"], "readwrite")
  const pendingStore= transaction.objectStore("pending");
  const getAllRecords =pendingStore.getAll();

  getAllRecords.onsuccess = function () {
    if (getAllRecords.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAllRecords.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          const deleteTransaction = db.transaction(["pending"], "readwrite")
          const deleteStore= deleteTransaction.objectStore("pending");
          const deleteRequest=deleteStore.clear();
          deleteRequest.onSuccess = function (){
            console.log("ok");
          }
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
