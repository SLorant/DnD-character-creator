// indexedDBUtils.js

export function initializeIndexedDB() {
	return new Promise((resolve, reject) => {
		const dbName = 'DnDCharacterDB';
		const dbVersion = 1;
		const request = indexedDB.open(dbName, dbVersion);

		request.onsuccess = function () {
			const db = request.result;
			resolve(db);
		};

		request.onerror = () => {
			reject(request.error);
		};

		request.onupgradeneeded = function () {
			const db = request.result;

			if (!db.objectStoreNames.contains('characters')) {
				db.createObjectStore('characters', { keyPath: 'name' });
			}
		};
	});
}

export function addToIndexedDBFirst(db: IDBDatabase, name: string) {
	return new Promise((resolve, reject) => {
		if (db) {
			const transaction = db.transaction(['characters'], 'readwrite');
			const store = transaction.objectStore('characters');

			const request = store.put({ name: name });

			request.onsuccess = function () {
				resolve('Character data added to IndexedDB');
			};
		} else {
			reject('Database not initialized.');
		}
	});
}

export function addToIndexedDB(db: IDBDatabase, race: string) {
	return new Promise((resolve, reject) => {
		if (db) {
			const transaction = db.transaction(['characters'], 'readwrite');
			const store = transaction.objectStore('characters');
			const getR = store.get(localStorage.getItem('name') ?? '');
			getR.onsuccess = () => {
				console.log(getR.result);
				const existingRecord = getR.result;
				if (existingRecord) {
					// Update the existing record with the new race
					existingRecord.race = race;
					const updateRequest = store.put(existingRecord);
					updateRequest.onsuccess = function () {
						resolve('Character data updated in IndexedDB');
					};
					updateRequest.onerror = function () {
						reject('Error updating character data in IndexedDB');
					};
				}
			};
			// const character = {
			// 	username: 'vela',
			// 	race: race
			// 	// Add other character properties as needed
			// };
			// console.log(character);
			// const request = store.add(character);

			// request.onsuccess = function () {
			// 	resolve('Character data added to IndexedDB');
			// };

			getR.onerror = function () {
				reject('Error adding character data to IndexedDB');
			};
		} else {
			reject('Database not initialized.');
		}
	});
}
