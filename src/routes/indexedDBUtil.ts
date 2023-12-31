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
type Attributes = {
	Strength: number;
	Dexterity: number;
	Constitution: number;
	Intelligence: number;
	Wisdom: number;
	Charisma: number;
};
export function addToIndexedDB(db: IDBDatabase, attr: string | Attributes, type: string) {
	return new Promise((resolve, reject) => {
		if (db) {
			const transaction = db.transaction(['characters'], 'readwrite');
			const store = transaction.objectStore('characters');
			const getR = store.get(localStorage.getItem('name') ?? '');
			getR.onsuccess = () => {
				console.log(getR.result);
				const existingRecord = getR.result;
				if (existingRecord) {
					existingRecord[type] = attr;
					const updateRequest = store.put(existingRecord);
					updateRequest.onsuccess = function () {
						resolve('Character data updated in IndexedDB');
					};
					updateRequest.onerror = function () {
						reject('Error updating character data in IndexedDB');
					};
				}
			};

			getR.onerror = function () {
				reject('Error adding character data to IndexedDB');
			};
		} else {
			reject('Database not initialized.');
		}
	});
}

export function getCharacterDataFromIndexedDB(type: string, db: IDBDatabase) {
	return new Promise((resolve, reject) => {
		if (db) {
			const transaction = db.transaction(['characters'], 'readonly');
			const store = transaction.objectStore('characters');
			const getRequest = store.get(localStorage.getItem('name') || '');

			getRequest.onsuccess = function () {
				const characterData = getRequest.result;
				if (characterData) {
					if (type === 'race') {
						const race: string = characterData.race;
						resolve(race);
					} else if (type === 'class') {
						const charclass: string = characterData.class;
						resolve(charclass);
					} else if (type === 'name') {
						const name: string = characterData.name;
						resolve(name);
					} else {
						const attributes: string = characterData.attributes;
						resolve(attributes);
					}
				} else {
					reject('Character not found in IndexedDB');
				}
			};

			getRequest.onerror = function () {
				reject('Error fetching character data from IndexedDB');
			};
		} else {
			reject('Database not initialized.');
		}
	});
}
